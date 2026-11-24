/**
 * Camada de acesso ao back end (Spring, prefixo /v1). Os componentes só usam as funções daqui.
 *
 *   POST  /auth/login                 { email, senha } -> { token, expiresIn }
 *   GET   /rota                       -> [{ id, nome, descricao, ativa }]               (rotas ativas)
 *   GET   /ponto-parada/:idRota       -> [{ id, nome, latitude, longitude, ordem }]
 *   GET   /viagem                     -> viagens EM_ROTA [{ id, motorista, veiculo, rota, ... }]
 *   GET   /posicaoGPS/ultima/:idViagem-> { latitude, longitude, velocidade, precisao, dataHora }   (404 = sem posição)
 *   GET   /veiculo                    -> [{ id, prefixo, placa, status }]   (AINDA NÃO EXISTE no back: pedir ao Luis)
 *   GET   /usuario                    -> [{ id, nome, email, perfil }]      (hoje só ADMIN; precisa de uma versão para motorista)
 *   POST  /viagem                     { idMotorista, idVeiculo, idRota }   (MOTORISTA)
 *   PATCH /viagem/finalizar/:id                                           (MOTORISTA)
 *   POST  /posicaoGPS                 { latitude, longitude, velocidade, precisao, idViagem } (MOTORISTA)
 */
import { mockReq } from './mock.js'

const cacheTrajeto = new Map()

const BASE = import.meta.env.VITE_API_URL
const USAR_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

async function req(caminho, { body, ...opcoes } = {}) {
  const token = sessionStorage.getItem('token')
  let resp
  try {
    resp = await fetch(BASE + caminho, {
      ...opcoes,
      body: body && JSON.stringify(body),
      headers: { 'Content-Type': 'application/json', ...(token && { Authorization: `Bearer ${token}` }) },
    })
  } catch {
    throw new Error('Não foi possível conectar ao servidor.')
  }
  if (resp.status === 401 && token) { // token expirado ou inválido
    sessionStorage.clear()
    window.location.reload()
  }
  if (resp.status === 204) return null
  const corpo = await resp.json().catch(() => null)
  if (!resp.ok) {
    if (resp.status === 403) throw Object.assign(new Error('Você não tem permissão para esta ação.'), { status: 403 })
    const detalhes = corpo?.listaErros?.map((e) => e.erro).join(' ')
    throw Object.assign(new Error(detalhes || corpo?.mensagem || 'Não foi possível concluir a requisição.'), { status: resp.status })
  }
  return corpo
}

const chamar = (caminho, opcoes) => (USAR_MOCK ? mockReq(caminho, opcoes) : req(caminho, opcoes))

export const api = {
  async login(email, senha, tipo = 'passageiro') {
    const dados = await chamar('/auth/login', { method: 'POST', body: { email, senha } })
    // Hoje o back end devolve só { token, expiresIn }. Se passar a devolver "usuario", usamos o perfil real.
    const perfil = dados.usuario?.perfil?.perfil
    if (perfil && tipo === 'motorista' && perfil !== 'MOTORISTA') throw new Error('Esta conta não é de motorista.')
    const tipoReal = perfil ? (perfil === 'MOTORISTA' ? 'motorista' : 'passageiro') : tipo
    return {
      token: dados.token,
      usuario: { id: dados.usuario?.id, nome: dados.usuario?.nome ?? email.split('@')[0], email, tipo: tipoReal },
    }
  },

  listarRotas: () => chamar('/rota'),

  async buscarParadas(rotaId) {
    const lista = await chamar(`/ponto-parada/${rotaId}`)
    return [...lista]
      .sort((a, b) => a.ordem - b.ordem)
      .map((p) => ({ id: p.id, nome: p.nome, ordem: p.ordem, descricao: `Parada ${p.ordem}`, lat: p.latitude, lng: p.longitude }))
  },

  async buscarViagemAtiva(rotaId) {
    const viagens = await chamar('/viagem')
    return viagens.find((v) => v.rota?.id === rotaId) ?? null
  },

  async buscarPosicao(viagemId) {
    try {
      const p = await chamar(`/posicaoGPS/ultima/${viagemId}`)
      return { lat: p.latitude, lng: p.longitude, velocidade: p.velocidade, dataHora: p.dataHora }
    } catch (e) {
      if (e.status === 404) return null
      throw e
    }
  },

  // Listas para os selects da tela do motorista (se o back não tiver o endpoint, a tela usa campo de ID)
  async listarVeiculos() {
    const lista = await chamar('/veiculo')
    return lista.map((v) => ({ id: v.id, rotulo: [v.prefixo, v.placa].filter(Boolean).join(' · ') || `Veículo ${v.id}` }))
  },

  async listarMotoristas() {
    const lista = await chamar('/usuario')
    return lista
      .filter((u) => u.perfil?.perfil === 'MOTORISTA')
      .map((u) => ({ id: u.id, rotulo: u.nome, email: u.email }))
  },

  /**
   * Linha que segue as ruas entre os pontos de parada.
   * Provisório: usa o OSRM público (gratuito, sem chave). Quando o back devolver o trajeto
   * (Directions API), troque por uma chamada ao back. Se falhar, cai para linhas retas.
   */
  async buscarTrajeto(paradas) {
    const chave = paradas.map((p) => `${p.lng},${p.lat}`).join(';')
    if (cacheTrajeto.has(chave)) return cacheTrajeto.get(chave)
    try {
      const resp = await fetch(`https://router.project-osrm.org/route/v1/driving/${chave}?overview=full&geometries=geojson`)
      const dados = await resp.json()
      if (dados.code !== 'Ok') throw new Error('rota não encontrada')
      const linha = dados.routes[0].geometry.coordinates.map(([lng, lat]) => [lat, lng])
      cacheTrajeto.set(chave, linha)
      return linha
    } catch {
      return paradas.map((p) => [p.lat, p.lng])
    }
  },

  pausarViagem: (id) => chamar(`/viagem/pausar/${id}`, { method: 'PATCH' }),

  registrarIncidente: (dados) => chamar('/incidente', { method: 'POST', body: dados }), // { tipo, descricao, idViagem }

  /**
   * O back ainda não tem "retomar" (só pausar). Enquanto isso: finaliza a viagem pausada e abre outra com os
   * mesmos dados. Quando existir PATCH /viagem/retomar/{id}, troque por:
   *   await chamar(`/viagem/retomar/${v.id}`, { method: 'PATCH' }); return v.id
   */
  async retomarViagem(v) {
    await chamar(`/viagem/finalizar/${v.id}`, { method: 'PATCH' })
    const nova = await chamar('/viagem', { method: 'POST', body: { idMotorista: v.idMotorista, idVeiculo: v.idVeiculo, idRota: v.idRota } })
    return nova.id
  },

  iniciarViagem: (dados) => chamar('/viagem', { method: 'POST', body: dados }),
  finalizarViagem: (id) => chamar(`/viagem/finalizar/${id}`, { method: 'PATCH' }),
  enviarPosicao: (dados) => chamar('/posicaoGPS', { method: 'POST', body: dados }),
}
