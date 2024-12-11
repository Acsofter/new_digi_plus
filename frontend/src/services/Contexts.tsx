import { createContext } from "react";

export const Contexts = createContext({
  sendMessage: (args: any) => {},
  state: {} as State,
  dispatch: (args: any) => {},
});
