// Idealmente virá do back end no futuro (GET /linhas/:id/horarios).
export const HORARIOS = {
  semana: {
    'Manhã': ['6h30', '6h45*', '7h', '7h20*', '7h40*', '9h', '9h30', '9h55', '10h20', '10h45', '11h10', '11h35'],
    'Tarde': ['12h', '12h25', '12h50', '13h20', '17h10'],
    'Noite': ['18h10', '18h40*', '19h05*', '20h25', '20h50', '21h15', '21h35', '21h55'],
  },
  sabado: {
    'Manhã': ['6h40', '6h55*', '8h30', '9h30', '10h30', '11h30'],
    'Tarde': ['12h', '12h30', '13h'],
  },
}

export const paraMinutos = (h) => {
  const [hora, min] = h.replace('*', '').split('h')
  return Number(hora) * 60 + Number(min || 0)
}

export function tabelaDeHoje() {
  const d = new Date().getDay()
  if (d === 0) return null
  return d === 6 ? HORARIOS.sabado : HORARIOS.semana
}

export function proximaSaida() {
  const tabela = tabelaDeHoje()
  if (!tabela) return null
  const agora = new Date()
  const m = agora.getHours() * 60 + agora.getMinutes()
  const todos = Object.values(tabela).flat().map((h) => ({ h, min: paraMinutos(h) })).sort((a, b) => a.min - b.min)
  const prox = todos.find((x) => x.min >= m)
  return prox ? { ...prox, falta: prox.min - m } : null
}
