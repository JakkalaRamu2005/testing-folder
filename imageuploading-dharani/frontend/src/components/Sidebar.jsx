import React from 'react';
import { MessageSquarePlus, Trash2, Moon, Sun } from 'lucide-react';

const Sidebar = ({ 
  sessions, 
  currentSessionId, 
  onSelectSession, 
  onNewChat, 
  onDeleteSession,
  darkMode,
  toggleDarkMode 
}) => {
  return (
    <div className="w-64 bg-gray-900 dark:bg-gray-950 text-white flex flex-col h-screen">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <h1 className="text-xl font-bold flex items-center gap-2">
          🌾 Smart Dharani
        </h1>
      </div>

      {/* New Chat Button */}
      <div className="p-3">
        <button
          onClick={onNewChat}
          className="w-full flex items-center gap-2 px-4 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
        >
          <MessageSquarePlus size={20} />
          <span>New Chat</span>
        </button>
      </div>

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {sessions.map((session) => (
          <div
            key={session.id}
            className={`flex items-center justify-between px-4 py-3 rounded-lg cursor-pointer group ${
              currentSessionId === session.id
                ? 'bg-gray-700'
                : 'hover:bg-gray-800'
            }`}
            onClick={() => onSelectSession(session.id)}
          >
            <div className="flex-1 truncate">
              <p className="text-sm truncate">{session.title}</p>
              <p className="text-xs text-gray-400">
                {session.messageCount} messages
              </p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDeleteSession(session.id);
              }}
              className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-600 rounded transition-all"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>

      {/* Dark Mode Toggle */}
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={toggleDarkMode}
          className="w-full flex items-center gap-2 px-4 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
