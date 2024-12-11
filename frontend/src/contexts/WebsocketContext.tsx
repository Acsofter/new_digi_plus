import React, { createContext, useContext, useEffect, useState } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { getAuthToken } from "../services/auth.header";
import { useAuthentication } from "./AuthContext";
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

  const {authenticated} = useAuthentication()

  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl, {
    reconnectInterval: 5000,
    shouldReconnect: () => true,
  }, authenticated);

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

  useEffect(() => {
    setWsState({ readyState, lastMessage });
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
