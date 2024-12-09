import React, { useEffect } from "react";
import { useUserServices } from "../services/user.services";
import { CircleAlert, CircleCheckBig, CircleHelp } from "lucide-react";

export const FormPayment = ({ payment_id }: { payment_id?: number }) => {
  const { get_payments_by_id } = useUserServices();
  const [form, setForm] = React.useState<Payment>({
    id: 0,
    status: "",
    type: "",
    amount: "0",
    week: 0,
    ticket: {} as Ticket,
    created_at: "",
    updated_at: "",
    collaborator: 0,
  });

  useEffect(() => {
    const fetchTicket = async () => {
      if (!payment_id) return;
      const response = await get_payments_by_id(payment_id);
      if (response) setForm(response);
    };

    fetchTicket();
  }, [payment_id]);

  return (
    <form
      className="w-[700px] flex flex-col gap-5 text-base dark:text-white text-sm"
      onSubmit={(e) => e.preventDefault()}
    >
      <div className="grid grid-cols-2 gap-4">
        <label className=" pb-1">Total $</label>
        <input
          autoFocus={true}
          value={form.amount}
          className=" px-2  py-5 h-5 border rounded-3xl outline-none focus:ring-1 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700 peer transition-all duration-200"
          type="number"
          name="quantity"
          id="quantity"
          disabled
        />

        {/* <div className="flex flex-col">
          <label className=" text-primary pb-1">Categoria</label>
          <select
            value={form.ticket.category?.id || "default"}
            onChange={(e) =>
              setForm({
                ...form,
                ticket: {
                  ...form.ticket,
                  category:
                    categories.find(
                      (item) => item.id === parseInt(e.target.value)
                    ) || ({} as Category),
                },
              })
            }
            className="w-full px-2  text-primary h-full border rounded-md focus:outline-none focus:ring-1 focus:ring-slate-200 peer transition-all duration-200"
            name="category"
            id=""
          >
            <option value="default">Otros</option>
            {categories.map((item) => (
              <option value={item.id} key={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </div> */}

        <label className="  pb-1">Comentario</label>
        <textarea
          value={form.ticket.description}
          className="no-scrollbar w-full px-2  py-3 min-h-20 border rounded-3xl focus:outline-none focus:ring-1 focus:ring-blue-500 peer  duration-300 max-h-72 dark:bg-slate-800 dark:border-slate-700  "
          name="comment"
          id="comment"
          disabled
        />

        {payment_id && (
          <>
            <label className=" pb-1">Estado</label>
            <div className="flex items-center">
              {form.status === "2" ? (
                <CircleCheckBig className="w-4 h-4 text-green-500" />
              ) : form.status === "3" ? (
                <CircleAlert className="w-4 h-4 text-red-500" />
              ) : (
                <CircleHelp className="w-4 h-4" />
              )}
            </div>
          </>
        )}

        {payment_id && (
          <>
            <label className="">Creado por</label>
            <div>
              <span>{form.ticket?.collaborator?.username}</span> (
              <span className="">{form.ticket?.collaborator?.email}</span>)
            </div>
            <label className="pb-1">Fecha</label>
            <span>{new Date(form.created_at).toDateString()}</span>
          </>
        )}
      </div>
      <button className="border border-white hover:bg-white/5 text-white px-5 p-2 rounded-full duration-200 ">
        Cerrar
      </button>
    </form>
  );
};
