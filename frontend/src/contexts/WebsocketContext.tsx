import { createContext, useContext, useEffect, useState } from 'react';
import useWebSocket from 'react-use-websocket';
import { getAuthToken } from '../services/auth.header';

export const WebscocketContext = createContext<any | null>(null);

export const WebsocketContext = () => {
  const socketUrl = `ws://147.93.131.225:8001/ws/company/?token=${getAuthToken()}`;
  const [wsState, setWsState] = useState<{
    readyState: number;
    lastMessage:  any | null;
  }>({ readyState: 0, lastMessage: null });
  
  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl, {
    reconnectInterval: 5000,
    shouldReconnect: () => true,
  });


  const handleSendMessage = (message: {[key: string]: string | number}) => {
    sendMessage(JSON.stringify(message));
  };

  useEffect(() => {
    setWsState({ readyState, lastMessage });
  }, [readyState, lastMessage]);


  
  

  return {
    wsState,
    sendMessage: handleSendMessage,
  }
}

// eslint-disable-next-line react-refresh/only-export-components
export const useWebsocket = () => {
  const context = useContext(WebscocketContext);
  if (!context) {
    throw new Error("useWebSockets must be used within an WebsocketsProvider");
  }
  return context;
};