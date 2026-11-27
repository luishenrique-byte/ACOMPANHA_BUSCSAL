import { useState } from 'react'
import Login from './components/Login.jsx'
import Home from './components/Home.jsx'
import Motorista from './components/Motorista.jsx'

export default function App() {
  const [usuario, setUsuario] = useState(() => {
    try { return JSON.parse(sessionStorage.getItem('usuario')) } catch { return null }
  })

  function entrar({ token, usuario }) {
    sessionStorage.setItem('token', token)
    sessionStorage.setItem('usuario', JSON.stringify(usuario))
    setUsuario(usuario)
  }

  function sair() {
    sessionStorage.clear()
    setUsuario(null)
  }

  return (
    <div className="app-frame">
      {!usuario ? (
        <Login onEntrar={entrar} />
      ) : usuario.tipo === 'motorista' ? (
        <Motorista usuario={usuario} onSair={sair} />
      ) : (
        <Home usuario={usuario} onSair={sair} />
      )}
    </div>
  )
}
