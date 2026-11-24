const RAD = Math.PI / 180

export function metros([lat1, lng1], [lat2, lng2]) {
  const dLat = (lat2 - lat1) * RAD
  const dLng = (lng2 - lng1) * RAD
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * RAD) * Math.cos(lat2 * RAD) * Math.sin(dLng / 2) ** 2
  return 2 * 6371000 * Math.asin(Math.sqrt(a))
}

/** Distância (m) que falta, seguindo a rota, da posição atual até o último ponto. */
export function distanciaRestante(rota, pos) {
  let melhor = { d: Infinity, i: 0, t: 0 }
  for (let i = 0; i < rota.length - 1; i++) {
    const [a, b] = [rota[i], rota[i + 1]]
    const k = Math.cos(a[0] * RAD)
    const ax = a[1] * k, ay = a[0], bx = b[1] * k, by = b[0], px = pos[1] * k, py = pos[0]
    const dx = bx - ax, dy = by - ay, len2 = dx * dx + dy * dy
    const t = len2 ? Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / len2)) : 0
    const d = Math.hypot(px - (ax + t * dx), py - (ay + t * dy))
    if (d < melhor.d) melhor = { d, i, t }
  }
  const { i, t } = melhor
  const ponto = [rota[i][0] + (rota[i + 1][0] - rota[i][0]) * t, rota[i][1] + (rota[i + 1][1] - rota[i][1]) * t]
  let total = metros(ponto, rota[i + 1])
  for (let j = i + 1; j < rota.length - 1; j++) total += metros(rota[j], rota[j + 1])
  return total
}
