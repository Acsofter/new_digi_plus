'use client'

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function NotFound() {
  const [countdown, setCountdown] = useState(10)
  const navigate = useNavigate()

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          navigate('/')

        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="h-screen z-50 bg-gradient-to-br from-purple-400 via-violet-500 to-indigo-500 items-center justify-center px-4">
      <div className="max-w-xl w-full bg-white rounded-lg shadow-2xl overflow-hidden">
        <div className="p-8">
          <div className="text-center">
            <h1 className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-600">
              404
            </h1>
            <p className="text-2xl font-bold text-slate-800 mt-4">
              ¡Ups! Página no encontrada
            </p>
            <p className="text-slate-600 mt-2">
              La página que estás buscando no existe o ha sido movida.
            </p>
          </div>
          <div className="mt-8">
            <button
              onClick={() => navigate('/')}
              className="w-full bg-gradient-to-tr from-violet-300 to-indigo-600 border border-indigo-300 text-white font-bold py-3 px-4 rounded-lg hover:opacity-90 transition duration-300"
            >
              Regresar a Inicio
            </button>
          </div>
          <div className="text-center mt-6 text-gray-500">
            redirigiendo en {countdown} segundos...
          </div>
        </div>
        <div className="h-2 bg-gradient-to-r from-indigo-500 via-violet-500 to-indigo-400"></div>
      </div>
    </div>
  )
}

