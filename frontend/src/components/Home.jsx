import { useEffect, useState } from 'react'
import Mapa from './Mapa.jsx'
import Horarios from './Horarios.jsx'
import { api } from '../services/api.js'
import { proximaSaida } from '../utils/horarios.js'

const LINHA_ID = 'exp-ucsal'
const ROTULO_PERFIL = { aluno: 'Aluno', professor: 'Professor', funcionario: 'Funcionário' }

export default function Home({ usuario, onSair }) {
  const [rota, setRota] = useState([])
  const [paradas, setParadas] = useState([])
  const [campus, setCampus] = useState(null)
  const [veiculo, setVeiculo] = useState(null)
  const [erro, setErro] = useState('')
  const [seguir, setSeguir] = useState(true)
  const [horariosAberto, setHorariosAberto] = useState(false)
  const [saida, setSaida] = useState(proximaSaida())

  // Rota calculada no back end (Directions API)
  useEffect(() => {
    api.buscarRota(LINHA_ID).then(setRota).catch(() => setErro('Não foi possível carregar o trajeto.'))
  }, [])

  // Paradas e local do campus (vêm do back end)
  useEffect(() => {
    api.buscarParadas(LINHA_ID).then(setParadas).catch(() => {})
    api.buscarCampus(LINHA_ID).then(setCampus).catch(() => {})
  }, [])

  // Posição do ônibus: consulta o back end a cada 3 segundos
  useEffect(() => {
    let ativo = true
    const ler = () =>
      api.buscarVeiculo(LINHA_ID).then((v) => ativo && (setVeiculo(v), setErro(''))).catch(() => ativo && setErro('Sem sinal do ônibus no momento.'))
    ler()
    const id = setInterval(ler, 3000)
    return () => { ativo = false; clearInterval(id) }
  }, [])

  useEffect(() => {
    const id = setInterval(() => setSaida(proximaSaida()), 30000)
    return () => clearInterval(id)
  }, [])

  const chegando = veiculo && veiculo.etaMinutos <= 1

  return (
    <>
      <Mapa rota={rota} paradas={paradas} campus={campus} veiculo={veiculo} seguir={seguir} onArrastar={() => setSeguir(false)} />

      {/* Topo */}
      <div className="absolute top-0 left-0 right-0 z-[1000] p-4">
        <div className="bg-white rounded-full shadow-lg flex items-center pl-5 pr-2 py-2">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-gray-800 truncate">{usuario.nome}</p>
            <p className="text-xs text-gray-500">{ROTULO_PERFIL[usuario.perfil]} · {usuario.matricula}</p>
          </div>
          <button onClick={onSair} className="text-xs font-semibold text-indigo-600 px-3 py-2">Sair</button>
        </div>
        {erro && <p className="mt-2 bg-red-50 text-red-700 text-xs rounded-xl px-3 py-2 shadow" role="alert">{erro}</p>}
      </div>

      {/* Botão seguir ônibus */}
      <button
        onClick={() => setSeguir((s) => !s)}
        aria-pressed={seguir}
        aria-label="Seguir ônibus"
        className={`absolute bottom-[270px] right-4 z-[1000] w-12 h-12 rounded-full shadow-lg border text-xl ${seguir ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white border-gray-200'}`}
      >🎯</button>

      {/* Painel inferior */}
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
                {!veiculo ? 'Procurando o ônibus...' : chegando ? 'Chegando ao campus' : 'A caminho do campus'}
              </span>
            </div>
            <div className="text-right">
              <span className="text-3xl font-black text-green-600">{veiculo ? veiculo.etaMinutos : '--'}</span>
              <span className="text-green-600 font-bold text-sm"> min</span>
            </div>
          </div>

          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>{veiculo ? `${(veiculo.distanciaRestanteMetros / 1000).toFixed(1).replace('.', ',')} km restantes` : '-- km restantes'}</span>
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
