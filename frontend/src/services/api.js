/**
 * Camada de acesso ao back end (Spring, prefixo /v1). Os componentes só usam as funções daqui.
 *
 *   POST  /auth/login                 { email, senha } -> { token, expiresIn }
 *   GET   /rota                       -> [{ id, nome, descricao, ativa }]               (rotas ativas)
 *   GET   /ponto-parada/:idRota       -> [{ id, nome, latitude, longitude, ordem }]
 *   GET   /viagem                     -> viagens EM_ROTA [{ id, motorista, veiculo, rota, ... }]
 *   GET   /posicaoGPS/ultima/:idViagem-> { latitude, longitude, velocidade, precisao, dataHora }   (404 = sem posição)
 *   POST  /viagem                     { idMotorista, idVeiculo, idRota }   (MOTORISTA)
 *   PATCH /viagem/finalizar/:id                                           (MOTORISTA)
 *   POST  /posicaoGPS                 { latitude, longitude, velocidade, precisao, idViagem } (MOTORISTA)
 */
import { mockReq } from './mock.js'

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

  iniciarViagem: (dados) => chamar('/viagem', { method: 'POST', body: dados }),
  finalizarViagem: (id) => chamar(`/viagem/finalizar/${id}`, { method: 'PATCH' }),
  enviarPosicao: (dados) => chamar('/posicaoGPS', { method: 'POST', body: dados }),
}
