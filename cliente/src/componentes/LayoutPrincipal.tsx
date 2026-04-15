import { Outlet, Link, useLocation } from 'react-router-dom'
import { Activity, Database, Settings, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function LayoutPrincipal() {
  const location = useLocation()

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 font-sans selection:bg-indigo-500/30 relative overflow-hidden">
      {/* Background Mesh Gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-900/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-900/20 blur-[120px] pointer-events-none" />

      <nav className="border-b border-white/5 bg-slate-950/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center gap-3">
              <div className="relative flex items-center justify-center w-10 h-10 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-xl shadow-lg shadow-indigo-500/20">
                <Activity className="w-5 h-5 text-white" />
                <Sparkles className="w-3 h-3 text-indigo-200 absolute -top-1 -right-1" />
              </div>
              <span className="text-2xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400">
                AgenteCraft
              </span>
            </div>
            
            <div className="flex space-x-2 bg-slate-900/50 p-1.5 rounded-2xl border border-white/5">
              <NavLink to="/subir" icon={<Database className="w-4 h-4" />} label="1. Fuente Data" active={location.pathname === '/subir'} />
              <NavLink to="/configurar" icon={<Settings className="w-4 h-4" />} label="2. Agente IA" active={location.pathname === '/configurar'} />
              <NavLink to="/dashboard" icon={<Activity className="w-4 h-4" />} label="3. Resultados" active={location.pathname === '/dashboard'} />
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 15, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -15, filter: 'blur(4px)' }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  )
}

function NavLink({ to, icon, label, active }: { to: string, icon: React.ReactNode, label: string, active: boolean }) {
  return (
    <Link
      to={to}
      className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
        active 
          ? 'bg-slate-800 text-white shadow-sm ring-1 ring-white/10' 
          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
      }`}
    >
      {icon}
      {label}
    </Link>
  )
}
