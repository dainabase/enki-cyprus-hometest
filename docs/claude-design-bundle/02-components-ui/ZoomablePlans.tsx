import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { 
  ZoomIn, ZoomOut, RotateCcw, X, Download, Maximize2,
  ChevronLeft, ChevronRight 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent } from '@/components/ui/dialog';

interface PlanImage {
  url: string;
  title: string;
  type?: 'floor_plan' | 'site_plan' | '3d_view';
}

interface ZoomablePlansProps {
  plans: PlanImage[];
  className?: string;
}

const ZoomablePlans: React.FC<ZoomablePlansProps> = ({ plans, className = '' }) => {
  const [selectedPlan, setSelectedPlan] = useState<PlanImage | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const planTypes = {
    floor_plan: { label: 'Plan d\'étage', color: 'bg-blue-100 text-blue-800' },
    site_plan: { label: 'Plan de site', color: 'bg-green-100 text-green-800' },
    '3d_view': { label: 'Vue 3D', color: 'bg-purple-100 text-purple-800' }
  };

  const openPlanModal = (plan: PlanImage, index: number) => {
    setSelectedPlan(plan);
    setCurrentIndex(index);
  };

  const closePlanModal = () => {
    setSelectedPlan(null);
  };

  const navigateToNext = () => {
    if (currentIndex < plans.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      setSelectedPlan(plans[nextIndex]);
    }
  };

  const navigateToPrev = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentIndex(prevIndex);
      setSelectedPlan(plans[prevIndex]);
    }
  };

  const downloadPlan = (plan: PlanImage) => {
    const link = document.createElement('a');
    link.href = plan.url;
    link.download = `${plan.title}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!plans || plans.length === 0) return null;

  return (
    <>
      <Card className={`overflow-hidden shadow-lg ${className}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Maximize2 className="w-5 h-5" />
            Plans & Aménagements
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
            {plans.map((plan, index) => (
              <motion.div
                key={index}
                className="relative group cursor-pointer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => openPlanModal(plan, index)}
              >
                <div className="relative overflow-hidden rounded-lg border border-border">
                  <img
                    src={plan.url}
                    alt={plan.title}
                    className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                    loading="lazy"
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="text-center text-white">
                      <ZoomIn className="w-8 h-8 mx-auto mb-2" />
                      <p className="text-sm font-medium">Cliquer pour agrandir</p>
                    </div>
                  </div>
                  
                  {/* Plan Type Badge */}
                  {plan.type && (
                    <Badge 
                      className={`absolute top-2 left-2 ${planTypes[plan.type]?.color || 'bg-gray-100 text-gray-800'}`}
                      variant="secondary"
                    >
                      {planTypes[plan.type]?.label || 'Plan'}
                    </Badge>
                  )}
                </div>
                
                <div className="mt-2">
                  <h4 className="font-medium text-sm text-foreground">{plan.title}</h4>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Zoom Modal */}
      <AnimatePresence>
        {selectedPlan && (
          <Dialog open={!!selectedPlan} onOpenChange={closePlanModal}>
            <DialogContent className="max-w-6xl max-h-[90vh] p-0 overflow-hidden">
              <div className="relative h-full">
                {/* Header */}
                <div className="absolute top-0 left-0 right-0 z-20 bg-background/90 backdrop-blur-sm border-b p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold">{selectedPlan.title}</h3>
                      {selectedPlan.type && (
                        <Badge 
                          className={planTypes[selectedPlan.type]?.color || 'bg-gray-100 text-gray-800'}
                          variant="secondary"
                        >
                          {planTypes[selectedPlan.type]?.label || 'Plan'}
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => downloadPlan(selectedPlan)}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Télécharger
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={closePlanModal}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Transform Wrapper */}
                <div className="h-[70vh] pt-20">
                  <TransformWrapper
                    initialScale={1}
                    minScale={0.5}
                    maxScale={5}
                    centerOnInit
                    wheel={{ step: 0.1 }}
                    pinch={{ step: 5 }}
                    doubleClick={{ step: 0.7, mode: "zoomIn" }}
                  >
                    {({ zoomIn, zoomOut, resetTransform }) => (
                      <>
                        {/* Zoom Controls */}
                        <div className="absolute bottom-4 left-4 z-20 flex flex-col gap-2">
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Button variant="outline" size="sm" onClick={() => zoomIn()}>
                              <ZoomIn className="w-4 h-4" />
                            </Button>
                          </motion.div>
                          
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Button variant="outline" size="sm" onClick={() => zoomOut()}>
                              <ZoomOut className="w-4 h-4" />
                            </Button>
                          </motion.div>
                          
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Button variant="outline" size="sm" onClick={() => resetTransform()}>
                              <RotateCcw className="w-4 h-4" />
                            </Button>
                          </motion.div>
                        </div>

                        {/* Navigation Controls */}
                        {plans.length > 1 && (
                          <>
                            {currentIndex > 0 && (
                              <div className="absolute left-4 top-1/2 -translate-y-1/2 z-20">
                                <motion.div
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                >
                                  <Button variant="outline" size="sm" onClick={navigateToPrev}>
                                    <ChevronLeft className="w-4 h-4" />
                                  </Button>
                                </motion.div>
                              </div>
                            )}
                            
                            {currentIndex < plans.length - 1 && (
                              <div className="absolute right-4 top-1/2 -translate-y-1/2 z-20">
                                <motion.div
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                >
                                  <Button variant="outline" size="sm" onClick={navigateToNext}>
                                    <ChevronRight className="w-4 h-4" />
                                  </Button>
                                </motion.div>
                              </div>
                            )}
                          </>
                        )}

                        {/* Zoomable Image */}
                        <TransformComponent
                          wrapperStyle={{
                            width: '100%',
                            height: '100%',
                            cursor: 'grab'
                          }}
                          contentStyle={{
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <motion.img
                            src={selectedPlan.url}
                            alt={selectedPlan.title}
                            className="max-w-full max-h-full object-contain select-none"
                            draggable={false}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                          />
                        </TransformComponent>
                      </>
                    )}
                  </TransformWrapper>
                </div>

                {/* Plan Navigation Dots */}
                {plans.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
                    {plans.map((_, index) => (
                      <motion.button
                        key={index}
                        onClick={() => {
                          setCurrentIndex(index);
                          setSelectedPlan(plans[index]);
                        }}
                        className={`w-3 h-3 rounded-full border-2 border-white/50 transition-all duration-300 ${
                          index === currentIndex 
                            ? 'bg-white scale-125' 
                            : 'bg-transparent hover:bg-white/30'
                        }`}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                      />
                    ))}
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </>
  );
};

export default ZoomablePlans;