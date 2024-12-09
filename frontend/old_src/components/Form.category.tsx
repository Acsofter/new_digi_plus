import React, { useContext, useEffect, useState } from "react";
import { Contexts } from "../services/Contexts";
import { useUserServices } from "../services/user.services";

export const FormCategory = ({ category_id }: { category_id?: number }) => {
  const { get_category_by_id, update_category, create_category } =
    useUserServices();
  const { dispatch } = useContext(Contexts);

  const [form, setForm] = useState<Category>({
    id: 0,
    name: "",
    description: "",
    created_at: "",
    updated_at: "",
  });

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    let response = category_id
      ? await update_category({ id: form.id, data: form })
      : await create_category(form);

    if (response) {
      setForm(response);
      dispatch({ type: "SET_POPUP", payload: { isOpen: false } });
    }
  };

  useEffect(() => {
    if (!category_id) return;
    const fetchCategory = async () => {
      const response = await get_category_by_id({ id: category_id });
      if (response) setForm(response);
    };

    fetchCategory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <form
      className="w-[700px] h-full flex flex-col gap-5 py-3 text-base dark:text-white"
      onSubmit={handleSubmit}
    >
      <div className="grid grid-cols-4 gap-2">
        <label className="text-sm font-bold col-span-1">Nombre</label>
        <input
          value={form.name}
          className="w-full px-2 text-sm py-5 h-5 border rounded-3xl outline-none focus:ring-1 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700 peer transition-all duration-200 col-span-3"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          type="text"
          name="name"
          id="name"
        />

        <label className="text-sm font-bold col-span-1">Descripción</label>
        <textarea
          value={form.description}
          className="w-full px-2 text-sm py-5 h-20 border rounded-3xl outline-none focus:ring-1 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700 peer transition-all duration-200 col-span-3"
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          name="description"
          id="description"
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button className="w-full rounded-3xl py-2 border border-slate-300 text-slate-400">
          Cancelar
        </button>
        <button
          type="submit"
          className="w-full bg-primary text-white rounded-3xl py-2"
        >
          {category_id ? "Actualizar" : "Registrar"}
        </button>
      </div>
    </form>
  );
};
