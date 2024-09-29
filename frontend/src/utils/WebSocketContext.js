import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { io } from 'socket.io-client';

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const wsBaseUrl = process.env.REACT_APP_WS_URL || 'http://localhost:8000';
    let sessionId = localStorage.getItem('sessionId');
    let wsUrl = wsBaseUrl;

    if (sessionId) {
      wsUrl = `${wsBaseUrl}?id=${sessionId}`;
    }

    const newSocket = io(wsUrl);
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('WebSocket connected:', wsUrl);
    });

    newSocket.on('session', (data) => {
      if (data) {
        localStorage.setItem('sessionId', data);
        console.log('SessionId saved to localStorage:', data);
      }
    });

    newSocket.on('disconnect', () => {
      console.log('WebSocket disconnected');
    });

    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, []);

  const updateName = useCallback((name, handleSuccess, handleError) => {
    let sessionId = localStorage.getItem('sessionId');
    if (socket && sessionId && name) {
      socket.emit('updateName', { sessionId, name });
      socket.on('nameUpdated', (response) => {
        if (response.success) {
          if (typeof handleSuccess === 'function') {
            handleSuccess(response.data);
          }
        } else {
          if (typeof handleError === 'function') {
            handleError(response.error);
          }
        }
      });
    }
  }, [socket]);

  return (
    <WebSocketContext.Provider value={{ socket, updateName }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  return useContext(WebSocketContext);
};
