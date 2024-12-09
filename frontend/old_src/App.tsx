import React, { useCallback, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import useWebSocket from "react-use-websocket";
import { Administration } from "./pages/Administration";
import { Dashboard } from "./pages/Dashboard";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Settings } from "./pages/Settings";
import { Contexts } from "./services/Contexts";
import { PrivateRouteWrapper } from "./services/PrivateRouteWrapper";
import { useUserServices } from "./services/user.services";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Profile } from "./pages/Profile";
import { Help } from "./pages/Help";
import { General } from "./layouts/General";
import { Modal } from "./components/Modal";
const audio_notification = require("./assets/sound/pop.mp3");

const initialState: State = {
  ws: {
    readyState: 0,
    lastMessage: null,
  },
  company: {} as Company,
  popup: {
    isOpen: false,
    loading: true,
  },
  auth: {
    isAuthenticated: false,
    user: {} as User,
    token: "",
  },
};

const reducer = (state = initialState, action: any) => {
  switch (action.type) {
    case "SET_DATA": {
      return {
        ...state,
        ...action.payload,
      };
    }
    case "SET_POPUP": {
      return {
        ...state,
        popup: { ...state.popup, ...action.payload },
      };
    }
    case "SET_WS": {
      return {
        ...state,
        ws: { ...state.ws, ...(action.payload as WsState) },
      };
    }
    case "SET_COMPANY": {
      return {
        ...state,
        company: action.payload as Company,
      };
    }
    case "SET_AUTH": {
      return {
        ...state,
        auth: action.payload as AuthState,
      };
    }
    default:
      return state;
  }
};

const App: React.FC = () => {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  const [userInteracted, setUserInteracted] = React.useState(false);

  const { get_company_details } = useUserServices();

  const socketUrl: string = `ws://147.93.131.225:8001/ws/company/?token=${localStorage.getItem(
    "user"
  )}`;

  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl, {
    reconnectInterval: 5000,
    shouldReconnect: () => true,
  });

  const notification_sound = () => {
    if (!userInteracted) return;
    const audio = new Audio(audio_notification);
    audio.volume = 0.5;
    audio.play();
  };

  useEffect(() => {
    const handleInteraction = () => setUserInteracted(true);

    window.addEventListener("click", handleInteraction, { once: true });
    window.addEventListener("keydown", handleInteraction, { once: true });

    return () => {
      window.removeEventListener("click", handleInteraction);
      window.removeEventListener("keydown", handleInteraction);
    };
  }, []);

  useEffect(() => {
    const fetchCompany = async () => {
      const response = await get_company_details();
      if (!response) {
        toast.error(
          `Error al cargar la información de la empresa. Ve a ajustes y actualiza la información de la empresa.`
        );
      }
    };

    if (state.company.id === undefined) fetchCompany();
  }, [state.company, get_company_details]);

  useEffect(() => {
    if (lastMessage) {
      const messageData = JSON.parse(lastMessage.data);
      const user = state.auth.user;

      switch (messageData.type) {
        case "user_joined":
          if (user.roles?.includes("staff") && user.username !== messageData.user.username) {
            toast.info(`${messageData.user.username} se ha conectado.`);
          }
          break;

        case "ticket_added":
          if (user.roles.includes("staff")) {
            toast.info(`${messageData.user.username} ha añadido un ticket.`);
          } else if (user.id === messageData.user.id) {
            toast.info(`ticket añadido correctamente.`);
          }
          notification_sound();
          break;

        default:
          break;
      }
      dispatch({
        type: "SET_WS",
        payload: { lastMessage: messageData },
      });
    }
    dispatch({ type: "SET_WS", payload: { readyState } });
  }, [lastMessage, readyState, state.auth.user]);

  const handleSendMessage = useCallback(
    ({
      message,
      type,
      payload = {},
    }: {
      message: string;
      type: string;
      payload?: { [index: string]: any };
    }) => {
      sendMessage(JSON.stringify({ message, type, payload }));
    },
    [sendMessage]
  );
  return (
    <Contexts.Provider
      value={{ state, dispatch, sendMessage: handleSendMessage }}
    >
      <div
        className={`${localStorage.getItem(
          "theme"
        )} flex place-items-center w-screen h-screen relative overflow-hidden dark:bg-[#2b2e58]`}
      >
        <div>
          <div className="w-2/5 h-1/5  blur-3xl bg-amber-300/5 z-0 absolute top-1/2 left-1/2 animate-pulse" />
          <div className="size-96 blur-3xl bg-violet-400/20 z-0 rounded-full absolute top-1/3 animate-pulse" />
          <div className="size-96 blur-3xl bg-blue-400/20 z-0 rounded-full absolute top-1/5 " />
          <div className="size-96 blur-3xl bg-green-400/10 z-0 rounded-full absolute top-2/4 right-20 animate-pulse" />
          <div className="w-1/2 h-2/5 blur-3xl bg-red-400/5 z-0  absolute top-1/5 right-20 animate-pulse" />
          <div className="size-96 blur-3xl bg-pink-500/10 z-0 rounded-full absolute top-1/3 right-20 animate-pulse" />
        </div>
        <General>
          <Modal />
          <ToastContainer
            theme={
              localStorage.getItem("darkMode") === "true" ? "dark" : "light"
            }
          />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="*"
              element={
                <PrivateRouteWrapper>
                  <Home />
                </PrivateRouteWrapper>
              }
            />
            <Route
              path="/"
              element={
                <PrivateRouteWrapper>
                  <Home />
                </PrivateRouteWrapper>
              }
            />

            <Route
              path="/profile"
              element={
                <PrivateRouteWrapper>
                  <Profile />
                </PrivateRouteWrapper>
              }
            />

            <Route
              path="/help"
              element={
                <PrivateRouteWrapper>
                  <Help />
                </PrivateRouteWrapper>
              }
            />

            <Route
              path="/admin"
              element={
                <PrivateRouteWrapper onlyStaff>
                  <Administration />
                </PrivateRouteWrapper>
              }
            />
            <Route
              path="/settings"
              element={
                <PrivateRouteWrapper>
                  <Settings />
                </PrivateRouteWrapper>
              }
            />
            <Route
              path="/dashboard"
              element={
                <PrivateRouteWrapper>
                  <Dashboard />
                </PrivateRouteWrapper>
              }
            />
          </Routes>
          {!userInteracted && (
            <div className="absolute  opacity-40  bottom-0 right-0 px-3">
              <h2>Las funcionalidades de este sitio requieren interactuar</h2>
            </div>
          )}
        </General>
      </div>
    </Contexts.Provider>
  );
};

export default App;
