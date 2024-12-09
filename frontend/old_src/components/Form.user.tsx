import React, { useContext, useEffect, useState } from "react";
import { Contexts } from "../services/Contexts";
import { useUserServices } from "../services/user.services";

import { register } from "../services/auth.services";

export const FormUser = ({ user_id }: { user_id?: number }) => {
  const { get_user, update_user, get_random_color } = useUserServices();
  const { state, dispatch } = useContext(Contexts);

  const [form, setForm] = useState<User>({
    id: null,
    first_name: "",
    last_name: "",
    password: "",
    username: "",
    email: "",
    is_active: false,
    is_staff: false,
    color: "",
    roles: [],
    is_superuser: false,
    created_at: "",
    updated_at: "",
  });

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    let response = user_id
      ? await update_user({ user_details: form })
      : await register({ data: { ...form, color: get_random_color() } });

    if (response) {
      setForm(response);
      dispatch({ type: "SET_POPUP", payload: { isOpen: false } });
    }
  };

  useEffect(() => {
    if (!user_id) return;
    const fetchCompany = async () => {
      const response = await get_user({ id: user_id });
      if (response) setForm(response);
    };

    fetchCompany();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <form
      className="w-[700px] h-full flex flex-col gap-5 py-3 text-base dark:text-white"
      onSubmit={handleSubmit}
    >
      <div className="grid grid-cols-4 gap-2 ">
        <label className="text-sm  font-bold col-span-1">
          Nombres
        </label>
        <input
          value={form.first_name}
          className="w-full px-2 text-sm  py-5 h-5 border rounded-3xl outline-none focus:ring-1 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700 peer transition-all duration-200 col-span-3 "
          onChange={(e) => setForm({ ...form, first_name: e.target.value })}
          type="text"
          name="first_name"
          id="first_name"
          disabled={
            user_id &&
            !state.auth.user.roles.includes("superuser") &&
            form.username !== state.auth.user.username
              ? true
              : false
          }
        />

        <label className="text-sm font-bold col-span-1">
          Apellidos
        </label>
        <input
          value={form.last_name}
          className="w-full px-2 text-sm py-5 h-5 border rounded-3xl outline-none focus:ring-1 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700 peer transition-all duration-200 col-span-3 "
          onChange={(e) => setForm({ ...form, last_name: e.target.value })}
          type="text"
          name="last_name"
          id="last_name"
          disabled={
            user_id &&
            !state.auth.user.roles.includes("superuser") &&
            form.username !== state.auth.user.username
              ? true
              : false
          }
        />

        <label className="text-sm font-bold col-span-1">
          Usuario
        </label>
        <input
          value={form.username}
          className="w-full px-2 text-sm py-5 h-5 border rounded-3xl outline-none focus:ring-1 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700 peer transition-all duration-200 col-span-3 "
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          type="text"
          name="username"
          id="username"
          disabled={
            user_id &&
            !state.auth.user.roles.includes("superuser") &&
            form.username !== state.auth.user.username
              ? true
              : false
          }
        />

        <label className="text-sm font-bold col-span-1">Correo</label>
        <input
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          type="email"
          className="w-full px-2 text-sm py-5 h-5 border rounded-3xl outline-none focus:ring-1 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700 peer transition-all duration-200 col-span-3 "
        ></input>

        {!user_id && (
          <>
            <label className="text-sm font-bold col-span-1">
              Contraseña
            </label>
            <input
              value={form.password}
              className="w-full px-2 text-sm py-5 h-5 border rounded-3xl outline-none focus:ring-1 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700 peer transition-all duration-200 col-span-3 "
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              type="password"
              name="password"
              id="password"
            />
          </>
        )}
        <span className=" text-sm font-bold col-span-1">
          Color personalizado
        </span>
        <div className="inline-flex  gap-2 place-items-center w-full col-span-3 ">
          <input
            type="text"
            className=" shadow-sm border dark:bg-slate-800 dark:border-slate-700 outline-none focus:ring-1 focus:border-blue-500 border-slate-50 rounded-md px-2 text-sm"
            value={form.color}
          />
          <label htmlFor="color" className="font-semibold rounded-md">
            <div
              className="w-7 h-7 rounded-full cursor-pointer outline outline-slate-200  "
              style={{ backgroundColor: form.color }}
            ></div>
          </label>
          <input
            type="color"
            name=""
            id="color"
            className="invisible"
            onChange={(e) => setForm({ ...form, color: e.target.value })}
          />
        </div>

        {user_id && (
          <>
            <label className="text-sm font-bold col-span-1">
              {`Rol${form.roles.length > 1 ? "es" : ""}`}
            </label>
            <div>
              {form.roles.map((role, index) => (
                <span
                  key={index}
                  className="text-sm text-slate-500 font-bold col-span-3 bg-slate-200 rounded-3xl px-3 mx-0.5 "
                >
                  {role}
                </span>
              ))}
            </div>
          </>
        )}
      </div>
      <div className="grid grid-cols-2 gap-2">
        <button className="w-full rounded-3xl py-2 border border-slate-300 text-slate-400">
          Cancelar
        </button>
        <button
          type="submit"
          className="w-full bg-primary text-white rounded-3xl py-2"
        >
          {user_id ? "Actualizar" : "Registrar"}
        </button>
      </div>
    </form>
  );
};
