import React from "react";
import {
  Ban,
  Eye,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { usePayment } from "../contexts/PaymentContext";
import { useUserServices } from "../../services/user.services";

export const PaymentsTable = () => {
  const { payments, getBadge, getStatus } = usePayment();
  const { handlePagination } = useUserServices();

  return (
    <div className="overflow-x-auto shadow-md rounded-lg">
      <table className="w-full text-sm text-left text-gray-600 dark:text-gray-300">
        <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-300">
          <tr>
            {[
              "ID",
              "Amount",
              "Usuario",
              "Status",
              "Descripcion",
              "Fecha",
              "Action",
            ].map((header) => (
              <th key={header} scope="col" className="px-6 py-3">
                <div className="flex items-center justify-between">
                  {header}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {payments &&
            payments.results.map((payment, index) => (
              <tr
                key={payment.id}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap"
                >
                  {index + 1}
                </th>
                <td className="px-6 py-4">{payment.amount}</td>
                <td className="px-6 py-4">
                  {payment.ticket?.collaborator?.username || "N/A"}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getBadge(
                      getStatus(payment.status)
                    )}`}
                  >
                    {payment.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {payment.ticket?.description || "N/A"}
                </td>
                <td className="px-6 py-4">
                  {new Date(payment.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <button
                      className="text-gray-400"
                      onClick={() => {
                        /* Implement view action */
                      }}
                    >
                      <Eye className="size-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      <div>
        {
          <div className=" p-3 text-sm bg-white sticky bottom-0  inline-flex w-full dark:text-white/50 dark:bg-transparent ">
            <span className="    ">
              Mostrando{" "}
              {payments.current &&
                `${
                  payments.current && (payments.current - 1) * 10 + 1
                } - ${Math.min(payments.current * 10, payments.count)} de ${
                  payments.count
                }`}
            </span>

            <div className="inline-flex px-2 ">
              <button
                className="w-5"
                onClick={() => handlePagination(payments.previous)}
              >
                <ChevronLeft size={16} />
              </button>

              <button
                className=" w-5"
                onClick={() => handlePagination(payments.next)}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        }
      </div>
    </div>
  );
};