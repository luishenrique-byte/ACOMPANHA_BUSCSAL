/**
 * Camada de acesso ao back end (adaptador).
 * Os componentes continuam chamando só as funções de `api` daqui; esta camada
 * traduz o que o back entrega para o formato que as telas já usam.
 *
 * Back end real (prefixo /v1):
 *   GET /rota                      -> [{ id, nome, descricao, ativa }]         (só rotas ativas)
 *   GET /ponto-parada/{idRota}     -> [{ id, nome, latitude, longitude, ordem, idRota }]
 *   GET /viagem                    -> viagens ativas [{ id, status, rota, veiculo, ... }]
 *   GET /posicaoGPS/ultima/{id}    -> { latitude, longitude, velocidade, dataHora, ... }
 *   Erros                          -> { mensagem, status, listaErros: [{ campo, erro }] }
 *
 * Ainda NÃO existe no back: login, trajeto pelas ruas (Directions), campus, ETA.
 *   - trajeto: linha ligando as paradas em ordem
 *   - campus: constante CAMPUS abaixo
 *   - ETA/distância: calculados aqui (estimativa)
 *   - login: mock até o back criar o endpoint
 *
 * Variáveis (.env):
 *   VITE_API_URL     ex.: http://localhost:8080/v1
 *   VITE_USE_MOCK    true = tudo simulado, sem back
 *   VITE_MOCK_LOGIN  true = só o login é simulado (back real para o resto)
 */
import { mockLogin, mockRota, mockVeiculo, mockParadas, mockCampus } from './mock.js'

const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8080/v1'
const USAR_MOCK = import.meta.env.VITE_USE_MOCK === 'true'
const MOCK_LOGIN = USAR_MOCK || import.meta.env.VITE_MOCK_LOGIN === 'true'

// Campus de destino (o back ainda não fornece). Ajuste se precisar.
const CAMPUS = { nome: 'Universidade Católica do Salvador - UCSal', lat: -12.9482, lng: -38.4137 }
const VELOCIDADE_MEDIA_KMH = 25 // usada no ETA quando o GPS não informa velocidade útil

async function req(caminho, opcoes = {}) {
  const token = sessionStorage.getItem('token')
  const resp = await fetch(BASE + caminho, {
    ...opcoes,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...opcoes.headers,
    },
  })
  // Sessão expirada: só desloga se NÃO for a própria tela de login errando a senha
  if (resp.status === 401 && !caminho.startsWith('/auth/')) {
    sessionStorage.clear()
    window.location.reload()
  }
  if (!resp.ok) {
    const corpo = await resp.json().catch(() => ({}))
    const detalhe = corpo.listaErros?.map((e) => e.erro).join(' ')
    throw new Error(corpo.mensagem || detalhe || 'Não foi possível concluir a requisição.')
  }
  return resp.status === 204 ? null : resp.json()
}

// Mantido caso o back passe a devolver polyline do Google Directions
export function decodificarPolyline(texto) {
  const pontos = []
  let i = 0, lat = 0, lng = 0
  while (i < texto.length) {
    for (const eixo of ['lat', 'lng']) {
      let b, deslocamento = 0, resultado = 0
      do {
        b = texto.charCodeAt(i++) - 63
        resultado |= (b & 0x1f) << deslocamento
        deslocamento += 5
      } while (b >= 0x20)
      const delta = resultado & 1 ? ~(resultado >> 1) : resultado >> 1
      if (eixo === 'lat') lat += delta
      else lng += delta
    }
    pontos.push([lat / 1e5, lng / 1e5])
  }
  return pontos
}

// ---------- utilidades ----------
function metros([lat1, lng1], [lat2, lng2]) {
  const R = 6371000
  const rad = (g) => (g * Math.PI) / 180
  const a = Math.sin(rad(lat2 - lat1) / 2) ** 2 +
    Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(rad(lng2 - lng1) / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(a))
}

// Distância do ônibus até o fim da rota, seguindo os pontos (aproximada)
function distanciaRestante(pos, rota) {
  if (!rota.length) return 0
  let iMin = 0, dMin = Infinity
  rota.forEach((p, i) => { const d = metros(pos, p); if (d < dMin) { dMin = d; iMin = i } })
  let total = dMin
  for (let i = iMin; i < rota.length - 1; i++) total += metros(rota[i], rota[i + 1])
  return total
}

// Rota ativa + pontos, buscados uma vez e reaproveitados
let contexto = null
function carregarContexto() {
  if (!contexto) {
    contexto = (async () => {
      const rotas = await req('/rota')
      const rota = rotas[0]
      if (!rota) throw new Error('Nenhuma rota ativa no momento.')
      const pontos = await req(`/ponto-parada/${rota.id}`)
      return { rota, pontos: [...pontos].sort((a, b) => a.ordem - b.ordem) }
    })().catch((e) => { contexto = null; throw e })
  }
  return contexto
}

// ---------- API usada pelas telas ----------
export const api = {
  async login(matricula, perfil) {
    if (MOCK_LOGIN) return mockLogin(matricula, perfil)
    // TODO: ajustar quando o back criar o endpoint de login
    return req('/auth/login', { method: 'POST', body: JSON.stringify({ matricula, perfil }) })
  },

  // O parâmetro linhaId é mantido por compatibilidade; o back usa a primeira rota ativa.
  async buscarRota() {
    if (USAR_MOCK) return mockRota()
    const { pontos } = await carregarContexto()
    return pontos.map((p) => [p.latitude, p.longitude])
  },

  async buscarParadas() {
    if (USAR_MOCK) return mockParadas()
    const { rota, pontos } = await carregarContexto()
    return pontos.map((p) => ({
      id: p.id,
      nome: p.nome,
      descricao: `${p.ordem}ª parada · ${rota.nome}`,
      lat: p.latitude,
      lng: p.longitude,
    }))
  },

  async buscarCampus() {
    if (USAR_MOCK) return mockCampus()
    return CAMPUS
  },

  async buscarVeiculo() {
    if (USAR_MOCK) return mockVeiculo()
    const { rota, pontos } = await carregarContexto()
    const viagens = await req('/viagem')
    const viagem = viagens.find((v) => v.rota?.id === rota.id && v.status !== 'FINALIZADA')
    if (!viagem) throw new Error('Nenhuma viagem em andamento.')

    const gps = await req(`/posicaoGPS/ultima/${viagem.id}`)
    const pos = [gps.latitude, gps.longitude]
    const trajeto = [...pontos.map((p) => [p.latitude, p.longitude]), [CAMPUS.lat, CAMPUS.lng]]
    const dist = distanciaRestante(pos, trajeto)
    // velocidade do GPS (km/h), com piso para não dar ETA infinito quando parado
    const kmh = gps.velocidade >= 5 ? gps.velocidade : VELOCIDADE_MEDIA_KMH
    return {
      lat: gps.latitude,
      lng: gps.longitude,
      etaMinutos: Math.max(1, Math.ceil((dist / 1000 / kmh) * 60)),
      distanciaRestanteMetros: Math.round(dist),
    }
  },
}
