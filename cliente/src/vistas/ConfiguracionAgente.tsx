import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Settings, Sparkles, Brain, ArrowRight, CheckCircle2 } from 'lucide-react'
import { useAnalisisStore } from '../hooks/useAnalisisStore'
import { toast } from 'react-toastify'
import axios from 'axios'
import { motion } from 'framer-motion'

export default function ConfiguracionAgente() {
  const navigate = useNavigate()
  const { estadisticas, parametrosAgente, setParametrosAgente, setAnalisisIA } = useAnalisisStore()
  const [generando, setGenerando] = useState(false)

  if (!estadisticas) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <div className="bg-red-500/10 p-4 rounded-full mb-6 relative">
          <div className="absolute inset-0 bg-red-500 blur-xl opacity-20" />
          <Settings className="w-12 h-12 text-red-400 relative z-10" />
        </div>
        <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-100 to-slate-400 mb-2">Ausencia de Datos</h2>
        <p className="text-slate-500 mb-8 max-w-md text-center">Debes cargar tu información tabular antes de poder parametrizar el perfil cognitivo del Agente Analista.</p>
        <button onClick={() => navigate('/subir')} className="px-8 py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/25 transition-all">
          Volver a Carga de Datos
        </button>
      </div>
    )
  }

  const generarAnalisis = async () => {
    setGenerando(true)
    try {
      const respuesta = await axios.post('/api/analisis/analizar', {
        estadisticas: estadisticas.estadisticas,
        parametros_agente: parametrosAgente,
      })
      setAnalisisIA(respuesta.data.analisis)
      toast.success("Análisis cognitivo estructurado exitosamente")
      navigate('/dashboard')
    } catch (error) {
      console.error(error)
      toast.error("Ocurrió una falla en la red neuronal al generar tu reporte.")
    } finally {
      setGenerando(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-10 relative">
      <div className="flex items-center gap-5 relative z-10">
        <div className="bg-gradient-to-br from-indigo-500 via-purple-500 to-fuchsia-500 p-4 rounded-2xl shadow-xl shadow-purple-500/20 relative">
          <div className="absolute inset-0 bg-white/20 rounded-2xl mix-blend-overlay" />
          <Settings className="w-8 h-8 text-white relative z-10" />
        </div>
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-white to-slate-400 tracking-tight">Parametrización IA</h1>
          <p className="text-slate-400 mt-1 font-medium">Instruye el tono argumentativo, foco comercial y profundidad con la que el modelo analizará tu estructura.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        <motion.div className="col-span-1 lg:col-span-8 flex flex-col gap-6"
          initial={{ opacity: 0, x: -20, filter: 'blur(10px)' }} animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }} transition={{ duration: 0.5 }}>
          
          <div className="bg-slate-900/60 border border-white/5 p-8 rounded-3xl backdrop-blur-md shadow-2xl flex-1 flex flex-col">
            <label className="block text-sm font-semibold text-indigo-300 mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> Prompt del Especialista
            </label>
            <textarea 
              className="w-full flex-1 bg-black/40 border border-white/10 rounded-2xl p-5 text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:bg-slate-900/80 focus:border-indigo-400/50 outline-none transition-all placeholder-slate-600 min-h-[220px] resize-none leading-relaxed"
              placeholder="Ej. Interpreta estos datos financieros desde la perspectiva de un gerente de riesgo. Resalta valores atípicos y sugiere tres métricas para mitigar la caída de ingresos en el último trimestre. Mantén un vocabulario formal."
              value={parametrosAgente}
              onChange={(e) => setParametrosAgente(e.target.value)}
            />

            <div className="mt-6">
              <p className="text-xs font-medium text-slate-500 mb-3 uppercase tracking-wider">Presets Recomendados</p>
              <div className="flex flex-wrap gap-2">
                {[
                  '📈 Gerencia de Inversiones (Formal)', 
                  '🎯 Marketing y Retención', 
                  '🔍 Científico de Datos (Técnico)', 
                  '⚡ Resumen Ejecutivo Rápido'
                ].map(preset => (
                  <button key={preset} 
                    onClick={() => setParametrosAgente(`Enfoca el análisis estrictamente hacia este perfil: ${preset}. Extrae conclusiones numéricamente respaldadas y estructúralo para ser expuesto ante directivos.`)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold border border-white/10 bg-white/5 hover:border-indigo-500 hover:bg-indigo-500/20 hover:text-indigo-200 transition-all text-slate-300 shadow-sm"
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button 
            disabled={generando}
            onClick={generarAnalisis}
            className={`w-full py-5 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all duration-300 group overflow-hidden relative
              ${generando 
                ? 'bg-slate-800 text-slate-400 cursor-wait border border-white/5' 
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-xl shadow-indigo-500/30 hover:shadow-indigo-500/50 border border-indigo-400/30 hover:-translate-y-0.5'}`}
          >
            {generando && <div className="absolute inset-0 bg-indigo-500/20 animate-pulse" />}
            
            <span className="relative z-10 flex items-center justify-center">
              {generando ? (
                <><Brain className="w-6 h-6 animate-pulse mr-2" /> Ejecutando inferencia neuronal...</>
              ) : (
                <><Sparkles className="w-6 h-6 mr-2 text-indigo-200 group-hover:animate-spin" /> Inyectar Conocimiento y Construir Reporte <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" /></>
              )}
            </span>
          </button>
        </motion.div>

        <motion.div className="col-span-1 lg:col-span-4 space-y-4"
          initial={{ opacity: 0, x: 20, filter: 'blur(10px)' }} animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }} transition={{ duration: 0.5, delay: 0.1 }}>
          
          <div className="bg-gradient-to-b from-indigo-900/40 to-slate-900/60 border border-indigo-500/20 p-7 rounded-3xl backdrop-blur-md shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-3xl rounded-full" />
            
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2 mb-6 border-b border-indigo-500/20 pb-4">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" /> Huella Estructural
            </h3>
            
            <div className="space-y-4 relative z-10">
              <div className="bg-black/30 border border-white/5 p-4 rounded-2xl transition hover:bg-black/40">
                <span className="block text-[10px] uppercase tracking-widest text-indigo-300/80 mb-1 font-bold">Volumen Analizado</span>
                <span className="text-3xl font-black text-white">{estadisticas.num_filas.toLocaleString()} <span className="text-base font-medium text-slate-500">Filas</span></span>
              </div>
              
              <div className="bg-black/30 border border-white/5 p-4 rounded-2xl transition hover:bg-black/40">
                <span className="block text-[10px] uppercase tracking-widest text-indigo-300/80 mb-1 font-bold">Vectores (Columnas)</span>
                <span className="text-3xl font-black text-white">{estadisticas.columnas.length} <span className="text-base font-medium text-slate-500">Variables</span></span>
              </div>

              <div className="bg-black/30 border border-white/5 p-4 rounded-2xl max-h-[220px] overflow-y-auto custom-scrollbar">
                <span className="block text-[10px] uppercase tracking-widest text-indigo-300/80 mb-3 font-bold sticky top-0 bg-black/80 backdrop-blur-sm py-1">Tipos Extraídos</span>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(estadisticas.tipos_datos).map(([col, tipo]) => (
                    <div key={col} className="w-full flex justify-between items-center text-xs py-1.5 px-3 bg-white/5 rounded-lg border border-white/5">
                      <span className="text-slate-300 font-medium truncate max-w-[60%]">{col}</span>
                      <span className="text-indigo-400/80 bg-indigo-500/10 px-2 py-0.5 rounded text-[10px] font-bold">{String(tipo)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
