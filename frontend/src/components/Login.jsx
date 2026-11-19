import { useState } from 'react'
import { api } from '../services/api.js'

const PERFIS = [
  { id: 'aluno', rotulo: 'Aluno', icone: '🎒' },
  { id: 'professor', rotulo: 'Professor', icone: '👩‍🏫' },
  { id: 'funcionario', rotulo: 'Funcionário', icone: '💼' },
]

export default function Login({ onEntrar }) {
  const [matricula, setMatricula] = useState('')
  const [perfil, setPerfil] = useState(null)
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)

  async function enviar(e) {
    e.preventDefault()
    if (!/^\d{6,9}$/.test(matricula)) return setErro('Digite sua matrícula (6 a 9 números).')
    if (!perfil) return setErro('Escolha se você é aluno, professor ou funcionário.')
    setErro('')
    setCarregando(true)
    try {
      onEntrar(await api.login(matricula, perfil))
    } catch (err) {
      setErro(err.message)
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className="h-full flex flex-col justify-center px-7 bg-gradient-to-b from-indigo-600 to-indigo-800">
      <div className="text-center mb-8 text-white">
        <div className="text-5xl mb-2">🚌</div>
        <h1 className="text-3xl font-black">BusUCSal</h1>
        <p className="text-indigo-200 text-sm mt-1">Acompanhe o expresso do campus Pituaçu</p>
      </div>

      <form onSubmit={enviar} className="bg-white rounded-3xl p-6 shadow-2xl" noValidate>
        <label htmlFor="matricula" className="text-sm font-semibold text-gray-700">Matrícula</label>
        <input
          id="matricula"
          inputMode="numeric"
          autoComplete="username"
          value={matricula}
          onChange={(e) => setMatricula(e.target.value.replace(/\D/g, ''))}
          placeholder="Ex.: 20240001"
          className="w-full mt-1 mb-5 px-4 py-3 rounded-xl bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <p className="text-sm font-semibold text-gray-700 mb-2">Você é</p>
        <div className="grid grid-cols-3 gap-2 mb-5" role="radiogroup" aria-label="Perfil">
          {PERFIS.map((p) => (
            <button
              type="button"
              key={p.id}
              role="radio"
              aria-checked={perfil === p.id}
              onClick={() => setPerfil(p.id)}
              className={`py-3 rounded-xl border-2 text-sm font-semibold transition-colors ${
                perfil === p.id ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-gray-200 text-gray-600'
              }`}
            >
              <div className="text-2xl">{p.icone}</div>
              {p.rotulo}
            </button>
          ))}
        </div>

        {erro && <p className="text-red-600 text-sm mb-3" role="alert">{erro}</p>}

        <button
          disabled={carregando}
          className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-bold py-3 rounded-xl"
        >
          {carregando ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </div>
  )
}
