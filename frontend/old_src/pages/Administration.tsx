import React from "react";
import { AdmPayments } from "../components/Adm.payments";
import { AdmUsers } from "../components/Adm.users";
import { Modal } from "../components/Modal";
import { AdmCategories } from "../components/Adm.categories";

export const Administration = () => {
  const [activeTab, setActiveTab] = React.useState(0);
  const tabs = [
    { name: "Usuarios", content: <AdmUsers /> },
    { name: "Pagos", content: <AdmPayments /> },
    { name: "Categorias", content: <AdmCategories /> },
  ];

  return (
    <>
      {/* <Modal /> */}
      <div className="relative h-full dark:text-white flex flex-col">
        <div className="flex flex-col w-full h-full p-5">
          <h2 className="font-semibold text-xl">Administracion</h2>
          <hr className="my-4" />

          <div className="mb-2 inline-flex gap-3" role="tablist">
            {tabs.map((tab, index) => (
              <div
                key={index}
                onClick={() => setActiveTab(index)}
                className={`inline text-center text-sm px-5 py-1 rounded-xl cursor-pointer duration-200 border ${
                  index === activeTab
                    ? "bg-primary text-white dark:bg-slate-800"
                    : "hover:bg-primary dark:hover:bg-slate-800 hover:text-white border-primary dark:border-slate-700"
                }`}
              >
                {tab.name}
              </div>
            ))}
          </div>

          <div className="bg-[#FEFEFE]/60 dark:bg-slate-800/30 rounded-xl h-full p-4">
            {tabs[activeTab].content}
          </div>
        </div>
      </div>
    </>
  );
};
