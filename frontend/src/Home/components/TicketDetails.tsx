"use client";

import React, { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useHome } from "../contexts/HomeContext";

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const TicketDetails: React.FC = () => {
  const { ticketSelected, onUnselectTicket, getStatus } = useHome();

  const memoizedContent = useMemo(() => {
    if (!ticketSelected) return null;

    const {
      payment,
      category,
      collaborator,
      description,
      created_at,
      updated_at,
    } = ticketSelected;

    return (
      <div className="h-full overflow-y-auto px-6 py-4 space-y-6">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Tipo de Ticket</h3>
          <div className="inline-block px-2 py-1 text-sm font-medium bg-gray-100 rounded-full">
            {category.name}
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Monto</h3>
          <p className="text-2xl font-bold">${payment.amount}</p>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Descripción</h3>
          <p className="text-gray-600">{description || "Sin descripción"}</p>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Usuario</h3>
          <div className="flex items-center space-x-2">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white"
              style={{ backgroundColor: collaborator.color }}
            >
              {collaborator.first_name[0]}
              {collaborator.last_name[0]}
            </div>
            <span>{`${collaborator.first_name} ${collaborator.last_name}`}</span>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Estado del Pago</h3>
          {getStatus(parseInt(payment.status))}
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Tipo de Pago</h3>
          <div className="inline-block px-2 py-1 text-sm font-medium bg-gray-100 rounded-full">
            {payment.type}
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Fecha de Creación</h3>
          <p>{formatDate(created_at)}</p>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Última Actualización</h3>
          <p>{formatDate(updated_at)}</p>
        </div>
      </div>
    );
  }, [ticketSelected]);

  return (
    <AnimatePresence>
      {ticketSelected && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-50 flex justify-end"
          onClick={onUnselectTicket}
        >
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="w-full max-w-md h-full bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-xl font-semibold">
                Detalles del Ticket #{ticketSelected.id}
              </h2>
              <button
                onClick={onUnselectTicket}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Cerrar detalles"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            {memoizedContent}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
