import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAnalisisStore } from '../hooks/useAnalisisStore'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LineChart, Line } from 'recharts'
import { DownloadCloud, Presentation, FileText, ChevronRight, Check } from 'lucide-react'
import { motion } from 'framer-motion'
import axios from 'axios'
import { toast } from 'react-toastify'

export default function Dashboard() {
  const navigate = useNavigate()
  const { estadisticas, analisisIA } = useAnalisisStore()
  const [descargando, setDescargando] = useState(false)

  if (!estadisticas || !analisisIA) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-300">No hay un análisis generado todavía.</h2>
        <button onClick={() => navigate('/subir')} className="mt-6 px-6 py-2 bg-indigo-600 rounded-lg text-white">Volver al inicio</button>
      </div>
    )
  }

  // Prepara datos para los graficos usando la muestra generica
  const chartData = useMemo(() => {
    return estadisticas.muestra.map((fila, index) => {
      // Filtrar solos los campos que sean numericos
      let obj:any = { name: `Fila ${index + 1}` }
      Object.keys(fila).forEach(k => {
        if (typeof fila[k] === 'number') {
          obj[k] = fila[k]
        }
      })
      return obj
    })
  }, [estadisticas])

  const columnasNumericas = Object.keys(estadisticas.tipos_datos).filter(k => estadisticas.tipos_datos[k].includes('float') || estadisticas.tipos_datos[k].includes('int'))

  const exportarPPTX = async () => {
    setDescargando(true)
    try {
      const resp = await axios.post('/api/analisis/reporte-pptx', {
        analisis_ia: analisisIA
      }, {
        responseType: 'blob' // Es vital para archivos
      })
      
      const url = window.URL.createObjectURL(new Blob([resp.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'Reporte_Profesional_AgenteCraft.pptx')
      document.body.appendChild(link)
      link.click()
      link.parentNode?.removeChild(link)
      
      toast.success("¡Presentación descargada exitosamente!")
    } catch (error) {
      console.error(error)
      toast.error("Error al exportar la presentación")
    } finally {
      setDescargando(false)
    }
  }

  return (
    <div className="space-y-10 pb-20 relative">
      {/* Decorative Glows */}
      <div className="absolute top-20 right-10 w-96 h-96 bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-fuchsia-500/10 blur-[100px] rounded-full pointer-events-none" />

      {/* Header Panel */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-slate-900/40 p-8 rounded-3xl border border-white/5 backdrop-blur-xl shadow-2xl relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-transparent to-transparent opacity-50" />
        <div className="relative z-10 w-full flex flex-col items-start gap-4 md:flex-row md:items-center justify-between">
          <div className="flex-1">
            <h1 className="text-3xl font-black mb-3 flex items-center gap-3 text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 tracking-tight">
              <Presentation className="text-indigo-400 w-8 h-8 shrink-0" />
              Tablero Analítico IA
            </h1>
            <p className="text-slate-300 max-w-3xl leading-relaxed text-base font-medium">
              {analisisIA.resumen_general || "El reporte paramétrico ha sido procesado basado en tu arquitectura de agente."}
            </p>
          </div>
          <button
            onClick={exportarPPTX}
            disabled={descargando}
            className="shrink-0 flex items-center justify-center gap-3 bg-gradient-to-tr from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-[0_0_40px_rgba(99,102,241,0.3)] hover:shadow-[0_0_60px_rgba(99,102,241,0.5)] border border-indigo-400/30 hover:-translate-y-1 w-full md:w-auto"
          >
            {descargando ? <span className="animate-spin text-xl">⏳</span> : <DownloadCloud className="w-5 h-5 group-hover:scale-110 transition-transform" />}
            {descargando ? "Compilando..." : "Exportar Presentación"}
          </button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
        {/* Graficos (Izquierda) */}
        <div className="space-y-8">
          <div className="bg-slate-900/60 border border-white/5 p-8 rounded-3xl shadow-xl backdrop-blur-md">
            <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2 mb-8">
              <span className="w-2 h-6 bg-indigo-500 rounded-full inline-block" /> Muestra de Variables Dominantes
            </h3>
            <div className="h-80">
              {chartData.length > 0 && columnasNumericas.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                    <XAxis dataKey="name" stroke="#64748b" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis stroke="#64748b" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px', color: '#f8fafc', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)' }} 
                      itemStyle={{ color: '#e2e8f0' }}
                      cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                    />
                    <Legend wrapperStyle={{ paddingTop: '20px' }} iconType="circle" />
                    {columnasNumericas.slice(0, 3).map((col, i) => (
                      <Bar key={col} dataKey={col} fill={i === 0 ? '#6366f1' : i === 1 ? '#10b981' : '#ec4899'} radius={[6, 6, 0, 0]} maxBarSize={40} />
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-500 font-medium">No se detectaron vectores continuos graficables.</div>
              )}
            </div>
          </div>
          
          <div className="bg-slate-900/60 border border-white/5 p-8 rounded-3xl shadow-xl backdrop-blur-md">
              <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2 mb-8">
                <span className="w-2 h-6 bg-fuchsia-500 rounded-full inline-block" /> Distribución de Frecuencia
              </h3>
              <div className="h-80">
                {chartData.length > 0 && columnasNumericas.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                      <XAxis dataKey="name" stroke="#64748b" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                      <YAxis stroke="#64748b" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px', color: '#f8fafc', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)' }} 
                      />
                      <Legend wrapperStyle={{ paddingTop: '20px' }} iconType="circle" />
                      {columnasNumericas.slice(0, 2).map((col, i) => (
                        <Line key={col} type="monotone" dataKey={col} stroke={i === 0 ? '#3b82f6' : '#a855f7'} strokeWidth={4} dot={{ r: 5, strokeWidth: 2, fill: '#0f172a' }} activeDot={{ r: 8, strokeWidth: 0 }} />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-slate-500 font-medium">No se detectaron vectores continuos graficables.</div>
                )}
              </div>
          </div>
        </div>

        {/* Diapositivas IA (Derecha) */}
        <div className="space-y-6">
          <h3 className="text-2xl font-black flex items-center gap-3 mb-6 text-white tracking-tight">
            <FileText className="text-pink-500 w-8 h-8" />
            Vistas de Diapositivas PPTX
          </h3>
          
          <div className="space-y-6 max-h-[850px] overflow-y-auto custom-scrollbar pr-4">
            {analisisIA.diapositivas?.map((diapositiva, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1, duration: 0.4 }}
                className="bg-slate-900/80 border border-white/5 p-8 rounded-3xl hover:bg-slate-800/80 hover:border-white/10 transition-all duration-300 shadow-xl group"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-indigo-500/20 text-indigo-300 font-black text-sm px-3 py-1 rounded-lg border border-indigo-500/20">Slide {i + 1}</div>
                  <h4 className="text-xl font-bold text-slate-100 group-hover:text-indigo-300 transition-colors">{diapositiva.titulo}</h4>
                </div>
                
                <ul className="space-y-3 mb-8 ml-2">
                  {diapositiva.puntos?.map((punto, idx) => (
                    <li key={idx} className="flex items-start gap-4 text-base text-slate-300 font-medium">
                      <div className="bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full p-1 mt-0.5 shadow-sm shadow-emerald-500/20">
                        <Check className="w-3 h-3 text-white shrink-0" />
                      </div>
                      <span className="leading-relaxed">{punto}</span>
                    </li>
                  ))}
                </ul>

                <div className="bg-gradient-to-r from-rose-950/40 to-transparent rounded-2xl p-6 border-l-4 border-rose-500/70">
                  <span className="text-xs font-black uppercase text-rose-400 mb-3 flex items-center gap-2 tracking-widest">
                    <ChevronRight className="w-4 h-4" /> Teleprompter / Notas del Orador
                  </span>
                  <p className="text-sm text-slate-400 italic leading-loose font-medium">
                    "{diapositiva.notas_orador}"
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
