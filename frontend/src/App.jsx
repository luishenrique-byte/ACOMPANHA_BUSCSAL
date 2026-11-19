import { useState } from 'react'
import Login from './components/Login.jsx'
import Home from './components/Home.jsx'

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
      {usuario ? <Home usuario={usuario} onSair={sair} /> : <Login onEntrar={entrar} />}
    </div>
  )
}
