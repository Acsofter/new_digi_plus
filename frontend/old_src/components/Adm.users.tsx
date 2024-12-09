import React, { useCallback, useContext, useEffect, useState } from "react";
import { BiBlock, BiEdit, BiPlus, BiTrash } from "react-icons/bi";
import { Contexts } from "../services/Contexts";
import { FormUser } from "./Form.user";
import { useUserServices } from "../services/user.services";
import { Pencil, Search, Shield, Trash2, UserRoundX } from "lucide-react";
import { DatePicker } from "./DatePicker";
export const AdmUsers = () => {
  const { get_users } = useUserServices();
  const { state, dispatch } = useContext(Contexts);
  const [users, setUsers] = useState<User[]>([]);

  const fetchUsers = useCallback(async () => {
    const response = await get_users({ includeAdmins: false });
    if (response) setUsers(response);
  }, [get_users, setUsers]);

  useEffect(() => {
    fetchUsers();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const msg = state.ws.lastMessage;
    if (msg == null) return;

    switch (msg.type) {
      case "user_created":
      case "user_updated":
      case "user_disabled":
      case "user_deleted":
        fetchUsers();
        break;
      default:
        break;
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.ws.lastMessage]);

  return (
    <div className="w-full ">
      <div className="flex justify-between items-center mb-5 ">
        <div className="relative ">
          <div className="absolute inset-y-0 left-0 rtl:inset-r-0 rtl:right-0 flex items-center ps-3 pointer-events-none">
            <Search className="inline-block text-md text-zinc-500 dark:text-white" />
          </div>
          <input
            type="text"
            id="table-search"
            className="block p-2 ps-10 text-sm  text-gray-900 shadow-sm border rounded-lg w-80 bg-white focus:ring-secondary focus:border-primary-blring-secondary   dark:placeholder-gray-400  dark:focus:ring-secondary dark:focus:border-primary-blring-secondary dark:text-white dark:bg-slate-800/60 dark:border-slate-600 dark:focus:outline-slate-500"
            placeholder="Buscar..."
          />
        </div>
        <button
          className="bg-secondary hover:bg-secondary/80 text-white px-5 p-2 rounded-md "
          onClick={() =>
            dispatch({
              type: "SET_POPUP",
              payload: {
                isOpen: true,
                title: "Usuarios",
                subtitle: "Añadir",
                content: <FormUser />,
              },
            })
          }
        >
          <BiPlus className="text-xl inline-block" /> Añadir
        </button>
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
                Usuario
              </th>
              <th scope="col" className="px-6 py-3">
                Nombres
              </th>
              <th scope="col" className="px-6 py-3">
                Apellidos
              </th>
              <th scope="col" className="px-6 py-3">
                Correo
              </th>
              <th scope="col" className="px-6 py-3">
                Estado
              </th>
              {/* <th scope="col" className="px-6 py-3">
                Porcentage <br /> (Comp. / Emp.)
              </th> */}
              {/* <th scope="col" className="px-6 py-3">
                      Fecha
                    </th> */}
              <th scope="col" className="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="">
            {users.map((user, index) => (
              <tr className="bg-[#FEFEFE] dark:bg-slate-800/5 border-b dark:border-white/5 hover:bg-blue-50 hover:dark:bg-slate-800/20 dark:text-white/70 ">
                <td className="w-4 p-4">
                  <div
                    className="flex items-center w-7 h-7 shadow-md border border-zinc-100  rounded-full"
                    style={{
                      backgroundColor: user.color ? user.color : "white",
                    }}
                  >
                    <span className="w-full text-slate-300 text-center font-bold ">
                      {user.username ? user.username[0] : ""}
                    </span>
                  </div>
                </td>

                <th
                  scope="row"
                  className="px-6 py-4 font-semibold text-gray-700 dark:text-white  whitespace-nowrap "
                >
                  {index + 1}
                </th>
                <td className="px-6 py-4 relative">
                  {user.roles?.includes("staff") ? (
                    <Shield className="text-md inline-block text-amber-500 w-4 absolute left-0" />
                  ) : (
                    ""
                  )}
                  {user.username}
                </td>
                <td className="px-6 py-4">{user.first_name}</td>
                <td className="px-6 py-4">{user.last_name}</td>
                <td className="px-6 py-4">{user.email}</td>
                <td className="px-6 py-4">
                  <span
                    className={`${
                      user.is_active
                        ? "bg-blue-100 text-blue-500 dark:bg-blue-600/20  "
                        : "bg-slate-100 text-slate-500  dark:bg-slate-600/20"
                    } px-2 py-1 text-xs rounded-md font-semibold`}
                  >
                    {user.is_active ? "Activo" : "Inactivo"}
                  </span>
                </td>
                {/* <td className="px-6 py-4">{user.created_at}</td> */}
                {/* <td className="px-6 py-4">{user.digitizer_percentage} / {user.user_percentage}</td> */}

                <td className="px-6 py-4">
                  <Pencil
                    className="text-xl inline-block text-secondary cursor-pointer w-4"
                    onClick={() =>
                      dispatch({
                        type: "SET_POPUP",
                        payload: {
                          isOpen: true,
                          title: "Usuarios",
                          subtitle: "Editar",
                          content: user.id && <FormUser user_id={user.id} />,
                        },
                      })
                    }
                  />
                  <UserRoundX className="text-xl inline-block text-slate-500 cursor-pointer ml-2 w-4" />
                  <Trash2 className="text-xl inline-block text-red-500 cursor-pointer ml-2 w-4" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className=" p-4 text-primary/60 dark:text-white/50 text-sm ">
          Mostrando 1 - 10 de 100
        </div>
      </div>
    </div>
  );
};
