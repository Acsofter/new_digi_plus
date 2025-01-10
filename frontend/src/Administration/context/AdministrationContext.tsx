import {
  createContext,
  ReactNode,
  useContext,
  useState,
} from "react";

export const AdministrationContext = createContext<any | null>(null);

export const AdministrationProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const contextValue = {
    title: "Administration",
    loading,
    error,
    setLoading,
    setError,

  };

  return (
    <AdministrationContext.Provider
      value={{
        ...contextValue,
      }}
    >
      {children}
    </AdministrationContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAdministration = () => {
  const context = useContext(AdministrationContext);
  if (!context) {
    throw new Error(
      "useAdministration must be used within an AdministrationProvider"
    );
  }
  return context;
};
