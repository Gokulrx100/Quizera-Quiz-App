import React, { createContext, useContext, useRef } from "react";

const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const socketRef = useRef(null);
  const queue = useRef([]);

  if (!socketRef.current) {
    const socket = new WebSocket("ws://localhost:3000/");
    socketRef.current = socket;

    socket.onopen = () => {
      console.log("[Socket] Connected");
      queue.current.forEach((msg) => socket.send(JSON.stringify(msg)));
      queue.current = [];
    };

    socket.onclose = () => console.log("[Socket] Disconnected");
  }

  const safeSend = (msg) => {
    const socket = socketRef.current;
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(msg));
    } else {
      console.log("[Socket] Queued message until open");
      queue.current.push(msg);
    }
  };

  return (
    <SocketContext.Provider value={{ socketRef, safeSend }}>
      {children}
    </SocketContext.Provider>
  );
};
