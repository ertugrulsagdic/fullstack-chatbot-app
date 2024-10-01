import React, { useState, useRef, useEffect } from "react";
import "../styles/BoltChatBot.css";
import { RobotIcon } from "../assets/icons/RobotIcon";
import { CloseIcon } from "../assets/icons/CloseIcon";
import { useWebSocket } from "../provider/WebSocketContext";

const BoltChatBot = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [userName, setUserName] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const chatContainerRef = useRef(null);
  const triggerButtonRef = useRef(null);
  const [queue, setQueue] = useState([]);
  const [isSessionEnd, setIsSessionEnd] = useState(false);

  const queueBotMessage = (messageObject) => {
    // if _id mathes in messages array, do not add to queue
    if (messages.find((msg) => msg._id === messageObject._id)) {
      return;
    }
    setQueue((prevQueue) => [...prevQueue, messageObject]);
  };

  useEffect(() => {
    if (!isTyping && queue.length > 0) {
      const nextMessage = queue[0];
      setQueue((prevQueue) => prevQueue.slice(1));
      addBotMessage(nextMessage);
    }
  }, [isTyping, queue]);

  const {
    connectSocket,
    updateName,
    handleUserSession,
    handleNextQestion,
    handleAnswer,
    handleSessionEnd
  } = useWebSocket();

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    handleUserSession(
      (successData) => {
        if (successData.questions) {
          const messages = [];
          if (!userName) {
            setUserName(successData.name);
          }
          successData.questions?.forEach((question) => {
            const msgs = [];
            if (question.text) {
              msgs.push({ ...question, isUser: false });
            }
            if (!question.answer && question.index === 0) {
              msgs.push({ text: successData.name, isUser: true });
            } else if (question.answer) {
              msgs.push({ ...question.answer, isUser: true });
            }
            messages.push(...msgs);
          });
          setMessages(messages ?? []);
        }
      },
      (errorData) => {
        setTimeout(() => {
          queueBotMessage({ text: `Oops! There was an error: ${errorData}` });
        }, 500);
      }
    );
  }, [handleUserSession, userName]);

  useEffect(() => {
    handleSessionEnd(
      (successData) => {
        if (successData.text) {
          setTimeout(() => {
            queueBotMessage(successData);
            setIsDisabled(true);
            setIsSessionEnd(true);
          }, 500);
        }
      },
      (errorData) => {
        setTimeout(() => {
          queueBotMessage({ text: `Oops! There was an error: ${errorData}` });
        }, 500);
      }
    );
  }, [handleSessionEnd]);

  useEffect(() => {
    handleNextQestion(
      (successData) => {
        if (successData.text) {
          setTimeout(() => {
            queueBotMessage(successData);
          }, 500);
        }
      },
      (errorData) => {
        setTimeout(() => {
          queueBotMessage({ text: `Oops! There was an error: ${errorData}` });
        }, 500);
      }
    );
  }, [handleNextQestion]);

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

  const addBotMessage = (messageObject) => {
    setIsTyping(true);
    let i = 0;
    const intervalId = setInterval(() => {
      setMessages((prev) => {
        if (i <= 1) {
          return [
            ...prev,
            {
              ...messageObject,
              text: messageObject.text.slice(0, i),
              isUser: false,
            },
          ];
        }
        return [
          ...prev.slice(0, -1),
          {
            ...messageObject,
            text: messageObject.text.slice(0, i),
            isUser: false,
          },
        ];
      });
      i++;
      if (i > messageObject.text.length) {
        clearInterval(intervalId);
        setIsTyping(false);
        setIsDisabled(false);
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

  const handleRestart = () => {
    setIsSessionEnd(false);
    setUserName(null);
    setMessages([]);
    localStorage.removeItem("sessionId");
    connectSocket();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsDisabled(true);
    if (inputText.trim()) {
      setMessages((prev) => [...prev, { text: inputText, isUser: true }]);
      setInputText("");

      if (!userName) {
        setUserName(inputText.toLocaleUpperCase());
        updateName(
          inputText,
          () => {
            // setTimeout(() => {
            //   addBotMessage(successData.text);
            // }, 500);
          },
          (errorData) => {
            setTimeout(() => {
              addBotMessage({ text: `Oops! There was an error: ${errorData}` });
            }, 500);
          }
        );
      } else {
        handleAnswer(
          inputText,
          (successData) => {
            // setIsDisabled(false);
          },
          (errorData) => {
            setTimeout(() => {
              queueBotMessage({ text: `Oops! There was an error: ${errorData}` });
            }, 500);
          }
        );
      }

      // addBotMessage({ text: 'deneme'});
    }
  };

  return (
    <div className={`chatbot-container ${isOpen ? "open" : "closed"}`}>
      {isOpen ? (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <h2>Bolt Chat</h2>

            <button onClick={handleClose} className="close-button">
              <CloseIcon />
            </button>
          </div>
          <div className="chatbot-messages" ref={chatContainerRef}>
            <div className="welcome-container">
              <div className="initial-orb">
                <div className="orb">
                  <RobotIcon
                    color="white"
                    style={{ width: "70%", height: "70%" }}
                  />
                </div>
              </div>

              <p className="welcome-message">Welcome to Bolt Chat!</p>
            </div>
            {messages.map((message, index) => (
              <div
                key={index}
                className={`message ${message.isUser ? "user" : "bot"}`}
              >
                {message.text}
                {isTyping &&
                  index === messages.length - 1 &&
                  !message.isUser && <div className="orb small"></div>}
              </div>
            ))}

            {
              isSessionEnd && (
                <div className="startagain-button">
                <button onClick={() => handleRestart()}>Start again</button>
              </div>
              )
            }
          </div>
          <div className="chatbot-input-area">
            <form onSubmit={handleSubmit} className="chatbot-input">
              <input
                type="text"
                value={inputText}
                onChange={handleInputChange}
                placeholder="Type anything..."
                disabled={isTyping || isDisabled}
              />
              <button type="submit" disabled={isTyping || isDisabled}>
                Send
              </button>
            </form>
          </div>
        </div>
      ) : (
        <button
          onClick={handleOpen}
          className="chatbot-trigger initial-orb"
          ref={triggerButtonRef}
        >
          <div className="orb">
            <RobotIcon color="white" style={{ width: "70%", height: "70%" }} />
          </div>
        </button>
      )}
    </div>
  );
};

export default BoltChatBot;
