import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; 
import client from '../api/client'; 
import './Chatbot.css';

const FRAME_COUNT = 97; 
const FRAME_RATE = 100; 

const Chatbot = () => {
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation(); 
  const navigate = useNavigate(); 
  
  const [messages, setMessages] = useState([
    { text: "안녕하냥! 무엇을 도와줄까냥?", sender: "bot" }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [quickQuestions, setQuickQuestions] = useState([]);
  
  const messagesEndRef = useRef(null);

  // 고양이 애니메이션
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFrame(prevFrame => (prevFrame + 1) % FRAME_COUNT);
    }, FRAME_RATE);
    return () => clearInterval(interval);
  }, []);

  // 스크롤 자동 이동
  useEffect(() => {
    if (isOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  // ✅ 페이지 변경 시 챗봇 리셋 및 퀵 버튼 업데이트
  useEffect(() => {
    const wasFromChatbot = location.state?.fromChatbot;

    if (!wasFromChatbot) {
      setMessages([{ text: "안녕하냥! 무엇을 도와줄까냥?", sender: "bot" }]);
      setInputValue("");
      setIsLoading(false);
    }
    
    async function loadSuggestions() {
      try {
        const res = await client.post('/api/chat/suggestions', { 
          current_path: location.pathname 
        });
        setQuickQuestions(res.data.suggestions || []);
      } catch (e) {
        console.error("퀵 버튼 로드 실패:", e);
      }
    }
    
    if (isOpen) {
      loadSuggestions();
    }
  }, [location.pathname, isOpen]); // 🦁 isOpen 추가하여 처음 열 때도 로드되게 함

  const handleToggleChat = () => setIsOpen(!isOpen);

  // 🦁 Link Parser (Markdown -> React Router)
  const renderMessage = (text) => {
    if (!text) return null;
    
    const regex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }
      
      const title = match[1];
      const url = match[2];
      
      const handleLinkClick = (linkUrl) => {
          try {
              if (linkUrl.startsWith("http")) {
                  const urlObj = new URL(linkUrl);
                  if (urlObj.origin === window.location.origin) {
                      navigate(urlObj.pathname + urlObj.search, { state: { fromChatbot: true } });
                  } else {
                      window.open(linkUrl, "_blank");
                  }
              } else {
                  navigate(linkUrl, { state: { fromChatbot: true } });
              }
          } catch (e) {
              console.error("Link Error:", e);
              navigate(linkUrl, { state: { fromChatbot: true } }); 
          }
      };

      parts.push(
        <span 
          key={lastIndex} 
          className="chat-link" 
          onClick={() => handleLinkClick(url)}
          style={{color: '#007bff', cursor: 'pointer', fontWeight: 'bold', textDecoration: 'underline'}}
        >
          {title}
        </span>
      );
      
      lastIndex = regex.lastIndex;
    }
    
    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }
    
    return parts.length > 0 ? parts : text;
  };

  // 🦁 Reusable Message Sender
  const sendMessage = async (text) => {
    setMessages(prev => [...prev, { text: text, sender: "user" }]);
    setIsLoading(true);

    try {
      const response = await client.post('/api/chat', { 
          message: text, 
          history: messages.slice(-14) // 🦁 Remember last 7 turns (14 messages)
      });
      console.log("🦁 API Response:", response.data);
      
      const botReply = response.data.reply || "답변을 생성하지 못했다냥 😿";
      setMessages(prev => [...prev, { text: botReply, sender: "bot" }]);
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages(prev => [...prev, { text: "오류가 발생했다냥. 다시 말해달라냥!", sender: "bot" }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickClick = async (q) => {
    if (q.cached_answer) {
      setMessages(prev => [...prev, { text: q.label, sender: "user" }]);
      setMessages(prev => [...prev, { text: q.cached_answer, sender: "bot" }]);
      if (q.link) navigate(q.link, { state: { fromChatbot: true } });
      return;
    }
    sendMessage(q.label);
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    const msg = inputValue;
    setInputValue("");
    sendMessage(msg);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const frameUrl = `${process.env.PUBLIC_URL}/images/cat_frames/frame_${String(currentFrame).padStart(3, '0')}.png`;

  return (
    <div className="chatbot-container">
      {isOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <span>냥냥 챗봇</span>
            <button onClick={handleToggleChat} className="close-btn">X</button>
          </div>
          <div className="chat-body">
            {messages.map((msg, index) => (
              <div key={index} className={`chat-message ${msg.sender}`}>
                <div className={`message-bubble ${msg.loading ? 'loading' : ''}`} style={{whiteSpace: 'pre-wrap'}}>
                  {renderMessage(msg.text)}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="chat-message bot">
                <div className="message-bubble loading">...생각 중이다냥...</div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {quickQuestions.length > 0 && (
            <div className="quick-replies">
              {quickQuestions.map((q, idx) => (
                <button key={idx} className="quick-chip" onClick={() => handleQuickClick(q)}>
                  {q.label}
                </button>
              ))}
            </div>
          )}

          <div className="chat-input-area">
            <input 
              type="text" 
              placeholder="메시지 입력..." 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button onClick={handleSendMessage} disabled={isLoading}>전송</button>
          </div>
        </div>
      )}
      
      <div className="cat-character" onClick={handleToggleChat}>
        <img src={frameUrl} alt="Chatbot Cat" />
        {!isOpen && <div className="chat-bubble">궁금한게 있냥?</div>}
      </div>
    </div>
  );
};

export default Chatbot;