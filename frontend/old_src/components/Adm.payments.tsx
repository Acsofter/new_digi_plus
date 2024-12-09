import axios from "axios";
import { Ban, CircleCheck, CircleX, Eye, UserRoundPlus } from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";
import { AuthHeader } from "../services/auth.header";
import { Contexts } from "../services/Contexts";
import { useUserServices } from "../services/user.services";
import { DatePicker } from "./DatePicker";
import { FormPayment } from "./Form.payment";

export const AdmPayments = () => {
  const {
    get_payments,
    get_users,
    get_week_number,
    get_report,
    generate_payment_forUser,
    generate_payment_forAll,
    get_week,
  } = useUserServices();
  const { state, dispatch } = useContext(Contexts);
  const [users, setUsers] = useState<User[]>([]);
  const [currentWeek, setCurrentWeek] = useState({ is_paid: false });
  const [filters, setFilters] = useState<{
    collaborator: number | null;
    week: number;
  }>({
    collaborator: null,
    week: get_week_number(new Date()),
  });

  const [payments, setPayments] = useState<ResponsePayments>({
    count: 0,
    pages: 0,
    next: null,
    current: null,
    previous: null,
    results: [],
  });

  const get_badge = (status: string) => {
    switch (status) {
      case "3":
        return (
          <span className=" bg-red-100 text-red-500  px-2 py-1 text-xs rounded-md font-semibold dark:bg-red-600/20">
            Rechazado
          </span>
        );
      case "2":
        return (
          <span className=" bg-green-100 text-green-500  px-2 py-1 text-xs rounded-md font-semibold dark:bg-green-600/20">
            Aceptado
          </span>
        );

      default:
        return (
          <span className=" bg-amber-100 text-amber-500  px-2 py-1 text-xs rounded-md font-semibold dark:bg-amber-600/20">
            Pendiente
          </span>
        );
    }
  };

  const handlerPagination = React.useCallback(async (url: string | null) => {
    if (!url) return;
    try {
      const response = await axios.get<ResponsePayments>(url, {
        headers: AuthHeader(),
      });
      setPayments(response.data);
    } catch (error) {
      console.error(`Error fetching tickets: ${error}`);
    }
  }, []);

  const fetchPayments = async () => {
    const response = await get_payments({ filters });
    if (response) setPayments(response);
  };

  const fetchUsers = async () => {
    const response = await get_users({ includeAdmins: false });
    if (response) setUsers(response);
  };

  const export_payments = async () => {
    const collaborators_for_get_report = filters.collaborator
      ? [{ id: filters.collaborator }]
      : users;

    collaborators_for_get_report.forEach(async (user) => {
      const response = await get_report({ user: user.id });

      if (response) {
        const blob = new Blob([response], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);
        window.open(url);
      }
    });
  };

  const get_current_week = async () => {
    const response = await get_week({ week: filters.week });
    if (response) {
      setCurrentWeek(response);
    } else {
      setCurrentWeek({ ...currentWeek, is_paid: false });
    }
  };

  useEffect(() => {
    fetchPayments();
    fetchUsers();
    get_current_week();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  useEffect(() => {
    const lastMessage = state.ws.lastMessage;
    if (!lastMessage) return;
    switch (lastMessage.type) {
      case "user_added":
      case "user_updated":
        fetchUsers();
        break;
      case "payment_added":
      case "payment_updated":
      case "payment_for_all":
      case "payment_for_user":
      case "ticket_added":
      case "ticket_updated":
        fetchPayments();
        get_current_week();
        break;
      default:
        break;
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.ws.lastMessage]);

  const handle_date_change = (startDate: Date, endDate: Date) => {
    const week = get_week_number(startDate);
    setFilters({ ...filters, week });
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-5 max-h-28">
        <div className="flex flex-wrap gap-3 min-h-1/2">
          <div className="dark:bg-slate-800  rounded-lg border dark:border-slate-700 border-slate-400 text-sm inline-flex place-content-center justify-center">
            <label htmlFor="toggleUsers" className="p-1">
              <UserRoundPlus className="inline" size={20} />
            </label>
            <select
              className="dark:bg-slate-800 h-full min-h-9 min-w-24 outline-none rounded-lg"
              name="users"
              id="toggleUsers"
              onChange={(e) => {
                setFilters({
                  ...filters,
                  collaborator:
                    e.target.value === "all"
                      ? null
                      : users[parseInt(e.target.value)].id,
                });
              }}
            >
              <option value="all">Todos</option>
              {users.length > 0 &&
                users.map((user, index) => (
                  <option key={index} value={index} className="capitalize">
                    {user.username}
                  </option>
                ))}
            </select>
          </div>

          <DatePicker onChange={handle_date_change} />

          <span
            className={` h-full py-1 px-5 text-white rounded-full  text-sm ${
              currentWeek.is_paid ? "bg-green-500" : "bg-red-500"
            }`}
          >
            {currentWeek.is_paid ? (
              <>
                <CircleCheck className="inline" size={16} /> <span> Paid</span>
              </>
            ) : (
              <>
                <CircleX className="inline" size={16} /> <span> Not paid</span>
              </>
            )}
          </span>
        </div>

        <div className="flex flex-wrap gap-3 min-h-1/2">
          <button
            className=" bg-blue-600 border border-blue-600 shadow-sm hover:inset-1 text-white px-5 p-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!currentWeek.is_paid}
            onClick={export_payments}
          >
            Exportar
          </button>
          <button
            disabled={currentWeek.is_paid || payments.count === 0}
            className="bg-violet-500 min-h-11 shadow-sm shadow-violet-700 text-white px-3 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={(e) => {
              filters.collaborator
                ? generate_payment_forUser({
                    collaborator: filters.collaborator,
                    week: filters.week,
                  })
                : generate_payment_forAll({ week: filters.week });
            }}
          >
            Generar pagos
          </button>
        </div>
      </div>
      <div className="border rounded-xl shadow-sm bg-white/5 dark:border-none overflow-scroll no-scrollbar">
        <table className="w-full text-sm text-left rtl:text-right text-gray-600 border-collapse">
          <thead className="text-xs text-gray-700 uppercase bg-zinc-50 dark:bg-transparent sticky top-0 w-full dark:text-white">
            <tr>
              <th scope="col" className="p-4 "></th>
              <th scope="col" className="px-6 py-3">
                ID
              </th>
              <th scope="col" className="px-6 py-3">
                Amount
              </th>
              <th scope="col" className="px-6 py-3">
                Usuario
              </th>
              <th scope="col" className="px-6 py-3">
                Status
              </th>
              <th scope="col" className="px-6 py-3">
                Descripcion
              </th>
              <th scope="col" className="px-6 py-3">
                Fecha
              </th>

              <th scope="col" className="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="">
            {payments &&
              payments.results.map((payment, index) => (
                <tr className="bg-[#FEFEFE] dark:bg-slate-800/5 border-b dark:border-white/5 hover:bg-blue-50 hover:dark:bg-slate-800/20 dark:text-white/70 ">
                  <td className="w-4 p-4"></td>

                  <th
                    scope="row"
                    className="px-6 py-4 font-semibold text-gray-700 dark:text-white  whitespace-nowrap "
                  >
                    {index + 1}
                  </th>
                  <td className="px-6 py-4">{payment.amount}</td>
                  <td className="px-6 py-4">
                    {payment.ticket?.collaborator &&
                      payment.ticket.collaborator.username}
                  </td>
                  <td className="px-6 py-4">{get_badge(payment.status)}</td>
                  <td className="px-6 py-4">{payment.ticket?.description}</td>

                  <td className="px-6 py-4">
                    {new Date(payment.created_at).toLocaleDateString()}
                  </td>

                  <td className="px-6 py-4">
                    <Eye
                      className="text-xl inline-block text-secondary cursor-pointer w-4"
                      onClick={() =>
                        dispatch({
                          type: "SET_POPUP",
                          payload: {
                            isOpen: true,
                            title: "Pagos",
                            subtitle: "Editar",
                            content: <FormPayment payment_id={payment.id} />,
                          },
                        })
                      }
                    />
                    <Ban className="text-xl inline-block text- cursor-pointer ml-2 w-4" />
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        {
          <div className=" p-3 text-primary/60 text-sm bg-white sticky bottom-0  inline-flex w-full dark:text-white/50 dark:bg-transparent ">
            <span className="   rounded-l-md  ">
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
                className="text-primary/60 hover:text-primary/80 w-5"
                onClick={() => handlerPagination(payments.previous)}
              >
                <GrFormPrevious size={16} />
              </button>

              <button
                className=" text-primary/60 hover:text-primary/80  w-5"
                onClick={() => handlerPagination(payments.next)}
              >
                <GrFormNext size={16} />
              </button>
            </div>
          </div>
        }
      </div>
    </div>
  );
};
