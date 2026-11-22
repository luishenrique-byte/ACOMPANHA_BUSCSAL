import { useEffect, useMemo, useState } from 'react'
import Mapa from './Mapa.jsx'
import Horarios from './Horarios.jsx'
import { api } from '../services/api.js'
import { proximaSaida } from '../utils/horarios.js'
import { distanciaRestante } from '../utils/geo.js'

const NOME_CAMPUS = 'Universidade Católica do Salvador - UCSal'
const VELOCIDADE_PADRAO = 6.9 // m/s (≈ 25 km/h), usada quando o ônibus está parado ou sem velocidade

export default function Home({ usuario, onSair }) {
  const [rotaId, setRotaId] = useState(null)
  const [paradas, setParadas] = useState([])
  const [veiculo, setVeiculo] = useState(null)
  const [semViagem, setSemViagem] = useState(false)
  const [erro, setErro] = useState('')
  const [seguir, setSeguir] = useState(true)
  const [horariosAberto, setHorariosAberto] = useState(false)
  const [saida, setSaida] = useState(proximaSaida())

  // Rota ativa (a primeira da lista)
  useEffect(() => {
    api.listarRotas()
      .then((rs) => (rs.length ? setRotaId(rs[0].id) : setErro('Nenhuma rota ativa no momento.')))
      .catch((e) => setErro(e.message))
  }, [])

  // Pontos de parada da rota
  useEffect(() => {
    if (rotaId == null) return
    api.buscarParadas(rotaId).then(setParadas).catch((e) => setErro(e.message))
  }, [rotaId])

  // Viagem ativa + última posição do ônibus, a cada 3 segundos
  useEffect(() => {
    if (rotaId == null) return
    let ativo = true
    const ler = async () => {
      try {
        const viagem = await api.buscarViagemAtiva(rotaId)
        const pos = viagem ? await api.buscarPosicao(viagem.id) : null
        if (!ativo) return
        setVeiculo(pos)
        setSemViagem(!viagem)
        setErro('')
      } catch (e) {
        if (ativo) setErro(e.message)
      }
    }
    ler()
    const id = setInterval(ler, 3000)
    return () => { ativo = false; clearInterval(id) }
  }, [rotaId])

  useEffect(() => {
    const id = setInterval(() => setSaida(proximaSaida()), 30000)
    return () => clearInterval(id)
  }, [])

  // O back end ainda não entrega o desenho da rota: ligamos os pontos de parada em ordem
  const rota = useMemo(() => paradas.map((p) => [p.lat, p.lng]), [paradas])
  const destino = paradas.length ? { ...paradas[paradas.length - 1], nome: NOME_CAMPUS } : null
  const paradasNoMapa = paradas.slice(0, -1)

  // ETA calculado no front: distância restante pela rota / velocidade
  const estimativa = useMemo(() => {
    if (!veiculo || rota.length < 2) return null
    const metros = distanciaRestante(rota, [veiculo.lat, veiculo.lng])
    const v = veiculo.velocidade > 2 ? veiculo.velocidade : VELOCIDADE_PADRAO
    return { metros, minutos: Math.max(1, Math.ceil(metros / v / 60)) }
  }, [veiculo, rota])

  const chegando = estimativa && estimativa.metros < 200

  return (
    <>
      <Mapa rota={rota} paradas={paradasNoMapa} campus={destino} veiculo={veiculo} seguir={seguir} onArrastar={() => setSeguir(false)} />

      <div className="absolute top-0 left-0 right-0 z-[1000] p-4">
        <div className="bg-white rounded-full shadow-lg flex items-center pl-5 pr-2 py-2">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-gray-800 truncate">{usuario.nome}</p>
            <p className="text-xs text-gray-500 truncate">{usuario.email}</p>
          </div>
          <button onClick={onSair} className="text-xs font-semibold text-indigo-600 px-3 py-2">Sair</button>
        </div>
        {erro && <p className="mt-2 bg-red-50 text-red-700 text-xs rounded-xl px-3 py-2 shadow" role="alert">{erro}</p>}
      </div>

      <button
        onClick={() => setSeguir((s) => !s)}
        aria-pressed={seguir}
        aria-label="Seguir ônibus"
        className={`absolute bottom-[270px] right-4 z-[1000] w-12 h-12 rounded-full shadow-lg border text-xl ${seguir ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white border-gray-200'}`}
      >🎯</button>

      <div className="absolute bottom-0 left-0 right-0 z-[1000] bg-white rounded-t-3xl shadow-[0_-8px_20px_rgba(0,0,0,0.1)] pt-2 pb-6">
        <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-3" />
        <div className="px-6 pb-4 border-b border-gray-100 flex items-center gap-4">
          <div className="bg-indigo-600 text-white font-black text-xl px-3 py-2 rounded-lg min-w-[70px] text-center">EXP</div>
          <div>
            <h2 className="text-lg font-bold text-gray-800 leading-tight">Expresso UCSal</h2>
            <p className="text-gray-500 text-sm">Destino: Campus Pituaçu</p>
          </div>
        </div>

        <div className="px-6 pt-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <span className={`w-3 h-3 rounded-full ${veiculo ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`} />
              <span className="text-gray-700 font-semibold text-sm">
                {veiculo ? (chegando ? 'Chegando ao campus' : 'A caminho do campus') : semViagem ? 'Nenhum ônibus em viagem agora' : 'Procurando o ônibus...'}
              </span>
            </div>
            <div className="text-right">
              <span className="text-3xl font-black text-green-600">{estimativa ? estimativa.minutos : '--'}</span>
              <span className="text-green-600 font-bold text-sm"> min</span>
            </div>
          </div>

          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>{estimativa ? `${(estimativa.metros / 1000).toFixed(1).replace('.', ',')} km restantes` : '-- km restantes'}</span>
            <span>{saida ? `Próxima saída: ${saida.h.replace('*', '')} (em ${saida.falta} min)` : 'Sem mais saídas hoje'}</span>
          </div>

          <button
            onClick={() => setHorariosAberto(true)}
            className="w-full mt-4 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold py-3 rounded-xl"
          >
            Ver tabela de horários
          </button>
        </div>
      </div>

      <Horarios aberto={horariosAberto} onFechar={() => setHorariosAberto(false)} />
    </>
  )
}
