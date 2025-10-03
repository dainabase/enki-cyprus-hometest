import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface KPICardProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  highlight?: boolean;
  delay?: number;
}

export function KPICard({ icon, label, value, highlight, delay = 0 }: KPICardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.8,
        delay,
        ease: [0.22, 1, 0.36, 1]
      }}
      whileHover={{ scale: 1.05, y: -5 }}
      className={cn(
        "backdrop-blur-md bg-white/10 border border-white/20",
        "rounded-2xl p-6 shadow-xl transition-all duration-300",
        "hover:shadow-2xl hover:bg-white/15",
        highlight && "bg-gradient-to-br from-[hsl(199,63%,59%)] to-[hsl(199,63%,65%)] border-white/30"
      )}
    >
      <div className="text-white/80 mb-3 flex items-center justify-center">
        {icon}
      </div>
      <div className="text-3xl font-bold text-white mb-2 text-center">
        {value}
      </div>
      <div className="text-sm text-white/70 text-center font-medium">
        {label}
      </div>
    </motion.div>
  );
}
