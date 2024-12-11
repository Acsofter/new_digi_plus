import React from 'react'
import { ArrowRight, BarChart2, DollarSign, PieChart } from 'lucide-react'
import { Link } from 'react-router-dom'

const LandingPage: React.FC = () => {
  return (
    <div className="h-screen bg-gray-100 overflow-hidden">
      <header className="bg-white shadow">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-2xl font-bold text-indigo-500">Digi</span>
              </div>
            </div>
            <div className="flex items-center">
            
              <Link to="/login" className="ml-4 px-4 py-2 rounded-md text-sm font-medium text-white bg-indigo-500 hover:bg-indigo-600">
                Acceder
              </Link>
            </div>
          </div>
        </nav>
      </header>

      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="text-center">
              <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                Administra tu <span className="text-indigo-500 animate-pulse">papelería</span> con Digi
              </h1>
              <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                Te ayudamos a gestionar las métricas semanales y el rendimiento de tus empleados.
              </p>
              <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
                <div className="rounded-md shadow">
                  <Link to="/login" className="w-full flex items-center justify-center px-8 py-3 border border-indigo-400 shadow-md shadow-indigo-300 text-base font-medium rounded-md text-white bg-gradient-to-r from-indigo-600 to-indigo-400 hover:bg-indigo-600 md:py-4 md:text-lg md:px-10 duration-200">
                    Comencemos
                    <ArrowRight className="ml-2 -mr-1 h-5 w-5 animate-bouncex" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </div>

            <div className="mt-10">
              <h2 className="text-center text-3xl font-extrabold text-gray-900">
                Algunas características
              </h2>
              <div className="mt-10">
                <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
                  <div className="relative">
                    <dt>
                      <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                        <BarChart2 className="h-6 w-6" aria-hidden="true" />
                      </div>
                      <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Métricas Semanales</p>
                    </dt>
                    <dd className="mt-2 ml-16 text-base text-gray-500">
                      Visualiza y analiza las métricas de rendimiento de tu papelería cada semana.
                    </dd>
                  </div>

                  <div className="relative">
                    <dt>
                      <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                        <PieChart className="h-6 w-6" aria-hidden="true" />
                      </div>
                      <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Gestión de Empleados</p>
                    </dt>
                    <dd className="mt-2 ml-16 text-base text-gray-500">
                      Administra las tareas y el rendimiento de tus empleados de manera eficiente.
                    </dd>
                  </div>

                  <div className="relative">
                    <dt>
                      <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                        <DollarSign className="h-6 w-6" aria-hidden="true" />
                      </div>
                      <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Porcentaje de Ganancias</p>
                    </dt>
                    <dd className="mt-2 ml-16 text-base text-gray-500">
                      Calcula y visualiza el porcentaje de ganancias que se quedan en la papelería.
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white ">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 md:flex md:items-center md:justify-between lg:px-8">
          <div className="flex justify-center space-x-6 md:order-2">
            <Link to="#" className="text-gray-400 hover:text-gray-500">
              <span className="sr-only">Facebook</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
              </svg>
            </Link>
            <Link to="#" className="text-gray-400 hover:text-gray-500">
              <span className="sr-only">Twitter</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
              </svg>
            </Link>
          </div>
          <div className="mt-8 md:mt-0 md:order-1">
            <p className="text-center text-base text-gray-400">
              &copy; 2024 Digi, Inc. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage