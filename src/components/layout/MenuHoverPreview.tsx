import { motion, AnimatePresence } from 'framer-motion';

export interface MenuItemPreview {
  label: string;
  href: string;
  image: string;
  description: string;
}

interface MenuHoverPreviewProps {
  hoveredItem: MenuItemPreview | null;
}

export const MenuHoverPreview = ({ hoveredItem }: MenuHoverPreviewProps) => {
  return (
    <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none hidden xl:block z-40">

      <div className="relative w-[500px] h-[600px]">

        <div className="absolute inset-0 border-2 border-white/20 bg-black/20 backdrop-blur-sm" />

        <div className="absolute inset-0 overflow-hidden">
          <AnimatePresence mode="wait">
            {hoveredItem && (
              <motion.div
                key={hoveredItem.href}
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '-100%' }}
                transition={{
                  duration: 0.6,
                  ease: [0.22, 1, 0.36, 1]
                }}
                className="absolute inset-0"
              >
                <motion.div
                  animate={{
                    scale: [1, 1.05],
                  }}
                  transition={{
                    duration: 10,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut"
                  }}
                  className="w-full h-full"
                >
                  <img
                    src={hoveredItem.image}
                    alt={hoveredItem.label}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence mode="wait">
          {hoveredItem && (
            <motion.div
              key={`text-${hoveredItem.href}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{
                duration: 0.4,
                delay: 0.2
              }}
              className="absolute top-full mt-6 left-0 right-0 text-center"
            >
              <h3 className="text-white text-2xl font-semibold mb-3">
                {hoveredItem.label}
              </h3>

              <p className="text-white/70 text-sm leading-relaxed px-4">
                {hoveredItem.description}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
