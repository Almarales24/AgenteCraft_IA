# Manual Maestro: AgenteCraft IA 🚀
> **Plataforma de Inteligencia Analítica y Generación de Reportes Ejecutivos**

---

## 1. ¿Qué es AgenteCraft IA?
**AgenteCraft IA** es una solución empresarial diseñada para transformar datos tabulares crudos (CSV) en presentaciones de PowerPoint profesionales y Dashboards interactivos en cuestión de segundos. 

A diferencia de las herramientas de BI tradicionales que solo muestran gráficos, AgenteCraft utiliza **Modelos de Lenguaje de Gran Escala (LLM)** a través de Groq para "leer" los datos, extraer conclusiones de negocio y redactar un guion detallado para el presentador.

---

## 2. Flujo de Trabajo (End-to-End)
El sistema opera en cuatro fases críticas:

1.  **Ingesta de Datos:** El usuario carga un archivo `.csv`. El motor de **Pandas** valida la estructura, limpia campos nulos y calcula estadísticas descriptivas (media, desviación, máximos, mínimos).
2.  **Configuración del Agente:** El usuario define el "perfil" del analista (ej. "Enfoque en Marketing" o "Gerencia Financiera"). Esto inyecta un contexto específico al Agente de IA.
3.  **Inferencia Cognitiva:** El sistema envía las estadísticas resumidas a **Groq (Llama 3.3 70B)**. La IA genera un objeto estructurado que contiene títulos de diapositivas, puntos clave y notas para el orador.
4.  **Generación de Activos:** 
    *   **Visual:** Se renderiza un Dashboard con gráficos de tendencias (`Recharts`).
    *   **Binario:** Se compila un archivo `.pptx` real (`python-pptx`) listo para descargar.

---

## 3. Arquitectura del Sistema
El proyecto está construido sobre un stack moderno y eficiente:

*   **Frontend:** React 18 + TypeScript + Tailwind CSS (Diseño Ultra-Premium).
*   **Backend:** FastAPI (Python 3.11) de alto rendimiento asíncrono.
*   **IA:** Motor Groq con modelo `llama-3.3-70b-versatile`.
*   **Base de Datos:** PostgreSQL (para perfiles y persistencia).
*   **Caché:** Redis (para velocidad de procesamiento).
*   **Contenerización:** Docker + Docker Compose.

---

## 4. Requisitos para Ejecución Local

### Opción A: Usando Docker (Recomendado 🐳)
Ideal para ejecutar el proyecto sin preocuparse por instalar Python o Node.js manualmente.

*   **Prerrequisitos:** Docker Desktop instalado y configurado.
*   **Pasos:**
    1.  Copia el archivo de ejemplo de variables: 
        `cp servidor/.env.ejemplo servidor/.env`
    2.  Edita `servidor/.env` y coloca tu `GROQ_API_KEY`.
    3.  Ejecuta: `docker-compose up --build --force-recreate`
    4.  Accede a `http://localhost:3000`.

### Opción B: Instalación Nativa (Desarrollo 🛠️)
Si deseas modificar el código y tener autocompletado en tu IDE.

#### Requisitos del Sistema:
*   **Node.js v18+**
*   **Python 3.11+**
*   **PostgreSQL y Redis** ejecutándose localmente.

#### Instalación Frontend:
```bash
cd cliente
npm install
npm run dev
```

#### Instalación Backend:
```bash
cd servidor
python -m venv venv
# Activar venv: .\venv\Scripts\activate (Windows) o source venv/bin/activate (Linux)
pip install -r requisitos.txt
uvicorn app.principal:aplicacion --reload
```

---

## 5. Configuración de Variables (.env)
El archivo `servidor/.env` es el corazón de la conexión. Debe contener:

| Variable | Descripción |
| :--- | :--- |
| `GROQ_API_KEY` | Tu llave de API de groq.com (Empieza con `gsk_`). |
| `URL_BASE_DATOS` | Cadena de conexión a Postgres. |
| `DEPURACION` | `true` para ver errores detallados en consola. |

---

## 6. Resolución de Problemas Comunes (FAQ)

> [!IMPORTANT]
> **Error: "Ocurrió una falla en la red neuronal"**
> Esto ocurre usualmente si el modelo especificado ha sido retirado por Groq. El sistema ha sido actualizado para usar `llama-3.3-70b-versatile`. Asegúrate de tener una API Key válida.

> [!TIP]
> **La pantalla se ve negra o sin estilos**
> Verifica que `tailwind.config.js` tenga las llaves en inglés (`content`, `theme`) y no traducidas, para que el motor de estilos pueda compilar.

---

## 7. Mantenimiento y Escalabilidad
*   **Actualización de Modelos:** Si Groq lanza un modelo nuevo, solo debe cambiarse el ID en `servidor/app/servicios/servicio_ia.py`.
*   **Límites de Carga:** El sistema soporta archivos de hasta 50MB. Para archivos mayores, se recomienda implementar procesamiento por fragmentos (*chunking*) en el backend.

---
*Manual generado y actualizado por el equipo de AgentCraft IA - Abril 2026*
