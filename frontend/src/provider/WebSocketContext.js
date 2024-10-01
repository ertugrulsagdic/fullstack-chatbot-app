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

      // Set the socket to state
      setSocket(newSocket);

      newSocket.on("connect", () => {
        console.log("WebSocket connected:", wsUrl);
      });

      newSocket.on("session", (data) => {
        if (data) {
          localStorage.setItem("sessionId", data);
          console.log("SessionId saved to localStorage:", data);
        }
      });

      newSocket.on("disconnect", () => {
        console.log("WebSocket disconnected");
      });

      return () => {
        if (newSocket) {
          console.log("Disconnecting WebSocket");
          newSocket.disconnect(); // Properly close the connection
        }
      };
  }, []);
    

  const updateName = useCallback(
    (name, handleSuccess, handleError) => {
      let sessionId = localStorage.getItem("sessionId");
      console.log("Updating name:", name);
      console.log("SessionId:", sessionId);
      console.log("Socket:", socket);

      if (socket && sessionId && name) {
        console.log("Name update emitted");
        // socket.emit('updateName', { sessionId, name });
        socket.emit("updateName", { sessionId, name }, (response) => {
          if (response.success) {
            console.log("Name update success:", response.data);
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
        console.log("User session emitted");
        socket.on("sessionData", (response) => {
          console.log("SessionData:", response);
          if (response.success) {
            console.log("User session success:", response.data);
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
        console.log("Next question emitted");
        socket.on("nextQuestion", (response) => {
          console.log("Next question:", response);
          if (response.success) {
            console.log("Next question success:", response.data);
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
          console.log("Answer success:", response.data);
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
          // console.log("Session end:", response);
          if (response.success) {
            console.log("Session end success:", response.data);
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
