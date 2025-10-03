import { RefObject } from 'react';
import ChatMessageComponent, { ChatMessage } from '@/components/ChatMessage';

interface ChatMessagesProps {
  messages: ChatMessage[];
  messagesContainerRef: RefObject<HTMLDivElement>;
}

export const ChatMessages = ({ messages, messagesContainerRef }: ChatMessagesProps) => {
  return (
    <div
      ref={messagesContainerRef}
      className="messages-area h-[620px] overflow-y-auto p-6"
    >
      {messages.length === 0 ? (
        <div className="text-center text-gray-500 pt-32">
          <p className="text-lg mb-4">👋 Bonjour ! Je suis votre assistant IA immobilier</p>
          <p className="text-sm">Décrivez votre recherche pour commencer l'analyse personnalisée</p>
        </div>
      ) : (
        messages.map((message, index) => (
          <ChatMessageComponent key={index} message={message} />
        ))
      )}
    </div>
  );
};
