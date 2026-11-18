import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const ICONE_ONIBUS = L.divIcon({
  html: '<div class="bus-marker">🚌</div>',
  className: '', iconSize: [40, 40], iconAnchor: [20, 20],
})

// Ponto de ônibus no estilo do Google Maps
const ICONE_PARADA = L.divIcon({
  html: `<div class="stop-marker"><svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path fill="#fff" d="M4 16c0 .9.4 1.7 1 2.2V20a1 1 0 001 1h1a1 1 0 001-1v-1h8v1a1 1 0 001 1h1a1 1 0 001-1v-1.8c.6-.5 1-1.3 1-2.2V6c0-3.5-3.6-4-8-4S4 2.5 4 6v10zm3.5 1a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm9 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3zM18 11H6V6h12v5z"/></svg></div>`,
  className: '', iconSize: [24, 24], iconAnchor: [12, 12],
})

// Pin da faculdade (capelo) com o nome ao lado, como no Google Maps
const iconeFaculdade = (nome) => L.divIcon({
  html: `<div class="poi-pin">
    <svg width="36" height="44" viewBox="0 0 36 44" aria-hidden="true">
      <path d="M18 0C8 0 0 8 0 18c0 13 18 26 18 26s18-13 18-26C36 8 28 0 18 0z" fill="#4f6fb8"/>
      <path d="M18 9 L28 14 L18 19 L8 14 Z" fill="#fff"/>
      <path d="M12 17v4c0 2.4 12 2.4 12 0v-4l-6 3z" fill="#fff"/>
    </svg>
    <span class="poi-label">${nome}</span>
  </div>`,
  className: '', iconSize: [36, 44], iconAnchor: [18, 44],
})

/** Só desenha o que vem do back end: rota, paradas, campus e posição do veículo. */
export default function Mapa({ rota, paradas, campus, veiculo, seguir, onArrastar }) {
  const container = useRef(null)
  const mapa = useRef(null)
  const linha = useRef(null)
  const campusMk = useRef(null)
  const onibus = useRef(null)
  const grupoParadas = useRef(null)

  useEffect(() => {
    mapa.current = L.map(container.current, { zoomControl: false }).setView([-12.952, -38.423], 15)
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
      attribution: '&copy; Esri',
    }).addTo(mapa.current)
    grupoParadas.current = L.layerGroup().addTo(mapa.current)
    mapa.current.on('dragstart', () => onArrastar?.())

    // Recalcula o tamanho sempre que o container mudar (evita mapa branco)
    const observador = new ResizeObserver(() => mapa.current?.invalidateSize())
    observador.observe(container.current)

    return () => {
      observador.disconnect()
      mapa.current.remove()
      mapa.current = linha.current = campusMk.current = onibus.current = grupoParadas.current = null
    }
  }, [])

  useEffect(() => {
    if (!rota?.length) return
    linha.current?.remove()
    linha.current = L.polyline(rota, { color: '#4f46e5', weight: 5, opacity: 0.85 }).addTo(mapa.current)
    mapa.current.fitBounds(linha.current.getBounds(), { padding: [60, 60] })
  }, [rota])

  // Pontos de ônibus
  useEffect(() => {
    grupoParadas.current.clearLayers()
    paradas?.forEach((p) =>
      L.marker([p.lat, p.lng], { icon: ICONE_PARADA, title: p.nome })
        .bindPopup(`<strong>${p.nome}</strong><br>${p.descricao ?? ''}`)
        .addTo(grupoParadas.current)
    )
  }, [paradas])

  // Faculdade
  useEffect(() => {
    campusMk.current?.remove()
    const destino = campus ? [campus.lat, campus.lng] : rota?.[rota.length - 1]
    if (!destino) return
    campusMk.current = L.marker(destino, { icon: iconeFaculdade(campus?.nome ?? 'UCSal'), zIndexOffset: 500 }).addTo(mapa.current)
  }, [campus, rota])

  useEffect(() => {
    if (!veiculo) return
    const pos = [veiculo.lat, veiculo.lng]
    if (!onibus.current) onibus.current = L.marker(pos, { icon: ICONE_ONIBUS, zIndexOffset: 1000 }).addTo(mapa.current)
    else onibus.current.setLatLng(pos)
    if (seguir) mapa.current.panTo(pos)
  }, [veiculo, seguir])

  return <div ref={container} className="mapa" />
}
