import { io } from 'socket.io-client';

export const establishWebSocketConnection = () => {
  const wsBaseUrl = process.env.REACT_APP_WS_URL || 'http://localhost:8000';
  let sessionId = localStorage.getItem('sessionId');

  const options = sessionId ? { query: { id: sessionId } } : {};

  const socket = io(wsBaseUrl, options);

  socket.on('connect', () => {
    console.log('Connection established');
  });

  socket.on('session', (data) => {

    if (!sessionId && data.sessionId) {
      localStorage.setItem('sessionId', data.sessionId);
    }
  });

  socket.on('error', (error) => {
    console.error('Socket error:', error);
  });

  socket.on('disconnect', () => {
    console.log('Connection disconnected');
  });

  return socket;
};
