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

      <AnimatePresence mode="wait">
        {hoveredItem && (
          <motion.div
            key="preview-wrapper"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="relative w-[500px] h-[600px] overflow-hidden">

              <AnimatePresence initial={false} mode="popLayout">
                <motion.div
                  key={hoveredItem.href}
                  initial={{ y: '100%' }}
                  animate={{ y: '0%' }}
                  exit={{ y: '-100%' }}
                  transition={{
                    duration: 0.5,
                    ease: [0.22, 1, 0.36, 1]
                  }}
                  className="absolute inset-0 bg-black"
                >
                  <motion.img
                    src={hoveredItem.image}
                    alt={hoveredItem.label}
                    className="w-full h-full object-cover"
                    animate={{
                      scale: [1, 1.05],
                    }}
                    transition={{
                      duration: 10,
                      repeat: Infinity,
                      repeatType: "reverse",
                      ease: "easeInOut"
                    }}
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="absolute top-full left-0 right-0 mt-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`text-${hoveredItem.href}`}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 30 }}
                  transition={{
                    duration: 0.5,
                    ease: [0.22, 1, 0.36, 1]
                  }}
                  className="text-center"
                >
                  <p className="text-black/70 text-base leading-relaxed max-w-md mx-auto px-4">
                    {hoveredItem.description}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
