import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const ICONE_ONIBUS = L.divIcon({
  html: '<div class="bus-marker">🚌</div>',
  className: '', iconSize: [40, 40], iconAnchor: [20, 20],
})

const ICONE_BUS_SVG = `<svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path fill="#fff" d="M4 16c0 .9.4 1.7 1 2.2V20a1 1 0 001 1h1a1 1 0 001-1v-1h8v1a1 1 0 001 1h1a1 1 0 001-1v-1.8c.6-.5 1-1.3 1-2.2V6c0-3.5-3.6-4-8-4S4 2.5 4 6v10zm3.5 1a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm9 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3zM18 11H6V6h12v5z"/></svg>`

// Ponto de ônibus (estilo Google Maps) ou, no último ponto, o pin da faculdade
function iconeDe(parada, ehCampus, selecionada) {
  if (ehCampus) {
    return L.divIcon({
      html: `<div class="poi-pin${selecionada ? ' poi-selected' : ''}">
        <svg width="36" height="44" viewBox="0 0 36 44" aria-hidden="true">
          <path d="M18 0C8 0 0 8 0 18c0 13 18 26 18 26s18-13 18-26C36 8 28 0 18 0z" fill="#4f6fb8"/>
          <path d="M18 9 L28 14 L18 19 L8 14 Z" fill="#fff"/>
          <path d="M12 17v4c0 2.4 12 2.4 12 0v-4l-6 3z" fill="#fff"/>
        </svg>
        <span class="poi-label">${parada.nome}</span></div>`,
      className: '', iconSize: [36, 44], iconAnchor: [18, 44],
    })
  }
  return L.divIcon({
    html: `<div class="stop-marker${selecionada ? ' stop-selected' : ''}">${ICONE_BUS_SVG}</div>`,
    className: '', iconSize: [24, 24], iconAnchor: [12, 12],
  })
}

/**
 * Por padrão mostra SÓ os pontos de parada.
 * Ao tocar em um ponto (selecionadaId), aparecem a linha do trajeto e o ônibus.
 */
export default function Mapa({ paradas, selecionadaId, onSelecionar, trajeto, trajetoSaida, veiculo, focoOnibus }) {
  const container = useRef(null)
  const mapa = useRef(null)
  const marcadores = useRef(new Map())
  const linha = useRef(null)
  const linhaSaida = useRef(null)
  const onibus = useRef(null)
  const ajustou = useRef(false)
  const onSelecionarRef = useRef(onSelecionar)
  onSelecionarRef.current = onSelecionar

  useEffect(() => {
    mapa.current = L.map(container.current, { zoomControl: false }).setView([-12.952, -38.423], 15)
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
      attribution: '&copy; Esri',
    }).addTo(mapa.current)
    mapa.current.on('click', () => onSelecionarRef.current?.(null)) // tocar no mapa limpa a seleção

    const observador = new ResizeObserver(() => mapa.current?.invalidateSize())
    observador.observe(container.current)

    return () => {
      observador.disconnect()
      mapa.current.remove()
      mapa.current = linha.current = linhaSaida.current = onibus.current = null
      marcadores.current = new Map()
      ajustou.current = false
    }
  }, [])

  // Pontos de parada
  useEffect(() => {
    const m = mapa.current
    if (!m) return
    marcadores.current.forEach((x) => x.marker.remove())
    marcadores.current.clear()
    paradas.forEach((p, i) => {
      const ehCampus = i === paradas.length - 1
      const marker = L.marker([p.lat, p.lng], { icon: iconeDe(p, ehCampus, false), title: p.nome, zIndexOffset: ehCampus ? 500 : 0 })
        .on('click', () => onSelecionarRef.current?.(p.id))
        .addTo(m)
      marcadores.current.set(p.id, { marker, p, ehCampus })
    })
    if (paradas.length && !ajustou.current) {
      m.fitBounds(L.latLngBounds(paradas.map((p) => [p.lat, p.lng])), { padding: [60, 60] })
      ajustou.current = true
    }
  }, [paradas])

  // Destaque do ponto selecionado
  useEffect(() => {
    marcadores.current.forEach(({ marker, p, ehCampus }) => marker.setIcon(iconeDe(p, ehCampus, p.id === selecionadaId)))
  }, [paradas, selecionadaId])

  // Linhas do trajeto: só com um ponto selecionado
  // Roxa contínua = chegada (pontos -> UCSal). Laranja tracejada = saída (UCSal -> pontos).
  useEffect(() => {
    linha.current?.remove()
    linhaSaida.current?.remove()
    linha.current = linhaSaida.current = null
    if (selecionadaId == null || !mapa.current) return
    if (trajeto?.length) linha.current = L.polyline(trajeto, { color: '#4f46e5', weight: 5, opacity: 0.85 }).addTo(mapa.current)
    if (trajetoSaida?.length) linhaSaida.current = L.polyline(trajetoSaida, { color: '#f59e0b', weight: 5, opacity: 0.95, dashArray: '10 10' }).addTo(mapa.current)
  }, [selecionadaId, trajeto, trajetoSaida])

  // Ônibus: só com um ponto selecionado
  useEffect(() => {
    if (!mapa.current) return
    if (selecionadaId == null || !veiculo) {
      onibus.current?.remove()
      onibus.current = null
      return
    }
    const pos = [veiculo.lat, veiculo.lng]
    if (!onibus.current) onibus.current = L.marker(pos, { icon: ICONE_ONIBUS, zIndexOffset: 1000 }).addTo(mapa.current)
    else onibus.current.setLatLng(pos)
  }, [selecionadaId, veiculo])

  // Botão "centralizar no ônibus"
  useEffect(() => {
    if (!focoOnibus || !veiculo || !mapa.current) return
    mapa.current.flyTo([veiculo.lat, veiculo.lng], 16, { duration: 1 })
  }, [focoOnibus])

  return <div ref={container} className="mapa" />
}
