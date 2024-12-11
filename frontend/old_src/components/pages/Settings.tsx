import { motion } from "framer-motion";
import React, { useContext, useEffect, useState } from "react";
import { CiImageOff } from "react-icons/ci";
import { FcAddImage, FcRemoveImage } from "react-icons/fc";
import { Modal } from "../components/Modal";
import { General } from "../layouts/General";
import { Contexts } from "../services/Contexts";
import { useUserServices } from "../services/user.services";
import { useNavigate } from "react-router-dom";

const themes = {
  dark: require("../assets/image/dark-theme.png"),
  light: require("../assets/image/light-theme.png"),
  default: require("../assets/image/default-theme.png"),
};

export const Settings = () => {
  const { get_company_details, update_company } = useUserServices();
  const { state, dispatch } = useContext(Contexts);
  const navigate = useNavigate();

  const [form, setForm] = useState<UpdateCompany>({
    name: "",
    logo: "",
    darkMode: localStorage.getItem("darkMode") || "default",
    address: "",
    phone: "",
    email: "",
    created_at: "",
    updated_at: "",
    color: localStorage.getItem("color") || "#006dfa",
    transparent: localStorage.getItem("transparent") === "true",
    collaborator_percentage: "",
  });

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    localStorage.setItem("darkMode", form.darkMode === "default" ? "" : form.darkMode);
    localStorage.setItem("color", form.color);
    localStorage.setItem("transparent", String(form.transparent));
    navigate(0);

    const response = await update_company(form);
    if (response) {
      dispatch({ type: "SET_COMPANY", payload: response });
    }
  };

  useEffect(() => {
    const fetchCompany = async () => {
      const response = await get_company_details();
      if (response) setForm((prev) => ({ ...prev, ...response }));
      dispatch({ type: "SET_COMPANY", payload: response });
    };
    fetchCompany();
  }, [dispatch]);

  const handleChange = (field: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="relative w-full h-screen overflow-scroll no-scrollbar p-5">
      <Modal />
      <div className="dark:text-white">
        <h2 className="font-semibold text-xl">Ajustes</h2>
        <hr className="my-4 dark:border-white/20" />
        <div className="bg-[#fefefe]/50 dark:bg-white/5 text-sm p-4 rounded-md h-full w-full">
          <div className="w-full grid grid-cols-3 gap-2">
            <div className="inline-block">
              <span className="font-semibold w-full block">Company Logo</span>
              <span>Actualiza el logo de la compañia</span>
            </div>
            <div className="col-span-2">
              {form.logo ? (
                <img src={form.logo} alt="logo de la empresa" />
              ) : (
                <div className="w-32 h-32 bg-[url('./assets/image/placeholder.svg')] bg-no-repeat bg-center inline-block rounded-full" />
              )}
              {form.logo ? (
                <FcRemoveImage
                  className="inline"
                  size={30}
                  onClick={() => handleChange("logo", "")}
                />
              ) : (
                <label htmlFor="logo" className="inline">
                  <input
                    id="logo"
                    type="file"
                    name="logo"
                    className="hidden"
                    alt="logo de la empresa"
                  />
                  <FcAddImage className="inline" size={30} />
                </label>
              )}
            </div>
          </div>

          <hr className="my-2 border-slate-200/5" />
          <div className="w-full grid grid-cols-3">
            <div>
              <span className="font-semibold w-full block">Detalles</span>
              <span>Actualiza las informaciones de la empresa</span>
            </div>
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 gap-2 lg:grid-cols-3 w-full mx-auto col-span-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {(["name", "address", "phone", "collaborator_percentage"] as Partial<keyof UpdateCompany>[]).map((field) => (
                <div key={field}>
                  <label className="font-semibold block mb-0.5">{field.charAt(0).toUpperCase() + field.slice(1)}:</label>
                  <input
                    type="text"
                    name={field}
                    value={form[field] as string}
                    onChange={(e) => handleChange(field, e.target.value)}
                    className="w-full dark:bg-white/5 py-0.5 bg-transparent rounded-sm outline-none ring-none border-b border-slate-200 dark:border-white/10 focus:border-b-2 focus:border-slate-300 duration-300"
                  />
                </div>
              ))}
            </motion.div>
          </div>

          <hr className="my-2 border-slate-200/5" />
          <div className="w-full grid grid-cols-3">
            <div>
              <span className="font-semibold block">Seleccione un color</span>
              <span>Ajusta un color principal para tu aplicación</span>
            </div>
            <div className="col-span-2">
              <div className="inline-flex justify-between h-auto max-h-20 place-items-center gap-2">
                {["secondary", "primary", "slate-400", "green-500", "pink", "primary-pink"].map((color) => (
                  <span key={color} className={`h-7 w-7 bg-${color} rounded-full`}></span>
                ))}
              </div>
              <div className="inline-flex gap-2 place-items-center w-full">
                <span className="text-sm text-slate-600">
                  Color personalizado{" "}
                  <input
                    type="text"
                    className="w-20 shadow-sm border border-slate-100 rounded-md px-2 font-bold"
                    value={form.color}
                    onChange={(e) => handleChange("color", e.target.value)}
                  />
                </span>
                <label htmlFor="color" className="font-semibold rounded-md">
                  <div
                    className="w-7 h-7 rounded-full cursor-pointer outline-none"
                    style={{ backgroundColor: form.color }}
                  ></div>
                </label>
                <input
                  type="color"
                  id="color"
                  className="invisible"
                  onChange={(e) => handleChange("color", e.target.value)}
                />
              </div>
            </div>
          </div>

          <hr className="my-2 border-slate-200/5" />
          <div className="w-full grid grid-cols-3">
            <div className="inline-block">
              <span className="font-semibold w-full block">Seleccione un tema</span>
              <span>Puedes elegir una tema para tu aplicacion</span>
            </div>
            <div className="flex flex-wrap col-span-2 gap-2">
              {Object.entries(themes).map(([key, src]) => (
                <div
                  key={key}
                  className={`py-4 px-7 border ${form.darkMode === key ? "border-secondary dark:border-white/50" : "border-slate-200 dark:border-white/10"} rounded-md max-w-60 cursor-pointer hover:border-secondary dark:hover:border-white/50 duration-300`}
                  onClick={() => handleChange("darkMode", key)}
                >
                  <img src={src} alt="" className="h-32" />
                  <p className="font-semibold py-1">{`Tema ${key}`}</p>
                  <span>{`Este es el tema ${key === "default" ? "que se aplica dependiendo de tu sistema operativo." : key === "false" ? "El tema original para tu aplicacion." : "que puedes personalizar a tu antojo."}`}</span>
                </div>
              ))}
            </div>
          </div>

          <hr className="my-2 border-slate-200/5" />
          <div className="w-full grid grid-cols-3">
            <div>
              <span className="font-semibold w-full block">Barra de navegacion transparente</span>
              <span>Cambia la barra de navegacion transparente</span>
            </div>
            <div className="col-span-2">
              <label className="flex cursor-pointer select-none place-items-center md:place-content-start place-content-center h-full">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={form.transparent}
                    onChange={() => handleChange("transparent", !form.transparent)}
                    className="sr-only"
                  />
                  <div className={`block h-6 w-10 rounded-full ${form.transparent ? "bg-primary" : "bg-slate-300"}`}></div>
                  <div className={`absolute top-1 h-4 w-4 rounded-full bg-white transition left-1 ${form.transparent && "translate-x-full"}`}></div>
                </div>
              </label>
            </div>
          </div>
          <div className="w-full py-5 inline-flex justify-end gap-2">
            <button
              className="bg-secondary hover:bg-secondary/80 text-white px-5 p-2 rounded-md"
              onClick={handleSubmit}
            >
              Guardar
            </button>
            <button className="border border-slate-500 text-slate-500 px-5 p-2 rounded-md">
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
