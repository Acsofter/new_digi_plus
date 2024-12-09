import React, { useEffect } from "react";
import { Contexts } from "../services/Contexts";
import { useUserServices } from "../services/user.services";
import {
  CircleAlert,
  CircleCheckBig,
  CircleDot,
  CircleHelp,
} from "lucide-react";

export const FormTicket = ({ ticket_id }: { ticket_id?: number }) => {
  const { create_ticket, get_ticket, update_ticket, get_categories } =
    useUserServices();
  const [categories, setCategories] = React.useState<Category[]>([]);
  const { state, dispatch } = React.useContext(Contexts);
  const [form, setForm] = React.useState<Ticket>({
    id: 0,
    category: {} as Category,
    description: "",
    collaborator: {} as User,
    payment: {} as Payment,
    created_at: "",
    updated_at: "",
    company: 0,
  });

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    let response: Ticket | false;
    if (ticket_id) {
      response = await update_ticket({
        details: {
          id: form.id,
          category: form.category.id,
          payment: {
            amount: parseInt(form.payment.amount),
          },
          description: form.description,
        },
      });

      if (response) {
        setForm(response);
      }
    } else {
      response = await create_ticket({
        category: form.category.id,
        payment: {
          amount: parseInt(form.payment.amount),
        },
        description: form.description,
      });

      if (response)
        setForm({
          id: 0,
          category: {} as Category,
          description: "",
          collaborator: {} as User,
          payment: {} as Payment,
          created_at: "",
          updated_at: "",
          company: 0,
        });
    }
    //  dispatch({ type: "SET_POPUP", payload: { open: false } });
  };

  const get_badge = (status: string) => {
    let color = "";
    let text = "";
    if (status === "1") {
      color =
        "from-amber-500 to-amber-300 border-amber-300 text-white dark:from-amber-300/20 dark:to-amber-300/20 dark:border-amber-300 dark:text-amber-300";
      text = "Pendiente";
    } else if (status === "2") {
      color =
        "from-[#43C6AC] to-green-400 border-[#43C6AC] text-white dark:from-[#43C6AC]/20 dark:to-green-400/20 dark:border-[#43C6AC] dark:text-[#43C6AC]";
      text = "Aprobado";
    } else if (status === "3") {
      color =
        "from-[#FF7E5F] to-red-400 border-[#FF7E5F] text-white dark:from-[#FF7E5F]/20 dark:to-red-400/20 dark:border-[#FF7E5F] dark:text-[#FF7E5F]";
      text = "Rechazado";
    }
    return (
      <div
        className={`peer transition-all col-span-3 duration-200 w-64 h-6 border rounded-3xl inline-flex justify-between items-center py-5 px-3 shadow-md bg-gradient-to-tr hover:brightness-95 ${color}`}
      >
        <div>
          {form.payment.status && form.payment.status === "1" ? (
            <CircleDot
              className={`peer-focus:cursor-pointer w-4 inline-block mr-2 `}
            />
          ) : form.payment.status === "2" ? (
            <CircleCheckBig
              className={`peer-focus:cursor-pointer w-4 inline-block mr-2 `}
            />
          ) : (
            <CircleAlert
              className={`peer-focus:cursor-pointer w-4 inline-block mr-2 `}
            />
          )}
          <span className="text-sm">{text}</span>
        </div>
        <CircleHelp className="w-4 h-4" />
      </div>
    );
  };

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await get_categories();
      if (response) setCategories(response.results);
    };

    const fetchTicket = async () => {
      if (!ticket_id) return;
      const response = await get_ticket({ id: ticket_id });
      if (response) {
        setForm(response);
        dispatch({ type: "SET_POPUP", payload: { loading: false } });
      }
    };

    fetchTicket();
    fetchCategories();

    // TODO: detach
    //  eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ticket_id]);

  return state.popup.loading ? (
    <div className="text-center text-slate-800">
      <div role="status" className="my-3">
        <svg
          aria-hidden="true"
          className="inline w-8 h-8 text-gray-100  animate-spin dark:text-white fill-blue-600"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="currentColor"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="currentFill"
          />
        </svg>

        <span className="sr-only">Loading...</span>
      </div>
    </div>
  ) : (
    <form
      className="w-[700px] flex flex-col gap-5 text-base dark:text-white"
      onSubmit={handleSubmit}
    >
      <div className="grid grid-cols-4 gap-3">
        <label className="text-sm  pb-1">Total $</label>
        <input
          autoFocus={true}
          value={form.payment.amount ?? 0}
          onChange={(e) =>
            e.target.value &&
            setForm({
              ...form,
              payment: {
                ...form.payment,
                amount: e.target.value,
              },
            })
          }
          className="w-full px-2 border outline-none dark:bg-slate-800 dark:border-slate-700 text-sm py-5 h-5 rounded-3xl focus:ring-1 ring-blue-500 peer transition-all duration-200 col-span-3"
          type="number"
          name="quantity"
          id="quantity"
        />

        <label className="text-sm pb-1">Categoria</label>
        <select
          value={form.category.id ?? "default"}
          onChange={(e) =>
            e.target.value !== "default" &&
            setForm({
              ...form,
              category:
                categories[
                  categories.findIndex(
                    (item) => item.id === parseInt(e.target.value)
                  )
                ],
            })
          }
          className="w-1/4 p-2 border dark:bg-slate-800 dark:border-slate-700 text-sm h-full rounded-3xl focus:ring-1 focus:ring-blue-500 peer transition-all duration-200 col-span-3"
          name="category"
          id=""
        >
          <option value="default">Otros</option>
          {categories.map((item, index) => (
            <option value={item.id} key={item.id}>
              {item.name}
            </option>
          ))}
        </select>

        <label className="text-sm pb-1">Comentario</label>
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="no-scrollbar w-full dark:bg-gray-800 px-2 text-sm py-3 min-h-20 border dark:border-slate-700 rounded-3xl outline-none focus:ring-1 focus:ring-blue-500 peer duration-200 max-h-72 col-span-3"
          name="comment"
          id="comment"
        />

        {ticket_id && <label className="text-sm pb-1">Estado</label>}
        {ticket_id && get_badge(form.payment.status)}

        {ticket_id && (
          <>
            <div className="flex flex-col text-sm col-span-2 ">
              <label className="text-sm ">Creador por</label>
              <div className="w-full text-gray-500 dark:text-blue-200">
                <span>{form.collaborator.username}</span> ({" "}
                <span className="font-bold">{form.collaborator.email}</span> )
              </div>
            </div>
            <div className="flex flex-col text-sm place-items-end col-span-2">
              <label className=" text-base pb-1 ">Fecha</label>
              <span className="text-gray-500 dark:text-blue-200">
                {`${new Date(form.updated_at).toLocaleDateString()}, ${new Date(
                  form.updated_at
                ).toLocaleTimeString()}`}
              </span>
            </div>
          </>
        )}
      </div>

      <button className="bg-primary hover:bg-primary/80 text-white px-5 p-2 rounded-3xl ">
        {ticket_id ? "Actualizar" : "Añadir"}
      </button>
    </form>
  );
};
