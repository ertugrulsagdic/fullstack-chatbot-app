import './App.css';
import BoltChatBot from './components/BoltChatBot';
import { WebSocketProvider } from './provider/WebSocketContext';

function App() {


  return (

    <WebSocketProvider>
    <div >
        <BoltChatBot />
    </div>
    </WebSocketProvider>
  );
}

export default App;
