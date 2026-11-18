// Dados simulados, usados só com VITE_USE_MOCK=true. Pode apagar quando o back end estiver pronto.
const PONTOS = [
  [-12.9580, -38.4310], [-12.9560, -38.4290], [-12.9540, -38.4272], [-12.9523, -38.4255],
  [-12.9505, -38.4240], [-12.9488, -38.4227], [-12.9472, -38.4212], [-12.9462, -38.4200],
  [-12.9457, -38.4188], [-12.9459, -38.4176], [-12.9466, -38.4165], [-12.9473, -38.4155],
  [-12.9478, -38.4146], [-12.9482, -38.4137],
]
const CICLO_MS = 3 * 60 * 1000 // o ônibus completa o trajeto a cada 3 min (demo)

const espera = (ms) => new Promise((r) => setTimeout(r, ms))

export async function mockLogin(matricula, perfil) {
  await espera(600)
  if (matricula === '000000') throw new Error('Matrícula não encontrada.')
  return { token: 'token-mock', usuario: { nome: 'Usuário de teste', matricula, perfil } }
}

export async function mockRota() {
  await espera(300)
  return PONTOS
}

export async function mockVeiculo() {
  const f = (Date.now() % CICLO_MS) / CICLO_MS
  const pos = f * (PONTOS.length - 1)
  const i = Math.min(Math.floor(pos), PONTOS.length - 2)
  const t = pos - i
  const [a, b] = [PONTOS[i], PONTOS[i + 1]]
  return {
    lat: a[0] + (b[0] - a[0]) * t,
    lng: a[1] + (b[1] - a[1]) * t,
    etaMinutos: Math.ceil((1 - f) * (CICLO_MS / 60000)),
    distanciaRestanteMetros: Math.round((1 - f) * 2300),
  }
}

// Coordenadas APROXIMADAS. Em produção, o back end envia as reais.
export async function mockParadas() {
  await espera(300)
  return [
    { id: 'p1', nome: 'Estádio de Pituaçu', descricao: '1ª parada · Av. Paralela (sentido centro)', lat: -12.9531, lng: -38.4263 },
    { id: 'p2', nome: 'Estádio de Pituaçu', descricao: '2ª parada · Av. Paralela (sentido aeroporto)', lat: -12.9525, lng: -38.4257 },
    { id: 'p3', nome: 'UCSal · Av. Pinto de Aguiar', descricao: 'Saída (*) · em frente ao campus, sentido orla', lat: -12.9475, lng: -38.4152 },
  ]
}

export async function mockCampus() {
  return { nome: 'Universidade Católica do Salvador - UCSal', lat: -12.9482, lng: -38.4137 }
}
