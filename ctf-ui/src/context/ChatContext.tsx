import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ChatContext as ChatContextType } from '../components/ChatInterface/ChatInterface.interface';

interface ChatContextProviderType {
  chatContext: ChatContextType;
  setChatContext: (context: ChatContextType) => void;
  onGenerateTests?: (tests: any[]) => void;
  setOnGenerateTests: (handler: (tests: any[]) => void) => void;
}

const ChatContext = createContext<ChatContextProviderType | undefined>(undefined);

export const ChatContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [chatContext, setChatContext] = useState<ChatContextType>({});
  const [onGenerateTests, setOnGenerateTests] = useState<((tests: any[]) => void) | undefined>(undefined);

  return (
    <ChatContext.Provider
      value={{
        chatContext,
        setChatContext,
        onGenerateTests,
        setOnGenerateTests,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChatContext must be used within a ChatContextProvider');
  }
  return context;
};

