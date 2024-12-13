'use client'

import { CircleCheck, CreditCard, FileDown, UserRoundPlus, X } from 'lucide-react';
import { usePayment } from "../contexts/PaymentContext";

export const PaymentsFilters = () => {
  const { users, currentWeek, exportPayments, payments, handleChangesFilters, onHandleGeneratePayment } = usePayment();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="relative">
            <select
              className="appearance-none bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 py-2 pl-10 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onChange={(e) => {
                handleChangesFilters({
                  collaborator: e.target.value === "all" ? null : users[parseInt(e.target.value)].id,
                });
              }}
            >
              <option value="all">Todos</option>
              {users.map((user, index) => (
                <option key={index} value={index} className="capitalize">
                  {user.username}
                </option>
              ))}
            </select>
            <UserRoundPlus className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          </div>

          <span
            className={`inline-flex items-center px-4 py-1 rounded-full text-sm font-medium ${
              currentWeek.is_paid
                ? "bg-teal-100 text-teal-500 border border-teal-400 dark:bg-teal-800 dark:text-teal-100 "
                : "bg-rose-100 text-rose-500 border border-rose-400 dark:bg-rose-800 dark:text-rose-100"
            }`}
          >
            {currentWeek.is_paid ? (
              <>
                <CircleCheck className="mr-2" size={16} /> pago generado
              </>
            ) : (
              <>
                <X className="mr-2" size={16} /> pendiente por pagar
              </>
            )}
          </span>
        </div>

        <div className="flex flex-wrap gap-4">
          <button
            className="inline-flex items-center px-4 py-2 border border-teal-400 text-sm font-medium rounded-md text-white bg-gradient-to-br to-teal-600 from-teal-400 hover:from-teal-600 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime-500 disabled:opacity-50 disabled:cursor-not-allowed duration-300"
            disabled={!currentWeek.is_paid}
            onClick={exportPayments}
          >
            <FileDown className="mr-2" size={18} />
            Exportar
          </button>
          <button
            disabled={currentWeek.is_paid || !payments.results.length}
            onClick={onHandleGeneratePayment}
            className="inline-flex items-center px-4 py-2 border border-indigo-400 text-sm font-medium rounded-md text-white bg-gradient-to-br to-indigo-600 from-indigo-400 hover:from-indigo-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed  duration-300"
          >
            <CreditCard className="mr-2" size={18} />
            Generar pago
          </button>
        </div>
      </div>
    </div>
  );
};

