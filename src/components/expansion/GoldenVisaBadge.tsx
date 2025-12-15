import { motion } from 'framer-motion';

interface GoldenVisaBadgeProps {
  show: boolean;
}

export const GoldenVisaBadge = ({ show }: GoldenVisaBadgeProps) => {
  if (!show) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="absolute top-4 left-4 z-10"
    >
      <div className="bg-yellow-500 text-black border-0 text-xs px-3 py-1 font-medium">
        Golden Visa
      </div>
    </motion.div>
  );
};
