import React from 'react';
import { ChatBubbleLeftIcon } from '@heroicons/react/24/outline';

interface ChatButtonProps {
  onClick: () => void;
  isOpen: boolean;
}

const ChatButton: React.FC<ChatButtonProps> = ({ onClick, isOpen }) => {
  return (
    <button
      onClick={onClick}
      className={`fixed bottom-6 right-6 p-4 rounded-full shadow-lg transition-all duration-300 ${
        isOpen ? 'bg-gray-700' : 'bg-blue-600 hover:bg-blue-700'
      } text-white z-50`}
      aria-label={isOpen ? 'Close chat' : 'Open chat'}
    >
      <ChatBubbleLeftIcon className="h-6 w-6" />
    </button>
  );
};

export default ChatButton; 