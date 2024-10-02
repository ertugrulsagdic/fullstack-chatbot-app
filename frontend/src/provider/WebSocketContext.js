import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { io } from "socket.io-client";

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!socket) {
      connectSocket();
    } else {
      socket.connect();
    }
  }, []);

  const connectSocket = useCallback(() => {

    const wsBaseUrl = process.env.REACT_APP_WS_URL || "http://localhost:8000";
    let sessionId = localStorage.getItem("sessionId");
    let wsUrl = wsBaseUrl;

    if (sessionId) {
      wsUrl = `${wsBaseUrl}?id=${sessionId}`;
    }

    const newSocket = io(wsUrl);
      setSocket(newSocket);

      newSocket.on("connect", () => {
      });

      newSocket.on("session", (data) => {
        if (data) {
          localStorage.setItem("sessionId", data);
        }
      });

      newSocket.on("disconnect", () => {
      });

      return () => {
        if (newSocket) {
          newSocket.disconnect();
        }
      };
  }, []);
    

  const updateName = useCallback(
    (name, handleSuccess, handleError) => {
      let sessionId = localStorage.getItem("sessionId");

      if (socket && sessionId && name) {

        socket.emit("updateName", { sessionId, name }, (response) => {
          if (response.success) {
            handleSuccess(response.data);
          } else {
            console.error("Name update error:", response.data);
            handleError(response.data);
          }
        });
      }
      return () => {
        if (socket) {
          socket.off("nameUpdate");
        }
      };
    },
    [socket]
  );

  const handleUserSession = useCallback(
    (handleSuccess, handleError) => {
      if (socket) {
        socket.on("sessionData", (response) => {
          if (response.success) {
            handleSuccess(response.data);
          } else {
            console.error("User session error:", response.data);
            handleError(response.data);
          }
        });
      }
      return () => {
        if (socket) {
          socket.off("sessionData");
        }
      };
    },
    [socket]
  );

  const handleNextQestion = useCallback(
    (handleSuccess, handleError) => {
      if (socket) {
        socket.on("nextQuestion", (response) => {
          if (response.success) {
            handleSuccess(response.data);
          } else {
            console.error("Next question error:", response.data);
            handleError(response.data);
          }
        });
      }
      return () => {
        if (socket) {
          socket.off("nextQuestion");
        }
      };
    },
    [socket]
  );

  const handleAnswer = useCallback(
    (answer, handleSuccess, handleError) => {
      let sessionId = localStorage.getItem("sessionId");
      socket.emit("sendAnswer", { sessionId, answer }, (response) => {
        if (response.success) {
          handleSuccess(response.data);
        } else {
          console.error("Answer error:", response.data);
          handleError(response.data);
        }
      });
    },
    [socket]
  );

  const handleSessionEnd = useCallback(
    (handleSuccess, handleError) => {
      if (socket) {
        socket.on("sessionEnd", (response) => {
          if (response.success) {
            handleSuccess(response.data);
          } else {
            console.error("Session end error:", response.data);
            handleError(response.data);
          }
        });
      }
    },
    [socket]
  );

  return (
    <WebSocketContext.Provider
      value={{
        connectSocket,
        updateName,
        handleUserSession,
        handleNextQestion,
        handleAnswer,
        handleSessionEnd,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  return useContext(WebSocketContext);
};
