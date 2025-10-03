import { ChatMessages } from './ChatMessages';
import { ChatInput } from './ChatInput';
import { ChatMessage } from '@/components/ChatMessage';
import { useRef, useEffect, memo } from 'react';

interface ChatContainerProps {
  messages: ChatMessage[];
  agenticQuery: string;
  onQueryChange: (value: string) => void;
  onAnalysis: () => void;
  consent: boolean;
  consentGiven: boolean;
  shouldHighlightConsent: boolean;
  onConsentChange: (checked: boolean) => void;
  isAnalyzing: boolean;
  showResults: boolean;
}

export const ChatContainer = memo(({
  messages,
  agenticQuery,
  onQueryChange,
  onAnalysis,
  consent,
  consentGiven,
  shouldHighlightConsent,
  onConsentChange,
  isAnalyzing,
  showResults
}: ChatContainerProps) => {
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className={`chat-panel transition-all duration-[2500ms] ease-in-out ${
      showResults ? 'md:w-1/3 w-full' : 'w-full'
    }`}>
      <ChatMessages
        messages={messages}
        messagesContainerRef={messagesContainerRef}
      />

      <ChatInput
        value={agenticQuery}
        onChange={onQueryChange}
        onSubmit={onAnalysis}
        consent={consent}
        consentGiven={consentGiven}
        shouldHighlightConsent={shouldHighlightConsent}
        onConsentChange={onConsentChange}
        isAnalyzing={isAnalyzing}
      />
    </div>
  );
});

ChatContainer.displayName = 'ChatContainer';
