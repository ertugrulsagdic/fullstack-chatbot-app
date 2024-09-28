import React, { useState, useRef, useEffect } from 'react';
import './BoltChatBot.css';

const BoltChatBot = () => {
    const [isOpen, setIsOpen] = useState(true);
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const [userName, setUserName] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const chatContainerRef = useRef(null);
    const triggerButtonRef = useRef(null);
  
    useEffect(() => {
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      }
    }, [messages]);
  
    useEffect(() => {
      if (messages.length === 0) {
        addBotMessage("Hi there! I'm Bolt. What's your name?");
      }
    }, [messages]);
  
    useEffect(() => {
      if (!isOpen) {
        const button = triggerButtonRef.current;
        let angle = 0;
        const radius = 20; 
        const centerX = window.innerWidth - 80;
        const centerY = window.innerHeight - 80;
  
        const animate = () => {
            angle += 0.01;
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(2 * angle);
            button.style.right = `${window.innerWidth - x}px`;
            button.style.bottom = `${window.innerHeight - y}px`;
            requestAnimationFrame(animate);
        };
  
        animate();
      }
    }, [isOpen]);
  
    const addBotMessage = (text) => {
      setIsTyping(true);
      let i = 0;
      const intervalId = setInterval(() => {
        setMessages(prev => [
          ...prev.slice(0, -1),
          { text: text.slice(0, i), isUser: false }
        ]);
        i++;
        if (i > text.length) {
          clearInterval(intervalId);
          setIsTyping(false);
        }
      }, 50);
    };
  
    const handleClose = () => {
      setIsOpen(false);
    };
  
    const handleOpen = () => {
      setIsOpen(true);
    };
  
    const handleInputChange = (e) => {
      setInputText(e.target.value);
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
      if (inputText.trim()) {
        setMessages(prev => [...prev, { text: inputText, isUser: true }]);
        setInputText('');
  
        if (!userName) {
          setUserName(inputText);
          setTimeout(() => {
            addBotMessage(`Nice to meet you, ${inputText}! I will ask you a few questions to get to know you better. Please answer each question to the best of your ability.`);
          }, 500);
        }
      }
    };
  
    return (
      <div className={`chatbot-container ${isOpen ? 'open' : 'closed'}`}>
        {isOpen ? (
          <div className="chatbot-window">
            <div className="chatbot-header">
              <h2>Bolt Chat</h2>
              <button onClick={handleClose} className="close-button">
                X
              </button>
            </div>
            <div className="chatbot-messages" ref={chatContainerRef}>
              
              <div className="welcome-container">
                <div className="initial-orb">
                  <div className="orb"></div>
                </div>
                <p className="welcome-message">Welcome to Bolt Chat!</p>
              </div>
              {messages.map((message, index) => (
                <div key={index} className={`message ${message.isUser ? 'user' : 'bot'}`}>
                  {message.text} 
                  {isTyping && index === messages.length - 1 && !message.isUser && (
                    <div className="orb small"></div>
                    )}
                </div>
              ))}
            </div>
            <div className="chatbot-input-area">
              <form onSubmit={handleSubmit} className="chatbot-input">
                <input
                  type="text"
                  value={inputText}
                  onChange={handleInputChange}
                  placeholder="Type anything..."
                  disabled={isTyping}
                />
                <button type="submit" disabled={isTyping}>Send</button>
              </form>
            </div>
          </div>
        ) : (
          <button onClick={handleOpen} className="chatbot-trigger initial-orb" ref={triggerButtonRef}>
            
            <div className="orb"></div>
          </button>
        )}
      </div>
    );
  };
  
  export default BoltChatBot;