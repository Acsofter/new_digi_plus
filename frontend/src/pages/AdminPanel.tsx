import React from "react";
import { CustomTabs } from "../Administration/components/AdminTabs";
import { CategoriesSection } from "../Administration/components/CategoriesSection";
import { UsersSection } from "../Administration/components/UsersSection";
import { AdministrationProvider } from "../Administration/context/AdministrationContext";

export const AdminPanel: React.FC = () => {
  const tabsData = [
    {
      id: "tab1",
      label: "Usuarios",
      content: <UsersSection />,
    },
    {
      id: "tab2",
      label: "Categorias",
      content: <CategoriesSection />,
    },
  ];

  return (
    <AdministrationProvider>
      <div className="h-full bg-gray-50 px-20 py-5">
        <CustomTabs tabs={tabsData} defaultTab="tab1" />
      </div>
    </AdministrationProvider>
  );
};
