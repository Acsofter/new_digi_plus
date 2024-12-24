"use client";

import { useAuthentication } from "../../contexts/AuthContext";
import { X } from "lucide-react";
import { useHome } from "../contexts/HomeContext";
import { motion, AnimatePresence } from "framer-motion";
import { useMemo, useCallback } from "react";

export const TicketPayment = () => {
  const {
    categories,
    addTicketModal,
    form,
    handleChanges,
    closeAddTicketModal,
    handleSubmit,
    quickAmounts,
    currentWeek,
  } = useHome();

  const { user, company } = useAuthentication();
  const isPaid = currentWeek.is_paid;
  const collaboratorDiscount = company?.collaborator_percentage || 0;

  const subtotal = form.payment.amount;
  const discount = subtotal * ((100 - collaboratorDiscount) / 100);
  const total = subtotal - discount;

  const handleCategoryChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) =>
      handleChanges({ changes: { category: Number(e.target.value) } }),
    [handleChanges]
  );

  const handleAmountChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) =>
      handleChanges({
        changes: {
          payment: {
            ...form.payment,
            amount: Number(e.target.value),
          },
        },
      }),
    [handleChanges, form.payment]
  );

  const handleQuickAmountClick = useCallback(
    (amount: number) =>
      handleChanges({ changes: { payment: { ...form.payment, amount } } }),
    [handleChanges, form.payment]
  );

  const memoizedContent = useMemo(() => {
    return (
      <div className="p-4">
        <div className="mb-5">
          <label
            htmlFor="ticket-type"
            className="block text-sm text-gray-600 mb-2"
          >
            Tipo de Ticket 🎟️
          </label>
          <select
            id="ticket-type"
            key={form.category}
            value={form.category || ""}
            onChange={handleCategoryChange}
            className={`w-full p-3 border rounded-lg bg-white ${
              isPaid ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isPaid}
          >
            <option value="" disabled>
              Seleccionar tipo de ticket 🆕
            </option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="w-full mb-4">
          <div className="flex flex-col gap-2">
            <input
              id="cash-input"
              type="number"
              value={form.payment.amount}
              onChange={handleAmountChange}
              className={`w-full p-3 border rounded-lg text-lg bg-white ${
                isPaid ? "opacity-50 cursor-not-allowed" : ""
              }`}
              placeholder="Enter amount"
              disabled={isPaid}
            />
            <div className="grid grid-cols-4 gap-2 mb-4">
              {quickAmounts.map((amount) => (
                <button
                  key={amount}
                  onClick={() => handleQuickAmountClick(amount)}
                  className="p-2 border rounded-lg text-sm hover:bg-gray-50"
                >
                  ${amount}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mb-4">
          <label
            htmlFor="description"
            className="block text-sm text-gray-600 mb-2"
          >
            Descripción
          </label>
          <textarea
            id="description"
            value={form.description}
            onChange={(e) =>
              handleChanges({ changes: { description: e.target.value } })
            }
            placeholder="Ingrese una descripción del ticket"
            className={`w-full p-3 min-h-20 border rounded-lg bg-white ${
              isPaid ? "opacity-50 cursor-not-allowed" : ""
            }`}
            rows={3}
            disabled={isPaid}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="user" className="block text-sm text-gray-600 mb-2">
            Usuario
          </label>
          <div className="w-full flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-2">
              <div
                className="bg-pink-100 p-2 rounded-lg"
                style={{ backgroundColor: user?.color }}
              >
                <div className="w-4 h-4 bg-white rounded-xl" />
              </div>
              <span>{user?.username} 👤</span>
            </div>
          </div>
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex justify-between text-indigo-600">
            <span>
              Subtotal 💵
              <div className="size-3 bg-indigo-100 inline-block rounded-full" />
            </span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Descuento (-{100 - collaboratorDiscount}%)</span>
            <span>- ${discount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold">
            <span>Total 🏷️</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          className={`w-full bg-gradient-to-tr from-indigo-700 to-indigo-500 shadow shadow-indigo-500 border border-indigo-700 text-white rounded-lg p-3 font-medium hover:bg-indigo-700 ${
            isPaid ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={isPaid}
        >
          Añadir ➕
        </button>
      </div>
    );
  }, [
    categories,
    form,
    isPaid,
    subtotal,
    discount,
    total,
    handleCategoryChange,
    handleAmountChange,
    handleQuickAmountClick,
    handleSubmit,
    user,
    collaboratorDiscount,
  ]);

  return (
    <AnimatePresence>
      {addTicketModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-50 flex items-end justify-end"
        >
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 20, stiffness: 250 }}
            className="bg-white text-slate-950 w-full max-w-lg h-full overflow-y-auto shadow-lg no-scrollbar"
          >
            <div className="p-4 flex items-center border-b">
              <h2 className="font-semibold text-xl">Nuevo ticket</h2>
              <button onClick={closeAddTicketModal} className="ml-auto">
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            {memoizedContent}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
