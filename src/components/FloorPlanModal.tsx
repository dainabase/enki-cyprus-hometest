import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { X, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FloorPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  planUrl: string;
  planTitle: string;
}

const FloorPlanModal: React.FC<FloorPlanModalProps> = ({
  isOpen,
  onClose,
  planUrl,
  planTitle
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center"
        onClick={onClose}
      >
        {/* Header */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="absolute top-4 left-4 right-4 flex justify-between items-center z-10"
        >
          <h3 className="text-white text-xl font-semibold">{planTitle}</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="bg-white bg-opacity-20 border-white text-white hover:bg-white hover:text-black"
          >
            <X className="w-4 h-4" />
          </Button>
        </motion.div>

        {/* Zoom Container */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.5, opacity: 0 }}
          transition={{ 
            type: "spring", 
            stiffness: 300, 
            damping: 20 
          }}
          className="w-full h-full p-16"
          onClick={(e) => e.stopPropagation()}
        >
          <TransformWrapper
            initialScale={1}
            minScale={0.5}
            maxScale={4}
            centerOnInit
            wheel={{ step: 0.1 }}
            pinch={{ step: 5 }}
            doubleClick={{ mode: "toggle", step: 0.5 }}
          >
            {({ zoomIn, zoomOut, resetTransform }) => (
              <>
                {/* Controls */}
                <motion.div
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="absolute top-20 right-4 flex flex-col gap-2 z-10"
                >
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => zoomIn()}
                    className="bg-white bg-opacity-20 border-white text-white hover:bg-white hover:text-black"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => zoomOut()}
                    className="bg-white bg-opacity-20 border-white text-white hover:bg-white hover:text-black"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => resetTransform()}
                    className="bg-white bg-opacity-20 border-white text-white hover:bg-white hover:text-black"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                </motion.div>

                {/* Image */}
                <TransformComponent
                  wrapperClass="w-full h-full flex items-center justify-center"
                  contentClass="max-w-full max-h-full"
                >
                  <img
                    src={planUrl}
                    alt={planTitle}
                    className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                    draggable={false}
                  />
                </TransformComponent>
              </>
            )}
          </TransformWrapper>
        </motion.div>

        {/* Instructions */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2"
        >
          <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg px-4 py-2">
            <p className="text-white text-sm text-center">
              Utilisez la molette ou les boutons pour zoomer • Glissez pour déplacer • Double-clic pour auto-zoom
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default FloorPlanModal;