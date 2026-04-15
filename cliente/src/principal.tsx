import React from 'react'
import ReactDOM from 'react-dom/client'
import Aplicacion from './Aplicacion'
import './estilos/globales.css'

ReactDOM.createRoot(document.getElementById('raiz')!).render(
  <React.StrictMode>
    <Aplicacion />
  </React.StrictMode>
)
