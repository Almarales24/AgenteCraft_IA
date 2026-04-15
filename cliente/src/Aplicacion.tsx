import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import CargaDatos from './vistas/CargaDatos'
import Dashboard from './vistas/Dashboard'
import ConfiguracionAgente from './vistas/ConfiguracionAgente'
import LayoutPrincipal from './componentes/LayoutPrincipal'

const clienteConsultas = new QueryClient()

function Aplicacion() {
  return (
    <QueryClientProvider client={clienteConsultas}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LayoutPrincipal />}>
            <Route index element={<Navigate to="/subir" replace />} />
            <Route path="subir" element={<CargaDatos />} />
            <Route path="configurar" element={<ConfiguracionAgente />} />
            <Route path="dashboard" element={<Dashboard />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <ToastContainer position="bottom-right" />
    </QueryClientProvider>
  )
}

export default Aplicacion
