import React, { useState } from 'react';
import ChatButton from './ChatButton';
import ChatWindow from './ChatWindow';

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <ChatButton onClick={toggleChat} isOpen={isOpen} />
      <ChatWindow isOpen={isOpen} onClose={toggleChat} />
    </>
  );
};

export default ChatWidget; 