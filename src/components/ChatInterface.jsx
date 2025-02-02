import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'; // ChatGPT-like theme
import { sendMessageToGrok } from '../services/grokApi';

const ChatInterface = ({ darkMode }) => {
  const [messages, setMessages] = useState([
    { text: 'Hi! How can I assist you today?', sender: 'bot' },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const handleSend = async () => {
    if (!input.trim()) return;

    setMessages((prev) => [...prev, { text: input, sender: 'user' }]);
    setInput('');
    setIsTyping(true);

    try {
      const botReply = await sendMessageToGrok(input);
      setMessages((prev) => [...prev, { text: botReply, sender: 'bot' }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { text: 'Oops! Something went wrong.', sender: 'bot' },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const handleClearChat = () => {
    setMessages([{ text: 'Hi! How can I assist you today?', sender: 'bot' }]);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 relative">
      {/* Clear Chat Button */}
      <div className="flex justify-end mb-2">
        <button
          onClick={handleClearChat}
          className={`px-3 py-1 rounded-md text-sm ${
            darkMode
              ? 'bg-gray-700 hover:bg-gray-600 text-white'
              : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
          } transition`}
        >
          🗑️ Clear Chat
        </button>
      </div>

      {/* Messages */}
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`max-w-2xl mx-auto p-4 rounded-md whitespace-pre-wrap ${
            msg.sender === 'bot'
              ? `${darkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-200 text-gray-800'}`
              : `${darkMode ? 'bg-blue-500 text-white' : 'bg-blue-600 text-white'} self-end`
          }`}
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              code({ node, inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || '');
                return !inline && match ? (
                  <SyntaxHighlighter
                    style={vscDarkPlus}
                    language={match[1]}
                    PreTag="div"
                    {...props}
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                ) : (
                  <code
                    className={`${
                      darkMode ? 'bg-gray-800 text-green-400' : 'bg-gray-100 text-black'
                    } p-1 rounded`}
                    {...props}
                  >
                    {children}
                  </code>
                );
              },
            }}
          >
            {msg.text}
          </ReactMarkdown>
        </div>
      ))}

      {isTyping && (
        <div className="flex items-center justify-center text-gray-400 animate-pulse">
          AI is typing...
        </div>
      )}
      <div ref={messagesEndRef} />

      {/* Chat Input */}
      <div
        className={`w-full border-t p-4 ${
          darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-300 bg-white'
        }`}
      >
        <div className="flex items-center max-w-2xl mx-auto bg-transparent rounded-xl p-2">
          <input
            type="text"
            className={`flex-1 bg-transparent outline-none px-4 ${
              darkMode
                ? 'text-white placeholder-gray-400'
                : 'text-gray-900 placeholder-gray-500'
            }`}
            placeholder="Send a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button
            onClick={handleSend}
            className={`p-2 rounded-full transition-transform duration-200 ${
              darkMode
                ? 'bg-gray-700 hover:bg-gray-600 text-white'
                : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
            } hover:scale-105 shadow-md flex items-center justify-center`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 24 24"
              className="w-5 h-5"
            >
              <path
                d="M4 12h16M12 4l8 8-8 8"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
