import { Maximize2, Minimize2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface ChatExpandButtonProps {
  isExpanded: boolean;
  onToggle: () => void;
}

export const ChatExpandButton = ({ isExpanded, onToggle }: ChatExpandButtonProps) => {
  return (
    <motion.button
      onClick={onToggle}
      className="p-2 bg-black text-white hover:bg-black/90 transition-colors"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      title={isExpanded ? 'Minimize chat' : 'Expand chat'}
    >
      {isExpanded ? (
        <Minimize2 className="w-4 h-4" />
      ) : (
        <Maximize2 className="w-4 h-4" />
      )}
    </motion.button>
  );
};
