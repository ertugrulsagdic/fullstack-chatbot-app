import { io } from 'socket.io-client';

export const establishWebSocketConnection = () => {
  const wsBaseUrl = process.env.REACT_APP_WS_URL || 'http://localhost:8000';
  let sessionId = localStorage.getItem('sessionId');

  let wsUrl = wsBaseUrl;

  if (sessionId) {
    wsUrl = `${wsBaseUrl}?id=${sessionId}`;
  }

  const socket = io(wsUrl);

  socket.on('connect', () => {
    console.log(wsUrl);
    console.log('Connection established');
  });

  socket.on('session', (data) => {
    console.log('SessionId received:', data);
    if (data) {
      localStorage.setItem('sessionId', data);
      console.log('SessionId saved to localStorage:', data);
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
