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
      className="absolute top-3 right-3 z-10"
    >
      <div className="bg-gradient-to-r from-amber-500 to-yellow-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg">
        Golden Visa
      </div>
    </motion.div>
  );
};
