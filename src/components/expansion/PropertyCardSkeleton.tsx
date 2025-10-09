import { motion } from 'framer-motion';

export const PropertyCardSkeleton = () => {
  return (
    <div className="bg-white border border-black/10 overflow-hidden w-full sm:w-auto">
      <motion.div
        animate={{
          backgroundPosition: ['200% 0', '-200% 0'],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'linear',
        }}
        className="h-48 sm:h-64 bg-gradient-to-r from-black/5 via-black/10 to-black/5 bg-[length:200%_100%]"
      />
      <div className="p-4 sm:p-6 space-y-3">
        <div className="h-6 bg-black/5 w-3/4 rounded" />
        <div className="h-4 bg-black/5 w-1/2 rounded" />
        <div className="flex gap-2">
          <div className="h-8 bg-black/5 w-20 rounded" />
          <div className="h-8 bg-black/5 w-20 rounded" />
        </div>
        <div className="pt-4 border-t border-black/10">
          <div className="h-6 bg-black/5 w-1/3 rounded" />
        </div>
      </div>
    </div>
  );
};
