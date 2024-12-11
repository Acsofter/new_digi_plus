import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/index.css";
import App from "./App.tsx";
import { AuthProvider } from "./contexts/AuthContext.tsx";
import { WebsocketProvider } from "./contexts/WebsocketContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <WebsocketProvider>
        <App />
      </WebsocketProvider>
    </AuthProvider>
  </StrictMode>
);
