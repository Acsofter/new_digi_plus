'use client'

import { format } from "date-fns";
import { CheckCircle, Clock, FileDown, XCircle } from 'lucide-react';
import React, { useMemo, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { useAuthentication } from "../../contexts/AuthContext";
import { usePayment } from "../contexts/PaymentContext";

export const PaymentsReport: React.FC = () => {
  const { payments, currentWeek, getWeekDates, users } = usePayment();
  const { company } = useAuthentication();
  const contentRef = useRef(null);

  const handlePrint = useReactToPrint({
    contentRef
  });

  const { totalPending, totalRejected, subtotal, remaining, total } = useMemo(() => {
    const totalPending = (payments ?.results as Payment[]).filter(p => p.status === "1").reduce((sum, p) => sum + p.amount, 0) || 0;
    const totalRejected = (payments ?.results as Payment[]).filter(p => p.status === "2").reduce((sum, p) => sum + p.amount, 0) || 0;
    const totalApproved = (payments ?.results as Payment[]).filter(p => p.status === "3").reduce((sum, p) => sum + p.amount, 0) || 0;
    const subtotal = totalApproved;
    const companyPercentage = company ? 100 - company.collaborator_percentage : 0;
    const remaining = company ? subtotal * (companyPercentage * 0.01) : 0;
    const total = subtotal - remaining;
    return { totalPending, totalRejected, totalApproved, subtotal, remaining, total };
  }, [payments, company]);

  const datesWeek = getWeekDates(new Date());

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "1":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-500"><Clock className="w-3 h-3 mr-1" />Pendiente</span>;
      case "2":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-100 text-rose-500"><XCircle className="w-3 h-3 mr-1" />Rechazado</span>;
      case "3":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-500"><CheckCircle className="w-3 h-3 mr-1" />Aprobado</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500">Desconocido</span>;
    }
  };

  return (
    <div className="max-w-6xl mx-auto ">
      <button
        onClick={handlePrint as any}
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <FileDown className="mr-2" size={18} /> Exportar
      </button>
     <div className="hidden">
       <div ref={contentRef} className="space-y-6 p-4 ">
        <div className="bg-white rounded-lg p-6 ">
          <h1 className="text-3xl font-bold text-center text-gray-900">Informe de Pagos</h1>
          <p className="text-center text-gray-600 mt-2">
            Semana {currentWeek?.week_number} ({datesWeek[0].toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" })} - {datesWeek[1].toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" })})
          </p>
        </div>

        <div className="bg-white  rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Colaboradores</h2>
          <p className="text-gray-700">{(users as User[]).map(user => user.username).join(", ")}</p>
        </div>

        <div className="bg-white  rounded-lg overflow-hidden">
          <h2 className="text-xl font-semibold p-6 bg-gray-50 text-gray-900">Detalle</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuario</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoría</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monto</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {payments.results.map((payment: Payment) => (
                  <tr key={payment.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{payment.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{payment.ticket.collaborator.username}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{payment.ticket.description || "N/A"}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{payment.ticket.category.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{format(new Date(payment.created_at), "yyyy-MM-dd")}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getStatusBadge(payment.status)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${payment.amount.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white  rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Resumen</h2>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-indigo-100 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-indigo-800">Total Pendiente</p>
                  <p className="text-2xl font-bold text-indigo-400">${totalPending.toFixed(2)}</p>
                </div>
                <Clock className="w-8 h-8 text-indigo-500" />
              </div>
            </div>
            <div className="bg-rose-100 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-rose-800">Total Rechazado</p>
                  <p className="text-2xl font-bold text-rose-400">${totalRejected.toFixed(2)}</p>
                </div>
                <XCircle className="w-8 h-8 text-rose-500" />
              </div>
            </div>
            <div className="bg-teal-100 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-teal-800">Subtotal (Aprobado)</p>
                  <p className="text-2xl font-bold text-teal-400">${subtotal.toFixed(2)}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-teal-500" />
              </div>
            </div>
          </div>
          <div className="bg-blue-100 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm text-blue-800">Restante ({company?.collaborator_percentage}%)</p>
              <p className="text-lg font-semibold text-blue-900">- ${remaining.toFixed(2)}</p>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-lg font-bold text-blue-400">Total</p>
              <p className="text-3xl font-bold text-blue-400">${total.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <p className="text-center text-sm text-gray-500">
          Generado el {format(new Date(), "MMMM d, yyyy HH:mm:ss")}
        </p>
      </div>
     </div>
    </div>
  );
};

