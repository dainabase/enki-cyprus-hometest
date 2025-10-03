import { useState, useCallback, useEffect, useRef } from 'react';
import { ChatMessage } from '@/components/ChatMessage';
import { MockProperty } from '@/types/search.types';

export const useChatMessages = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll vers le dernier message
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const addMessage = useCallback((message: ChatMessage) => {
    setMessages(prev => [...prev, message]);
  }, []);

  const addUserMessage = useCallback((content: string) => {
    addMessage({
      role: 'user',
      content,
      timestamp: new Date()
    });
  }, [addMessage]);

  const addAssistantMessage = useCallback((content: string, properties?: any[], fiscalOptimization?: any) => {
    addMessage({
      role: 'assistant',
      content,
      properties,
      fiscalOptimization,
      timestamp: new Date()
    });
  }, [addMessage]);

  const addTypingMessage = useCallback(() => {
    addMessage({
      role: 'assistant',
      content: 'Analyse en cours de votre demande...',
      isTyping: true,
      timestamp: new Date()
    });
  }, [addMessage]);

  const replaceLastMessage = useCallback((message: ChatMessage) => {
    setMessages(prev => {
      const newMessages = [...prev];
      newMessages[newMessages.length - 1] = message;
      return newMessages;
    });
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    messages,
    setMessages,
    isAnalyzing,
    setIsAnalyzing,
    messagesContainerRef,
    addMessage,
    addUserMessage,
    addAssistantMessage,
    addTypingMessage,
    replaceLastMessage,
    clearMessages
  };
};
