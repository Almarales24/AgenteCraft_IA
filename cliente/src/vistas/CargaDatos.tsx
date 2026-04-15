import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { UploadCloud, FileType, CheckCircle, Database, ArrowRight } from 'lucide-react'
import { useAnalisisStore } from '../hooks/useAnalisisStore'
import { toast } from 'react-toastify'
import axios from 'axios'
import { motion } from 'framer-motion'

export default function CargaDatos() {
  const [arrastrando, setArrastrando] = useState(false)
  const [subiendo, setSubiendo] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()
  const { setEstadisticas } = useAnalisisStore()

  const manejarDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    setArrastrando(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await procesarArchivo(e.dataTransfer.files[0])
    }
  }

  const manejarCambioInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await procesarArchivo(e.target.files[0])
    }
  }

  const procesarArchivo = async (archivo: File) => {
    if (!archivo.name.endsWith('.csv')) {
      toast.error("Por favor, sube solo archivos CSV.")
      return
    }

    setSubiendo(true)
    const formData = new FormData()
    formData.append('archivo', archivo)

    try {
      const respuesta = await axios.post('/api/analisis/subir', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      
      setEstadisticas(respuesta.data.datos)
      toast.success("Ingesta de datos completada")
      navigate('/configurar')
    } catch (error) {
      console.error(error)
      toast.error("Hubo un error interpretando tu archivo.")
    } finally {
      setSubiendo(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center py-10 lg:py-20 relative">
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-12 z-10"
      >
        <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white via-slate-200 to-indigo-200 tracking-tight mb-6 drop-shadow-sm">
          Acelera tus Conclusiones
        </h1>
        <p className="text-slate-400 max-w-xl mx-auto text-lg leading-relaxed">
          Nuestra inteligencia artificial lee tu <span className="text-indigo-300 font-medium whitespace-nowrap">.CSV comercial</span> y proyecta un análisis accionable con diapositivas completas en segundos.
        </p>
      </motion.div>

      <motion.div 
        whileHover={{ scale: 1.01, boxShadow: "0 25px 50px -12px rgba(99, 102, 241, 0.15)" }}
        whileTap={{ scale: 0.99 }}
        className={`relative z-10 w-full max-w-2xl p-12 rounded-3xl backdrop-blur-md transition-all duration-300 flex flex-col items-center justify-center gap-6 cursor-pointer overflow-hidden
          ${arrastrando 
            ? 'bg-indigo-900/40 border-2 border-indigo-500 shadow-[0_0_40px_rgba(99,102,241,0.2)]' 
            : 'bg-slate-900/40 border border-white/10 hover:border-indigo-500/50 hover:bg-slate-800/60 shadow-2xl'}`}
        onDragOver={(e) => { e.preventDefault(); setArrastrando(true) }}
        onDragLeave={() => setArrastrando(false)}
        onDrop={manejarDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        {arrastrando && (
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-indigo-500/10 animate-pulse pointer-events-none" />
        )}

        <input 
          type="file" 
          accept=".csv" 
          className="hidden" 
          ref={fileInputRef} 
          onChange={manejarCambioInput}
        />
        
        {subiendo ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-6 py-8"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-indigo-500 blur-xl opacity-40 animate-pulse rounded-full" />
              <Database className="w-16 h-16 text-indigo-400 relative z-10 animate-bounce" />
            </div>
            <div className="text-center">
              <p className="text-xl font-semibold text-white tracking-tight">Ingestando vectores numéricos...</p>
              <p className="text-sm text-indigo-300/80 mt-2 font-medium">Leyendo columnas categóricas</p>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center gap-5 w-full"
          >
            <div className="relative group p-6">
              <div className="absolute inset-0 bg-indigo-500/20 blur-2xl rounded-full transition-all group-hover:bg-indigo-500/40 opacity-0 group-hover:opacity-100" />
              <div className="relative p-5 bg-gradient-to-tr from-slate-800 to-slate-700/50 rounded-2xl border border-white/5 shadow-inner">
                <UploadCloud className="w-10 h-10 text-indigo-300" />
              </div>
            </div>
            <div className="text-center">
              <p className="text-xl font-semibold text-slate-100">Haz clic para buscar o arrastra tu archivo</p>
              <p className="text-sm text-slate-500 mt-2 font-medium">Solo formatos .CSV permitidos (máx. 50MB)</p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-3 mt-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-indigo-200 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1.5 rounded-full shadow-sm shadow-indigo-500/5">
                <FileType className="w-3.5 h-3.5" /> Estructuración Automática
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-200 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full shadow-sm shadow-emerald-500/5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> Limpieza de Nulos
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}
