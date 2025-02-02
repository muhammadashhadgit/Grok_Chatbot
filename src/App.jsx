import React, { useState } from 'react';
import ChatInterface from './components/ChatInterface';

function App() {
  const [darkMode, setDarkMode] = useState(true);

  return (
    <div className={`${darkMode ? 'bg-gray-900' : 'bg-gray-100'} min-h-screen flex items-center justify-center transition-colors duration-300`}>
      <div className={`w-full max-w-2xl h-[85vh] ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} shadow-2xl rounded-xl border ${darkMode ? 'border-gray-700' : 'border-gray-300'} flex flex-col transition-all duration-300`}>
        
        {/* Dark Mode Toggle */}
        <div className="flex justify-end p-3">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="px-3 py-1 bg-gray-600 text-white rounded-full hover:bg-gray-700 transition"
          >
            {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </button>
        </div>

        <ChatInterface darkMode={darkMode} />
      </div>
    </div>
  );
}

export default App;
