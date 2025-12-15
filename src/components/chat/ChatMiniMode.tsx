import { Bot, Maximize2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface ChatMiniModeProps {
  onExpand: () => void;
  lastMessage?: string;
}

export const ChatMiniMode = ({
  onExpand,
  lastMessage = "I've found 5 properties matching your criteria"
}: ChatMiniModeProps) => {
  return (
    <motion.div
      initial={{ width: '5%' }}
      animate={{ width: '20%' }}
      exit={{ width: '5%' }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="h-full bg-white border-r border-black/10 flex flex-col"
    >
      <div className="p-4 border-b border-black/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-black/5 flex items-center justify-center">
            <Bot className="w-5 h-5 text-black" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-black">AI Assistant</p>
            <p className="text-xs text-black/60 font-light truncate">Online</p>
          </div>
        </div>
      </div>

      <div className="flex-1 p-4 overflow-y-auto">
        <div className="bg-black/5 p-3 text-xs text-black/70 font-light leading-relaxed">
          {lastMessage}
        </div>
      </div>

      <div className="p-4 border-t border-black/10">
        <button
          onClick={onExpand}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-black text-white text-sm font-medium transition-colors hover:bg-black/90"
        >
          <Maximize2 className="w-4 h-4" />
          <span>Expand</span>
        </button>
      </div>
    </motion.div>
  );
};
