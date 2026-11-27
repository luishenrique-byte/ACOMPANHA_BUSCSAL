import { useEffect, useRef, useState } from 'react'
import { api } from '../services/api.js'

const INTERVALO_ENVIO_MS = 3000
const CHAVE = 'viagemMotorista'
const campo = 'w-full mt-1 mb-3 px-4 py-3 rounded-xl bg-white/90 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-300'
const fundo = 'h-full relative flex flex-col bg-gradient-to-b from-indigo-600 to-indigo-800 text-white px-6 overflow-y-auto no-scrollbar'

const INCIDENTES = [
  { tipo: 'ACIDENTE', rotulo: 'Acidente', icone: '🚨' },
  { tipo: 'LOTACAO', rotulo: 'Lotação cheia', icone: '👥' },
  { tipo: 'PAUSA_EMBARQUE', rotulo: 'Pausa p/ embarque', icone: '🧍' },
  { tipo: 'OUTRO', rotulo: 'Outro', icone: '📝' },
]

const dois = (n) => String(n).padStart(2, '0')
const formatar = (ms) => {
  const s = Math.max(0, Math.floor(ms / 1000))
  return `${dois(Math.floor(s / 3600))}:${dois(Math.floor((s % 3600) / 60))}:${dois(s % 60)}`
}
const carregar = () => { try { return JSON.parse(sessionStorage.getItem(CHAVE)) } catch { return null } }

/** Select com a lista do servidor; se a lista não existir no back end, vira campo de ID. */
function SelectOuId({ id, rotulo, valor, onChange, opcoes, indisponivel }) {
  return (
    <>
      <label htmlFor={id} className="text-sm font-semibold">{rotulo}</label>
      {indisponivel ? (
        <>
          <input id={id} inputMode="numeric" value={valor} onChange={(e) => onChange(e.target.value.replace(/\D/g, ''))} placeholder="Digite o ID" className={campo} />
          <p className="text-xs text-indigo-200 -mt-2 mb-3">Lista indisponível no servidor por enquanto.</p>
        </>
      ) : (
        <select id={id} value={valor} onChange={(e) => onChange(e.target.value)} className={campo}>
          <option value="">Selecione...</option>
          {opcoes.map((o) => <option key={o.id} value={o.id}>{o.rotulo}</option>)}
        </select>
      )}
    </>
  )
}

const Cartao = ({ titulo, valor }) => (
  <div className="bg-white/10 rounded-2xl py-3 text-center">
    <p className="text-xl font-black tabular-nums">{valor}</p>
    <p className="text-[11px] text-indigo-200">{titulo}</p>
  </div>
)

