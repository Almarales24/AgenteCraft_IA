import { create } from 'zustand'

interface Estadisticas {
  num_filas: number
  columnas: string[]
  tipos_datos: Record<string, string>
  estadisticas: Record<string, any>
  muestra: any[]
}

interface Diapositiva {
  titulo: string
  puntos: string[]
  notas_orador: string
}

interface AnalisisIA {
  resumen_general: string
  diapositivas: Diapositiva[]
}

interface AnalisisState {
  estadisticas: Estadisticas | null
  parametrosAgente: string
  analisisIA: AnalisisIA | null
  setEstadisticas: (stats: Estadisticas) => void
  setParametrosAgente: (params: string) => void
  setAnalisisIA: (analisis: AnalisisIA) => void
  resetearTodo: () => void
}

export const useAnalisisStore = create<AnalisisState>((set) => ({
  estadisticas: null,
  parametrosAgente: 'Genera un reporte profesional enfocado en encontrar patrones clave.',
  analisisIA: null,
  setEstadisticas: (stats) => set({ estadisticas: stats }),
  setParametrosAgente: (params) => set({ parametrosAgente: params }),
  setAnalisisIA: (analisis) => set({ analisisIA: analisis }),
  resetearTodo: () => set({ estadisticas: null, parametrosAgente: '', analisisIA: null }),
}))
