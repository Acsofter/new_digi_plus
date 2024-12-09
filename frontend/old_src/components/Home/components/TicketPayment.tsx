"use client";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { X } from "lucide-react";
import { useHome } from "../hooks/useHome";
import { motion, AnimatePresence } from "framer-motion";
import { useMemo } from "react";

export const TicketPayment = () => {
  const {
    categories,
    showCashModal,
    form,
    handleChanges,
    closeModal,
    handleSubmit,
    quickAmounts,
  } = useHome();
  const { user, company } = useAuth();

  const memoizedContent = useMemo(() => {
    return (
      <div className="p-4">
        <div className="mb-5 ">
          <Label
            htmlFor="ticket-type"
            className="block text-sm text-gray-600 mb-2"
          >
            Tipo de Ticket
          </Label>
          <select
            id="ticket-type"
            key={form.category}
            value={form.category || ""}
            onChange={(e) =>
              handleChanges({
                changes: { category: Number(e.target.value) },
              })
            }
            className="w-full p-3 border rounded-lg bg-white"
          >
            <option value="" disabled>
              Seleccionar tipo de ticket
            </option>
            {categories.map((category: Category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

         <div className=" w-full mb-4 ">
          <div className="flex flex-col gap-2">
            <input
              id="cash-input"
              type="number"
              value={form.payment.amount}
              onChange={(e) =>
                handleChanges({
                  changes: {
                    payment: {
                      ...form.payment,
                      amount: Number(e.target.value),
                    },
                  },
                })
              }
              className="w-full p-3 border rounded-lg text-lg bg-white"
              placeholder="Enter amount"
            />
            <div className="grid grid-cols-4 gap-2 mb-4">
              {quickAmounts.map((amount: number) => (
                <button
                  key={amount}
                  onClick={() =>
                    handleChanges({
                      changes: { payment: { ...form.payment, amount } },
                    })
                  }
                  className="p-2 border rounded-lg text-sm hover:bg-gray-50"
                >
                  ${amount}
                </button>
              ))}
            </div>
          </div>
         
        </div>

        <div className="mb-4">
          <Label
            htmlFor="description"
            className="block text-sm text-gray-600 mb-2"
          >
            Descripción
          </Label>
          <Textarea
            id="description"
            value={form.description}
            onChange={(e) =>
              handleChanges({ changes: { description: e.target.value } })
            }
            placeholder="Ingrese una descripción del ticket"
            className="w-full p-3 border rounded-lg"
            rows={3}
          />
        </div>

        <div className="mb-4">
          <Label className="block text-sm text-gray-600 mb-2">Usuario</Label>
          <div className="w-full flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-2">
              <div
                className="bg-pink-100 p-2 rounded-lg"
                style={{ backgroundColor: user?.color }}
              >
                <div className="w-4 h-4  bg-white rounded-xl" />
              </div>
              <span>{user?.username}</span>
            </div>
          </div>
        </div>

        <div className="space-y-3 mb-4 ">
          <div className="flex justify-between text-indigo-600">
            <span>
              Subtotal{" "}
              <div className="size-3 bg-indigo-100 inline-block rounded-full" />
            </span>

            <span>$ {form.payment.amount}</span>
          </div>
          <div className="flex justify-between">
            <div className="flex items-center gap-1">
              <span>
                Descuento ({100 - (company?.collaborator_percentage || 0)}%)
              </span>
            </div>
            <span>
              -{" "}
              {form.payment.amount * (company?.collaborator_percentage / 100)}
            </span>
          </div>
          <div className="flex justify-between font-bold">
            <span>Total</span>
            <span>
              ${" "}
              {form.payment.amount *
                ((100 - company?.collaborator_percentage) / 100)}
            </span>
          </div>
        </div>

         <button
            onClick={(e) => handleSubmit(e)}
            className="w-full bg-gradient-to-tr from-indigo-700 to-indigo-500 shadow shadow-indigo-500 border border-indigo-700 text-white rounded-lg p-3 font-medium hover:bg-indigo-700"
          >
            Añadir
          </button>
                
       
      </div>
    );
  }, [form, handleChanges]);

  return (
    <AnimatePresence>t
      {showCashModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.1 }}
          className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-50 flex items-end justify-end"
        >
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="bg-white text-slate-950 w-full max-w-lg h-full overflow-y-auto shadow-lg"
          >
            <div className="p-4 flex items-center border-b">
              <div>
                <h2 className="font-semibold text-xl">Nuevo ticket</h2>
              </div>
              <div className="ml-auto flex items-center gap-2">
                <button onClick={closeModal}>
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>
            </div>
            {memoizedContent}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
