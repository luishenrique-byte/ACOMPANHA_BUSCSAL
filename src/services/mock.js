// Imita o back end real (mesmos caminhos e formatos). Usado só com VITE_USE_MOCK=true.
const espera = (ms) => new Promise((r) => setTimeout(r, ms))

const ROTA = { id: 1, nome: 'Expresso UCSal', descricao: 'Av. Paralela → Campus Pituaçu', ativa: true }
const PARADAS = [
  { id: 1, nome: 'Av. Paralela - Início', latitude: -12.9580, longitude: -38.4310, ordem: 1, idRota: 1 },
  { id: 2, nome: 'Estádio de Pituaçu (sentido centro)', latitude: -12.9531, longitude: -38.4263, ordem: 2, idRota: 1 },
  { id: 3, nome: 'Estádio de Pituaçu (sentido aeroporto)', latitude: -12.9462, longitude: -38.4200, ordem: 3, idRota: 1 },
  { id: 4, nome: 'Av. Pinto de Aguiar', latitude: -12.9473, longitude: -38.4155, ordem: 4, idRota: 1 },
  { id: 5, nome: 'UCSal Pituaçu', latitude: -12.9482, longitude: -38.4137, ordem: 5, idRota: 1 },
]
const VIAGEM = {
  id: 1, dataHoraInicio: new Date().toISOString(), dataHoraFinal: null, status: 'EM_ROTA',
  motorista: { id: 2, nome: 'Motorista de teste', email: 'motorista@teste.com', matricula: null, perfil: { id: 2, perfil: 'MOTORISTA' } },
  veiculo: { id: 1, prefixo: '1234', placa: 'ABC1D23' },
  rota: ROTA,
}
const CICLO_MS = 3 * 60 * 1000

function posicao() {
  const f = (Date.now() % CICLO_MS) / CICLO_MS
  const x = f * (PARADAS.length - 1)
  const i = Math.min(Math.floor(x), PARADAS.length - 2)
  const t = x - i
  const [a, b] = [PARADAS[i], PARADAS[i + 1]]
  return {
    id: 1, idViagem: 1, velocidade: 7, precisao: 5, dataHora: new Date().toISOString(),
    latitude: a.latitude + (b.latitude - a.latitude) * t,
    longitude: a.longitude + (b.longitude - a.longitude) * t,
  }
}

export async function mockReq(caminho, { method = 'GET', body } = {}) {
  await espera(250)
  if (caminho === '/auth/login') {
    if (body.senha === 'errada') throw Object.assign(new Error('E-mail ou senha inválidos.'), { status: 401 })
    return { token: 'token-mock', expiresIn: 86400000 }
  }
  if (caminho === '/rota') return [ROTA]
  if (caminho === '/veiculo') return [
    { id: 1, prefixo: '1234', placa: 'ABC1D23', status: 'ATIVO' },
    { id: 2, prefixo: '5678', placa: 'XYZ9K88', status: 'ATIVO' },
  ]
  if (caminho === '/usuario') return [
    { id: 2, nome: 'Motorista de teste', email: 'motorista@teste.com', matricula: null, perfil: { id: 2, perfil: 'MOTORISTA' } },
    { id: 3, nome: 'Outro Motorista', email: 'outro@teste.com', matricula: null, perfil: { id: 2, perfil: 'MOTORISTA' } },
    { id: 4, nome: 'Aluno de teste', email: 'aluno@teste.com', matricula: '123456789', perfil: { id: 1, perfil: 'ALUNO' } },
  ]
  if (caminho === '/ponto-parada' || caminho.startsWith('/ponto-parada/')) return PARADAS
  if (caminho === '/viagem') return method === 'GET' ? [VIAGEM] : VIAGEM
  if (caminho.startsWith('/viagem/')) return null
  if (caminho.startsWith('/posicaoGPS/ultima/')) return posicao()
  if (caminho === '/posicaoGPS') return null
  if (caminho === '/incidente') return { id: 1 }
  throw Object.assign(new Error('Endpoint não existe no mock.'), { status: 404 })
}
