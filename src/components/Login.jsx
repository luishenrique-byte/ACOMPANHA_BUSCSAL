import { useState } from 'react'
import { api } from '../services/api.js'

const EMAIL_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const TIPOS = [
  { id: 'passageiro', rotulo: 'Passageiro', icone: '🎓' },
  { id: 'motorista', rotulo: 'Sou motorista', icone: '🚌' },
]

export default function Login({ onEntrar }) {
  const [tipo, setTipo] = useState('passageiro')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [mostrar, setMostrar] = useState(false)
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)

  async function enviar(e) {
    e.preventDefault()
    if (!EMAIL_VALIDO.test(email.trim())) return setErro('Digite um e-mail válido.')
    if (!senha) return setErro('Digite sua senha.')
    setErro('')
    setCarregando(true)
    try {
      onEntrar(await api.login(email.trim(), senha, tipo))
    } catch (err) {
      setErro(err.message)
    } finally {
      setCarregando(false)
    }
  }

  const campo = 'w-full mt-1 mb-4 px-4 py-3 rounded-xl bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500'

  return (
    <div className="h-full flex flex-col justify-center px-7 bg-gradient-to-b from-indigo-600 to-indigo-800">
      <div className="text-center mb-6 text-white">
        <div className="text-5xl mb-2">🚌</div>
        <h1 className="text-3xl font-black">BusUCSal</h1>
        <p className="text-indigo-200 text-sm mt-1">
          Acompanhe o expresso do campus Pituaçu
        </p>
      </div>

      <form onSubmit={enviar} className="bg-white rounded-3xl p-6 shadow-2xl" noValidate>
        <div className="grid grid-cols-2 gap-2 mb-5 p-1 bg-gray-100 rounded-xl" role="radiogroup" aria-label="Tipo de acesso">
          {TIPOS.map((t) => (
            <button
              type="button"
              key={t.id}
              role="radio"
              aria-checked={tipo === t.id}
              onClick={() => { setTipo(t.id); setErro('') }}
              className={`py-2 rounded-lg text-sm font-semibold transition-colors ${
                tipo === t.id ? 'bg-white text-indigo-700 shadow' : 'text-gray-500'
              }`}
            >
              {t.icone} {t.rotulo}
            </button>
          ))}
        </div>

        <label htmlFor="email" className="text-sm font-semibold text-gray-700">E-mail</label>
        <input
          id="email"
          type="email"
          inputMode="email"
          autoComplete="username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="voce@exemplo.com"
          className={campo}
        />

        <label htmlFor="senha" className="text-sm font-semibold text-gray-700">Senha</label>
        <div className="relative">
          <input
            id="senha"
            type={mostrar ? 'text' : 'password'}
            autoComplete="current-password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            placeholder="Sua senha"
            className={campo + ' pr-20'}
          />
          <button
            type="button"
            onClick={() => setMostrar((m) => !m)}
            className="absolute right-3 top-[18px] text-xs font-semibold text-indigo-600"
          >
            {mostrar ? 'Ocultar' : 'Mostrar'}
          </button>
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
