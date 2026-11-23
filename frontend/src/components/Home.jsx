import { useEffect, useMemo, useState } from 'react'
import Mapa from './Mapa.jsx'
import Horarios from './Horarios.jsx'
import { api } from '../services/api.js'
import { proximaSaida } from '../utils/horarios.js'
import { distanciaRestante } from '../utils/geo.js'

const VELOCIDADE_PADRAO = 6.9 // m/s (≈ 25 km/h), usada quando o ônibus está parado ou sem velocidade
const ATUALIZAR_ONIBUS_MS = 3000
const ATUALIZAR_PARADAS_MS = 30000

const hora = (d) => d.toLocaleTimeString('pt-BR')

export default function Home({ usuario, onSair }) {
  const [rotaId, setRotaId] = useState(null)
  const [paradas, setParadas] = useState([])
  const [selecionadaId, setSelecionadaId] = useState(null)
  const [trajeto, setTrajeto] = useState(null)           // chegada: pontos -> UCSal
  const [trajetoSaida, setTrajetoSaida] = useState(null)  // saída: UCSal -> pontos
  const [tracando, setTracando] = useState(false)
  const [veiculo, setVeiculo] = useState(null)
  const [semViagem, setSemViagem] = useState(false)
  const [atualizadoEm, setAtualizadoEm] = useState(null)
  const [erro, setErro] = useState('')
  const [foco, setFoco] = useState(0)
  const [horariosAberto, setHorariosAberto] = useState(false)
  const [saida, setSaida] = useState(proximaSaida())

  // Rota ativa (a primeira da lista)
  useEffect(() => {
    api.listarRotas()
      .then((rs) => (rs.length ? setRotaId(rs[0].id) : setErro('Nenhuma rota ativa no momento.')))
      .catch((e) => setErro(e.message))
  }, [])

  // Pontos de parada: recarrega de tempos em tempos (só troca o estado se algo mudou)
  useEffect(() => {
    if (rotaId == null) return
    const carregar = () =>
      api.buscarParadas(rotaId)
        .then((novas) => setParadas((atual) => (JSON.stringify(atual) === JSON.stringify(novas) ? atual : novas)))
        .catch((e) => setErro(e.message))
    carregar()
    const id = setInterval(carregar, ATUALIZAR_PARADAS_MS)
    return () => clearInterval(id)
  }, [rotaId])

  // Viagem ativa + última posição: atualização constante (sem recarregar a página)
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
        setAtualizadoEm(new Date())
        setErro('')
      } catch (e) {
        if (ativo) setErro(e.message)
      }
    }
    ler()
    const id = setInterval(ler, ATUALIZAR_ONIBUS_MS)
    const aoVoltar = () => { if (!document.hidden) ler() } // atualiza na hora ao voltar para a aba/app
    document.addEventListener('visibilitychange', aoVoltar)
    return () => { ativo = false; clearInterval(id); document.removeEventListener('visibilitychange', aoVoltar) }
  }, [rotaId])

  useEffect(() => {
    const id = setInterval(() => setSaida(proximaSaida()), 30000)
    return () => clearInterval(id)
  }, [])

  // Se os pontos mudarem, o desenho do trajeto precisa ser refeito
  useEffect(() => { setTrajeto(null); setTrajetoSaida(null) }, [paradas])

  // Traça o trajeto pelas ruas só quando alguém toca em um ponto
  useEffect(() => {
    if (selecionadaId == null || trajeto || paradas.length < 2) return
    let ativo = true
    setTracando(true)
    // O último ponto é a UCSal. Saída: UCSal -> pontos. Chegada: pontos -> UCSal.
    const saida = [paradas[paradas.length - 1], ...paradas.slice(0, -1)]
    Promise.all([api.buscarTrajeto(paradas), api.buscarTrajeto(saida)])
      .then(([chegada, ida]) => { if (ativo) { setTrajeto(chegada); setTrajetoSaida(ida) } })
      .finally(() => ativo && setTracando(false))
    return () => { ativo = false }
  }, [selecionadaId, paradas, trajeto])

  const selecionada = paradas.find((p) => p.id === selecionadaId) ?? null

  // Tempo até o ponto selecionado: distância pela rota (do ônibus até lá) / velocidade
  const eta = useMemo(() => {
    if (!veiculo || !selecionada || !trajeto) return null
    const doOnibus = distanciaRestante(trajeto, [veiculo.lat, veiculo.lng])
    const doPonto = distanciaRestante(trajeto, [selecionada.lat, selecionada.lng])
    const metros = doOnibus - doPonto
    if (metros < -100) return { passou: true }
    const m = Math.max(0, metros)
    const v = veiculo.velocidade > 2 ? veiculo.velocidade : VELOCIDADE_PADRAO
    return { metros: m, minutos: Math.max(1, Math.ceil(m / v / 60)), chegando: m < 150 }
  }, [veiculo, selecionada, trajeto])

  function textoStatus() {
    if (semViagem) return 'Nenhum ônibus em viagem agora'
    if (!veiculo) return 'Procurando o ônibus...'
    if (!trajeto) return tracando ? 'Traçando o trajeto...' : 'Carregando...'
    if (eta?.passou) return 'O ônibus já passou por este ponto'
    return eta?.chegando ? 'Chegando neste ponto' : 'A caminho deste ponto'
  }

  return (
    <>
      <Mapa
        paradas={paradas}
        selecionadaId={selecionada?.id ?? null}
        onSelecionar={setSelecionadaId}
        trajeto={trajeto}
        trajetoSaida={trajetoSaida}
        veiculo={veiculo}
        focoOnibus={foco}
      />

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

      {selecionada && veiculo && (
        <button
          onClick={() => setFoco((n) => n + 1)}
          aria-label="Centralizar no ônibus"
          className="absolute bottom-[300px] right-4 z-[1000] w-12 h-12 rounded-full shadow-lg border bg-white border-gray-200 text-xl"
        >🎯</button>
      )}

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
          {!selecionada ? (
            <p className="text-sm text-gray-600 py-2">Toque em um ponto de ônibus no mapa para ver o trajeto e onde o ônibus está.</p>
          ) : (
            <>
              <p className="text-xs font-semibold text-indigo-600 mb-1 truncate">📍 {selecionada.nome}</p>
              <p className="text-[11px] text-gray-500 mb-2">🟣 Chegada ao campus &nbsp; 🟠 Saída da UCSal</p>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <span className={`w-3 h-3 rounded-full ${veiculo ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`} />
                  <span className="text-gray-700 font-semibold text-sm">{textoStatus()}</span>
                </div>
                <div className="text-right">
                  <span className="text-3xl font-black text-green-600">{eta && !eta.passou ? eta.minutos : '--'}</span>
                  <span className="text-green-600 font-bold text-sm"> min</span>
                </div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>{eta && !eta.passou ? `${(eta.metros / 1000).toFixed(1).replace('.', ',')} km até aqui` : '-- km'}</span>
                <span>{atualizadoEm ? `Atualizado às ${hora(atualizadoEm)}` : ''}</span>
              </div>
            </>
          )}

          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>{saida ? `Próxima saída: ${saida.h.replace('*', '')} (em ${saida.falta} min)` : 'Sem mais saídas hoje'}</span>
            {!selecionada && atualizadoEm && <span>Atualizado às {hora(atualizadoEm)}</span>}
          </div>

          <button
            onClick={() => setHorariosAberto(true)}
            className="w-full mt-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold py-3 rounded-xl"
          >
            Ver tabela de horários
          </button>
        </div>
      </div>

      <Horarios aberto={horariosAberto} onFechar={() => setHorariosAberto(false)} />
    </>
  )
}
