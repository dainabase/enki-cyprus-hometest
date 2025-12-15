import { Bot } from 'lucide-react';

type ChatPhase = 'analysis' | 'results' | 'property' | 'lexaia';

interface ChatHeaderProps {
  phase: ChatPhase;
  isThinking?: boolean;
}

const getTitleByPhase = (phase: ChatPhase): string => {
  switch (phase) {
    case 'analysis':
      return 'Analyzing your preferences...';
    case 'results':
      return 'Found matching properties';
    case 'property':
      return 'Property details';
    case 'lexaia':
      return 'Fiscal analysis';
    default:
      return 'AI Assistant';
  }
};

export const ChatHeader = ({ phase, isThinking = false }: ChatHeaderProps) => {
  return (
    <div className="p-4 bg-white border-b border-black/10">
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="w-10 h-10 bg-black/5 flex items-center justify-center">
            <Bot className="w-5 h-5 text-black" />
          </div>
          {isThinking && (
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-black rounded-full animate-pulse" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-black">
            {getTitleByPhase(phase)}
          </p>
          <p className="text-xs text-black/60 font-light">
            {isThinking ? 'Thinking...' : 'Online'}
          </p>
        </div>
      </div>
    </div>
  );
};
