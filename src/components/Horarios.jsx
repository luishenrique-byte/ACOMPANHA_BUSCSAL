import { HORARIOS, paraMinutos, proximaSaida } from '../utils/horarios.js'

function Bloco({ titulo, dados, hoje }) {
  const agora = new Date()
  const m = agora.getHours() * 60 + agora.getMinutes()
  const prox = hoje ? proximaSaida() : null
  return (
    <div className="mb-6">
      <div className="bg-blue-500 text-white font-bold py-1 px-4 rounded-full inline-block mb-4 text-sm">
        {titulo}{hoje && ' • hoje'}
      </div>
      {Object.entries(dados).map(([turno, lista]) => (
        <div className="mb-3" key={turno}>
          <span className="text-xs font-bold text-gray-500 tracking-wider">{turno}</span>
          <p className="text-gray-800 font-medium mt-1 flex flex-wrap gap-x-2">
            {lista.map((h) => {
              const classe = !hoje ? '' : prox && h === prox.h ? 'bg-indigo-600 text-white rounded-lg px-1.5' : paraMinutos(h) < m ? 'text-gray-400 line-through' : ''
              return <span key={h} className={classe}>{h}</span>
            })}
          </p>
        </div>
      ))}
    </div>
  )
}

export default function Horarios({ aberto, onFechar }) {
  if (!aberto) return null
  const dia = new Date().getDay()
  return (
    <div className="absolute inset-0 z-[2000] bg-black/60 flex flex-col justify-end" onClick={onFechar}>
      <div className="bg-white w-full h-[85%] rounded-t-3xl flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Itinerário BUSUCSAL</h2>
            <p className="text-sm text-indigo-600 font-medium">Roteiro único</p>
          </div>
          <button onClick={onFechar} aria-label="Fechar" className="w-9 h-9 bg-gray-100 rounded-full text-gray-500">✕</button>
        </div>
        <div className="p-6 overflow-y-auto no-scrollbar pb-10">
          <Bloco titulo="Segunda a Sexta-feira" dados={HORARIOS.semana} hoje={dia >= 1 && dia <= 5} />
          <Bloco titulo="Sábado" dados={HORARIOS.sabado} hoje={dia === 6} />
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-sm">
            <p className="font-bold text-blue-600 mb-1">SAÍDAS</p>
            <strong>UCSal Pituaçu</strong>
            <p className="text-gray-600 mt-1 text-xs mb-3">*Saída do ponto de ônibus na Av. Pinto de Aguiar (em frente ao campus - sentido orla)</p>
            <p className="font-bold text-blue-600 mb-1">ROTEIRO</p>
            <ul className="text-gray-700 space-y-1">
              <li><strong>1ª Parada:</strong> Av. Paralela (sentido centro) - Ponto do Estádio de Pituaçu</li>
              <li><strong>2ª Parada:</strong> Av. Paralela (sentido aeroporto) - Ponto do Estádio de Pituaçu</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
