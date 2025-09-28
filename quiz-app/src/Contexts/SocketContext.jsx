import React, { createContext, useContext, useRef } from "react";

const SocketContext = createContext(null);

const useSocket = () => useContext(SocketContext);

const SocketProvider = ({ children }) => {
  const socketRef = useRef(null);

  if (!socketRef.current) {
    const socket = new WebSocket("ws://localhost:3000/");
    socketRef.current = socket;

    socket.onopen = () => {
      console.log("[Socket] Connected");
    };

    socket.onclose = () => {
      console.log("[Socket] Disconnected");
    };

    socket.onerror = (error) => {
      console.error("[Socket] Error:", error);
    };
  }

  const send = (msg) => {
    const socket = socketRef.current;
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(msg));
      return true;
    } else {
      console.warn("[Socket] Cannot send - connection not ready");
      return false;
    }
  };

  return (
    <SocketContext.Provider value={{ socketRef, send }}>
      {children}
    </SocketContext.Provider>
  );
};

export { SocketProvider, useSocket };