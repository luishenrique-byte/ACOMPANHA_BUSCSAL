import { useEffect, useRef, useState } from 'react'
import { api } from '../services/api.js'

const INTERVALO_ENVIO_MS = 3000
const CHAVE_VIAGEM = 'viagemId'
const campo = 'w-full mt-1 mb-3 px-4 py-3 rounded-xl bg-white/90 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-300'

/** Tela do motorista: inicia/finaliza a viagem e envia o GPS ao back end. */
export default function Motorista({ usuario, onSair }) {
  const [rotas, setRotas] = useState([])
  const [rotaId, setRotaId] = useState('')
  const [veiculoId, setVeiculoId] = useState('')
  const [motoristaId, setMotoristaId] = useState(usuario.id ?? '')
  const [viagemId, setViagemId] = useState(null)
  const [erro, setErro] = useState('')
  const [ultimoEnvio, setUltimoEnvio] = useState(null)
  const [carregando, setCarregando] = useState(false)
  const watchId = useRef(null)
  const ultimoRef = useRef(0)

  const pararGps = () => {
    if (watchId.current != null) navigator.geolocation.clearWatch(watchId.current)
    watchId.current = null
  }

  function iniciarGps(idViagem) {
    if (!navigator.geolocation) return setErro('Este aparelho não permite localização.')
    watchId.current = navigator.geolocation.watchPosition(
      async ({ coords }) => {
        if (Date.now() - ultimoRef.current < INTERVALO_ENVIO_MS) return
        ultimoRef.current = Date.now()
        try {
          await api.enviarPosicao({
            latitude: coords.latitude,
            longitude: coords.longitude,
            velocidade: Math.max(0, coords.speed ?? 0),   // m/s; o back end exige valor
            precisao: Math.max(0, coords.accuracy ?? 0),
            idViagem,
          })
          setUltimoEnvio(new Date())
          setErro('')
        } catch (e) {
          setErro(e.message)
        }
      },
      () => setErro('Permita o acesso à localização para compartilhar a posição.'),
      { enableHighAccuracy: true, maximumAge: 2000, timeout: 10000 }
    )
  }

  useEffect(() => {
    api.listarRotas()
      .then((rs) => { setRotas(rs); if (rs[0]) setRotaId(String(rs[0].id)) })
      .catch((e) => setErro(e.message))
    const salvo = Number(sessionStorage.getItem(CHAVE_VIAGEM)) // retoma viagem se a página for recarregada
    if (salvo) { setViagemId(salvo); iniciarGps(salvo) }
    return pararGps
  }, [])

  async function iniciar() {
    if (!rotaId || !veiculoId || !motoristaId) return setErro('Informe a rota, o ID do veículo e o ID do motorista.')
    setCarregando(true)
    setErro('')
    try {
      const v = await api.iniciarViagem({ idMotorista: Number(motoristaId), idVeiculo: Number(veiculoId), idRota: Number(rotaId) })
      sessionStorage.setItem(CHAVE_VIAGEM, v.id)
      setViagemId(v.id)
      iniciarGps(v.id)
    } catch (e) {
      setErro(e.message)
    } finally {
      setCarregando(false)
    }
  }

  async function encerrar() {
    pararGps()
    if (viagemId) {
      try { await api.finalizarViagem(viagemId) } catch (e) { setErro(e.message); return false }
    }
    sessionStorage.removeItem(CHAVE_VIAGEM)
    setViagemId(null)
    return true
  }

  const emViagem = viagemId != null

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-indigo-600 to-indigo-800 text-white px-7 pt-10 pb-8 overflow-y-auto">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-indigo-200 text-xs">Motorista</p>
          <p className="font-bold">{usuario.nome}</p>
          <p className="text-indigo-200 text-xs">{usuario.email}</p>
        </div>
        <button onClick={async () => (await encerrar()) && onSair()} className="text-sm font-semibold text-indigo-100">Sair</button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center text-center py-6">
        <div className={`w-28 h-28 rounded-full flex items-center justify-center text-5xl ${emViagem ? 'bg-green-500 animate-pulse' : 'bg-white/15'}`}>🚌</div>
        <h1 className="text-2xl font-black mt-5">Expresso UCSal</h1>
        <p className="text-indigo-200 text-sm mt-1">
          {emViagem ? `Viagem #${viagemId} em andamento. Sua localização está sendo compartilhada.` : 'Preencha os dados e inicie a viagem.'}
        </p>
        {emViagem && ultimoEnvio && <p className="text-xs text-indigo-200 mt-2">Último envio: {ultimoEnvio.toLocaleTimeString('pt-BR')}</p>}

        {!emViagem && (
          <div className="w-full text-left mt-5">
            <label htmlFor="rota" className="text-sm font-semibold">Rota</label>
            <select id="rota" value={rotaId} onChange={(e) => setRotaId(e.target.value)} className={campo}>
              {rotas.map((r) => <option key={r.id} value={r.id}>{r.nome}</option>)}
            </select>
            <label htmlFor="veiculo" className="text-sm font-semibold">ID do veículo</label>
            <input id="veiculo" inputMode="numeric" value={veiculoId} onChange={(e) => setVeiculoId(e.target.value.replace(/\D/g, ''))} placeholder="Ex.: 1" className={campo} />
            {!usuario.id && (
              <>
                <label htmlFor="motorista" className="text-sm font-semibold">Seu ID de motorista</label>
                <input id="motorista" inputMode="numeric" value={motoristaId} onChange={(e) => setMotoristaId(e.target.value.replace(/\D/g, ''))} placeholder="Ex.: 2" className={campo} />
              </>
            )}
          </div>
        )}

        {erro && <p className="mt-3 bg-red-50 text-red-700 text-sm rounded-xl px-3 py-2" role="alert">{erro}</p>}
      </div>

      <button
        onClick={emViagem ? encerrar : iniciar}
        disabled={carregando}
        className={`w-full font-bold py-4 rounded-2xl text-lg disabled:opacity-60 ${emViagem ? 'bg-red-500' : 'bg-white text-indigo-700'}`}
      >
        {carregando ? 'Iniciando...' : emViagem ? 'Finalizar viagem' : 'Iniciar viagem'}
      </button>
      <p className="text-center text-xs text-indigo-200 mt-3">Mantenha a tela ligada durante a viagem.</p>
    </div>
  )
}
