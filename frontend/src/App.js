import React, { useState, useRef } from 'react';
import './App.css';
import BoltChatBot from './components/BoltChatBot';
import { WebSocketProvider } from './provider/WebSocketContext';
import { RobotIcon } from './assets/icons/RobotIcon';

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const chatBotRef = useRef(null);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleStartChatting = () => {
    if (chatBotRef.current) {
      if (chatBotRef.current.isOpen) {
        chatBotRef.current.focusInput();
      } else {
        chatBotRef.current.openChat();
      }
    }
  };

  const menuItems = [
    { title: 'Overview', link: '#overview' },
    { title: 'Features', link: '#features' },
    { title: 'Pricing', link: '#pricing' },
    { title: 'Support', link: '#support' },
  ];

  return (
    <WebSocketProvider>
      <div className="container">
        <header>
          <a href='/'> <RobotIcon className='logo' /></a>
          <button className="menu-button" onClick={toggleMenu}>Menu</button>
          <nav className="desktop-nav">
            <ul>
              {menuItems.map((item, index) => (
                <li key={index}>
                  <a href={item.link}>{item.title}</a>
                </li>
              ))}
            </ul>
          </nav>
          <button className="cta-button header">Get Started</button>
        </header>

        <nav className={menuOpen ? 'mobile-nav nav-open' : 'mobile-nav nav-closed'}>
          <ul>
            {menuItems.map((item, index) => (
              <li key={index}>
                <a href={item.link} onClick={() => setMenuOpen(false)}>{item.title}</a>
              </li>
            ))} </ul>
        </nav>

        <main>
          <section className="hero">
            <h1>Welcome to the Bolt ChatBot Demo</h1>
            <p>Experience our AI-powered chatbot designed to assist you in real-time. Start chatting now to see how it works!</p>
            <button className="cta-button" onClick={handleStartChatting}>Start Chatting</button>
          </section>
        </main>
        <BoltChatBot ref={chatBotRef} />
      </div>
    </WebSocketProvider>
  );
}

export default App;
