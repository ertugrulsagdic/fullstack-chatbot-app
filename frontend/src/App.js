import './App.css';
import BoltChatBot from './components/BoltChatBot';
import { useEffect } from 'react';
import { establishWebSocketConnection } from './utils/WebSocketService';

function App() {

  useEffect(() => {
    const socket = establishWebSocketConnection();

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);


  return (
    <div >
        <BoltChatBot />
    </div>
  );
}

export default App;
