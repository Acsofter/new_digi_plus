import React, { createContext, useContext, useEffect, useState } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { getAuthToken } from "../services/auth.header";
import { useAuthentication } from "./AuthContext";
import { toast } from "react-toastify";
import audio_notification from "../assets/sound/pop.mp3";

export const WebsocketContext = createContext<any | null>(null);

export const WebsocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const socketUrl = `${
    import.meta.env.VITE_WS_URL
  }/ws/company/?token=${getAuthToken()}`;
  const [wsState, setWsState] = useState<{
    readyState: number;
    lastMessage: any | null;
  }>({ readyState: 0, lastMessage: null });

  const { authenticated, user } = useAuthentication();

  const { sendMessage, lastMessage, readyState } = useWebSocket(
    socketUrl,
    {
      reconnectInterval: 5000,
      shouldReconnect: () => true,
    },
    authenticated
  );

  const getReadyStateColor = () => {
    const readyStateColors: Record<ReadyState, string> = {
      [ReadyState.CONNECTING]: "#FBBF24",
      [ReadyState.OPEN]: "#34D399",
      [ReadyState.CLOSING]: "#F87171",
      [ReadyState.CLOSED]: "#F87171",
      [ReadyState.UNINSTANTIATED]: "#F87171",
    };
    return readyStateColors[readyState as ReadyState] || "#F87171";
  };

  const handleSendMessage = (message: { [key: string]: string | number }) => {
    sendMessage(JSON.stringify(message));
  };

  const notificationSound = () => {
    if (!user?.username) return;
    const audio = new Audio(audio_notification);
    audio.volume = 0.5;
    audio.play();
  };

  const onHandlerUserJoined = (username: string) => {
    if (user?.username === username) {
      toast.info("Te has unido ");
    } else {
      if (user.roles.includes("user")) return;
      toast.info(`${username} se ha unido `);
    }
    notificationSound();
  };

  const onHandlerUserDisconnected = (username: string) => {
    if (user?.username === username) {
      toast.info("Te has desconectado ");
    } else {
      if (user.roles.includes("user")) return;
      toast.info(`${username} se ha desconectado `);
    }
    notificationSound();
  };

  const onHandlerTicketAdded = (username: string) => {
    if (user.username === username) {
      toast.success("Has agregado un ticket");
    } else {
      if (user.roles.includes("user")) return;
      toast.success(`${username} ha agregado un ticket `);
    }
    notificationSound();
  };

  useEffect(() => {
    setWsState({ readyState, lastMessage });
    const message = lastMessage ? JSON.parse(lastMessage.data) : null;
    if (message) {
      switch (message.type) {
        case "user_joined":
          onHandlerUserJoined(message.user.username);
          break;
        case "user_disconnected":
          onHandlerUserDisconnected(message.user.username);
          break;
        case "ticket_added":
          onHandlerTicketAdded(message.payload.ticket.collaborator.username);
          break;
        case "company_updated":
        case "category_updated":
        case "user_updated":
        case "payment_for_all":
        case "ticket_updated":
        case "ticket_deleted":
          toast.info(message.message);
          break;
        default:
          break;
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [readyState, lastMessage]);

  const contextValue = {
    wsState,
    sendMessage: handleSendMessage,
    getReadyStateColor,
  };

  return (
    <WebsocketContext.Provider value={contextValue}>
      {children}
    </WebsocketContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useWebsockets = () => {
  const context = useContext(WebsocketContext);
  if (!context) {
    throw new Error("useWebSocket must be used within an WebsocketsProvider");
  }
  return context;
};