/** Tela do motorista: preparo -> viagem (pausar, incidente, finalizar) -> resumo. */
export default function Motorista({ usuario, onSair }) {
  // preparo
  const [rotas, setRotas] = useState([])
  const [rotaId, setRotaId] = useState('')
  const [veiculos, setVeiculos] = useState([])
  const [semListaVeiculos, setSemListaVeiculos] = useState(false)
  const [veiculoId, setVeiculoId] = useState('')
  const [motoristas, setMotoristas] = useState([])
  const [semListaMotoristas, setSemListaMotoristas] = useState(false)
  const [motoristaId, setMotoristaId] = useState(usuario.id ? String(usuario.id) : '')
  // viagem: { id, idMotorista, idVeiculo, idRota, ativoMs, desde (null = pausada), enviadas, incidentes, pausas }
  const [viagem, setViagem] = useState(carregar)
  const [resumo, setResumo] = useState(null)
  const [agora, setAgora] = useState(Date.now())
  const [velKmh, setVelKmh] = useState(null)
  const [precisao, setPrecisao] = useState(null)
  const [ultimoEnvio, setUltimoEnvio] = useState(null)
  const [falhas, setFalhas] = useState(0)
  const [confirmando, setConfirmando] = useState(false)
  const [incidenteAberto, setIncidenteAberto] = useState(false)
  const [tipoInc, setTipoInc] = useState('')
  const [descInc, setDescInc] = useState('')
  const [aviso, setAviso] = useState('')
  const [erro, setErro] = useState('')
  const [ocupado, setOcupado] = useState(false)
  const ultimoRef = useRef(0)

  const rodando = !!viagem && viagem.desde != null
  const ativoMs = viagem ? viagem.ativoMs + (viagem.desde ? agora - viagem.desde : 0) : 0

  // Guarda a viagem na sessão (se a página recarregar, a viagem continua)
  useEffect(() => {
    try { viagem ? sessionStorage.setItem(CHAVE, JSON.stringify(viagem)) : sessionStorage.removeItem(CHAVE) } catch { /* sem storage */ }
  }, [viagem])

  // Relógio do cronômetro
  useEffect(() => {
    if (!viagem) return
    const id = setInterval(() => setAgora(Date.now()), 1000)
    return () => clearInterval(id)
  }, [!!viagem])

  // Listas do preparo
  useEffect(() => {
    api.listarRotas().then((rs) => { setRotas(rs); if (rs[0]) setRotaId(String(rs[0].id)) }).catch((e) => setErro(e.message))
    api.listarVeiculos().then(setVeiculos).catch(() => setSemListaVeiculos(true))
    api.listarMotoristas()
      .then((ms) => {
        setMotoristas(ms)
        const eu = ms.find((m) => m.email?.toLowerCase() === usuario.email?.toLowerCase())
        if (eu) setMotoristaId(String(eu.id))
      })
      .catch(() => setSemListaMotoristas(true))
  }, [])

  // GPS: só envia enquanto a viagem está em andamento (pausada = não envia)
  useEffect(() => {
    if (!rodando) return
    const idViagem = viagem.id
    if (!navigator.geolocation) { setErro('Este aparelho não permite localização.'); return }
    const watch = navigator.geolocation.watchPosition(
      async ({ coords }) => {
        setVelKmh(Math.round((coords.speed ?? 0) * 3.6))
        setPrecisao(Math.round(coords.accuracy ?? 0))
        if (Date.now() - ultimoRef.current < INTERVALO_ENVIO_MS) return
        ultimoRef.current = Date.now()
        try {
          await api.enviarPosicao({ latitude: coords.latitude, longitude: coords.longitude, velocidade: Math.max(0, coords.speed ?? 0), precisao: Math.max(0, coords.accuracy ?? 0), idViagem })
          setUltimoEnvio(new Date())
          setFalhas(0)
          setViagem((v) => v && { ...v, enviadas: v.enviadas + 1 })
        } catch {
          setFalhas((f) => f + 1)
        }
      },
      () => setErro('Permita o acesso à localização para compartilhar a posição.'),
      { enableHighAccuracy: true, maximumAge: 2000, timeout: 10000 }
    )
    return () => navigator.geolocation.clearWatch(watch)
  }, [rodando, viagem?.id])

  // Mantém a tela ligada durante a viagem (quando o navegador permite)
  useEffect(() => {
    if (!rodando || !('wakeLock' in navigator)) return
    let trava = null
    let ativo = true
    const pedir = async () => { try { trava = await navigator.wakeLock.request('screen') } catch { /* não suportado */ } }
    pedir()
    const aoVoltar = () => { if (!document.hidden && ativo) pedir() }
    document.addEventListener('visibilitychange', aoVoltar)
    return () => { ativo = false; document.removeEventListener('visibilitychange', aoVoltar); trava?.release().catch(() => {}) }
  }, [rodando])

  async function executar(fn) {
    setOcupado(true)
    setErro('')
    try { await fn() } catch (e) { setErro(e.message) } finally { setOcupado(false) }
  }

  const iniciar = () => {
    if (!rotaId || !veiculoId || !motoristaId) return setErro('Selecione a rota, o veículo e o motorista.')
    return executar(async () => {
      const dados = { idMotorista: Number(motoristaId), idVeiculo: Number(veiculoId), idRota: Number(rotaId) }
      const v = await api.iniciarViagem(dados)
      setViagem({ id: v.id, ...dados, ativoMs: 0, desde: Date.now(), enviadas: 0, incidentes: 0, pausas: 0 })
      setFalhas(0); setUltimoEnvio(null)
    })
  }

  const pausar = () => executar(async () => {
    await api.pausarViagem(viagem.id)
    setViagem((v) => ({ ...v, ativoMs: v.ativoMs + (Date.now() - v.desde), desde: null, pausas: v.pausas + 1 }))
  })

  const retomar = () => executar(async () => {
    const novoId = await api.retomarViagem(viagem)
    setViagem((v) => ({ ...v, id: novoId, desde: Date.now() }))
  })

  const finalizar = () => executar(async () => {
    await api.finalizarViagem(viagem.id)
    setResumo({ duracao: ativoMs, enviadas: viagem.enviadas, pausas: viagem.pausas, incidentes: viagem.incidentes })
    setViagem(null)
    setConfirmando(false)
  })

  const enviarIncidente = () => {
    if (!tipoInc) return setErro('Escolha o tipo de incidente.')
    return executar(async () => {
      await api.registrarIncidente({ tipo: tipoInc, descricao: descInc.trim() || null, idViagem: viagem.id })
      setViagem((v) => ({ ...v, incidentes: v.incidentes + 1 }))
      setIncidenteAberto(false); setTipoInc(''); setDescInc('')
      setAviso('Incidente registrado.')
      setTimeout(() => setAviso(''), 3000)
    })
  }

  // ---------- RESUMO ----------
  if (resumo) {
    return (
      <div className={`${fundo} pt-12 pb-8`}>
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <div className="w-24 h-24 rounded-full bg-green-500 flex items-center justify-center text-5xl">✅</div>
          <h1 className="text-2xl font-black mt-5">Viagem finalizada</h1>
          <p className="text-indigo-200 text-sm mt-1">Bom trabalho, {usuario.nome}!</p>
          <div className="grid grid-cols-2 gap-3 w-full mt-8">
            <Cartao titulo="Duração" valor={formatar(resumo.duracao)} />
            <Cartao titulo="Envios de GPS" valor={resumo.enviadas} />
            <Cartao titulo="Pausas" valor={resumo.pausas} />
            <Cartao titulo="Incidentes" valor={resumo.incidentes} />
          </div>
        </div>
        <button onClick={() => setResumo(null)} className="w-full bg-white text-indigo-700 font-bold py-4 rounded-2xl text-lg">Nova viagem</button>
        <button onClick={onSair} className="w-full text-indigo-100 font-semibold py-3 mt-2">Sair</button>
      </div>
    )
  }

  // ---------- VIAGEM ----------
  if (viagem) {
    return (
      <div className={`${fundo} pt-8 pb-6`}>
        <div className="text-center">
          <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold ${rodando ? 'bg-green-500' : 'bg-amber-400 text-amber-950'}`}>
            <span className={`w-2 h-2 rounded-full bg-white ${rodando ? 'animate-pulse' : ''}`} />
            {rodando ? 'EM ROTA' : 'VIAGEM PAUSADA'}
          </span>
          <p className="text-5xl font-black mt-4 tabular-nums">{formatar(ativoMs)}</p>
          <p className="text-indigo-200 text-xs mt-1">Tempo de viagem · Expresso UCSal · #{viagem.id}</p>
        </div>

        {aviso && <p className="mt-4 bg-green-100 text-green-800 text-sm rounded-xl px-3 py-2 text-center" role="status">{aviso}</p>}
        {falhas >= 3 && <p className="mt-4 bg-amber-100 text-amber-900 text-sm rounded-xl px-3 py-2 text-center" role="alert">Sem conexão. Tentando reenviar a localização...</p>}

        <div className="grid grid-cols-3 gap-2 mt-6">
          <Cartao titulo="Velocidade" valor={velKmh != null ? `${velKmh} km/h` : '--'} />
          <Cartao titulo="Precisão GPS" valor={precisao != null ? `${precisao} m` : '--'} />
          <Cartao titulo="Envios" valor={viagem.enviadas} />
        </div>
        <p className="text-center text-xs text-indigo-200 mt-3">
          {rodando
            ? ultimoEnvio ? `Último envio: ${ultimoEnvio.toLocaleTimeString('pt-BR')}` : 'Aguardando o sinal do GPS...'
            : 'Envio pausado. Os passageiros não veem o ônibus.'}
        </p>

        {erro && <p className="mt-4 bg-red-50 text-red-700 text-sm rounded-xl px-3 py-2" role="alert">{erro}</p>}

        <div className="mt-auto pt-6 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            {rodando
              ? <button onClick={pausar} disabled={ocupado} className="bg-amber-400 text-amber-950 font-bold py-4 rounded-2xl disabled:opacity-60">⏸ Pausar</button>
              : <button onClick={retomar} disabled={ocupado} className="bg-green-500 font-bold py-4 rounded-2xl disabled:opacity-60">▶ Retomar</button>}
            <button onClick={() => { setErro(''); setIncidenteAberto(true) }} className="bg-white/15 font-bold py-4 rounded-2xl">⚠️ Incidente</button>
          </div>
          <button onClick={() => setConfirmando(true)} className="w-full bg-red-500 font-bold py-4 rounded-2xl text-lg">⏹ Finalizar viagem</button>
        </div>

        {confirmando && (
          <div className="absolute inset-0 z-50 bg-black/60 flex items-center justify-center p-6">
            <div className="bg-white text-gray-800 rounded-3xl p-6 w-full">
              <h2 className="text-lg font-bold">Finalizar a viagem?</h2>
              <p className="text-sm text-gray-600 mt-1">O ônibus deixa de aparecer para os passageiros.</p>
              <div className="grid grid-cols-2 gap-3 mt-5">
                <button onClick={() => setConfirmando(false)} className="py-3 rounded-xl bg-gray-100 font-semibold">Cancelar</button>
                <button onClick={finalizar} disabled={ocupado} className="py-3 rounded-xl bg-red-500 text-white font-bold disabled:opacity-60">{ocupado ? 'Finalizando...' : 'Finalizar'}</button>
              </div>
            </div>
          </div>
        )}

        {incidenteAberto && (
          <div className="absolute inset-0 z-50 bg-black/60 flex flex-col justify-end">
            <div className="bg-white text-gray-800 rounded-t-3xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold">Reportar incidente</h2>
                <button onClick={() => setIncidenteAberto(false)} aria-label="Fechar" className="w-9 h-9 bg-gray-100 rounded-full text-gray-500">✕</button>
              </div>
              <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="Tipo de incidente">
                {INCIDENTES.map((i) => (
                  <button key={i.tipo} role="radio" aria-checked={tipoInc === i.tipo} onClick={() => setTipoInc(i.tipo)}
                    className={`py-3 rounded-xl border-2 text-sm font-semibold ${tipoInc === i.tipo ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-gray-200 text-gray-600'}`}>
                    <div className="text-2xl">{i.icone}</div>{i.rotulo}
                  </button>
                ))}
              </div>
              <textarea value={descInc} onChange={(e) => setDescInc(e.target.value)} maxLength={300} rows={2} placeholder="Detalhes (opcional)"
                className="w-full mt-3 px-4 py-3 rounded-xl bg-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
              {erro && <p className="text-red-600 text-sm mt-2" role="alert">{erro}</p>}
              <button onClick={enviarIncidente} disabled={ocupado} className="w-full mt-3 bg-indigo-600 text-white font-bold py-3 rounded-xl disabled:opacity-60">
                {ocupado ? 'Enviando...' : 'Enviar'}
              </button>
            </div>
          </div>
        )}
      </div>
    )
  }

  // ---------- PREPARO ----------
  return (
    <div className={`${fundo} pt-10 pb-8`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-indigo-200 text-xs">Motorista</p>
          <p className="font-bold">{usuario.nome}</p>
          <p className="text-indigo-200 text-xs">{usuario.email}</p>
        </div>
        <button onClick={onSair} className="text-sm font-semibold text-indigo-100">Sair</button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center text-center py-6">
        <div className="w-28 h-28 rounded-full flex items-center justify-center text-5xl bg-white/15">🚌</div>
        <h1 className="text-2xl font-black mt-5">Expresso UCSal</h1>
        <p className="text-indigo-200 text-sm mt-1">Selecione os dados e inicie a viagem.</p>
        <div className="w-full text-left mt-5">
          <label htmlFor="rota" className="text-sm font-semibold">Rota</label>
          <select id="rota" value={rotaId} onChange={(e) => setRotaId(e.target.value)} className={campo}>
            {rotas.map((r) => <option key={r.id} value={r.id}>{r.nome}</option>)}
          </select>
          <SelectOuId id="veiculo" rotulo="Veículo" valor={veiculoId} onChange={setVeiculoId} opcoes={veiculos} indisponivel={semListaVeiculos} />
          <SelectOuId id="motorista" rotulo="Motorista" valor={motoristaId} onChange={setMotoristaId} opcoes={motoristas} indisponivel={semListaMotoristas} />
        </div>
        {erro && <p className="mt-3 bg-red-50 text-red-700 text-sm rounded-xl px-3 py-2" role="alert">{erro}</p>}
      </div>

      <button onClick={iniciar} disabled={ocupado} className="w-full bg-white text-indigo-700 font-bold py-4 rounded-2xl text-lg disabled:opacity-60">
        {ocupado ? 'Iniciando...' : 'Iniciar viagem'}
      </button>
    </div>
  )
}
