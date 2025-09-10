import React, { useEffect, useState } from "react";
import { motion, useMotionValue } from "framer-motion";

const ONE_SECOND = 1000;
const AUTO_DELAY = ONE_SECOND * 10;
const DRAG_BUFFER = 50;

const SPRING_OPTIONS = {
  type: "spring" as const,
  mass: 3,
  stiffness: 400,
  damping: 50,
};

interface SwipeCarouselProps {
  project: any;
}

export const SwipeCarousel = ({ project }: SwipeCarouselProps) => {
  const [imgIndex, setImgIndex] = useState(0);
  const dragX = useMotionValue(0);

  // Get all project images
  const imgs = [
    ...(project.photos || []),
    ...(project.photo_gallery_urls || []),
    ...(project.project_images?.map((img: any) => img.url) || [])
  ].filter(Boolean);

  // Fallback images if no images available
  const displayImgs = imgs.length > 0 ? imgs : [
    "https://picsum.photos/1200/675?random=1",
    "https://picsum.photos/1200/675?random=2", 
    "https://picsum.photos/1200/675?random=3",
    "https://picsum.photos/1200/675?random=4",
    "https://picsum.photos/1200/675?random=5"
  ];

  useEffect(() => {
    const intervalRef = setInterval(() => {
      const x = dragX.get();

      if (x === 0) {
        setImgIndex((pv) => {
          if (pv === displayImgs.length - 1) {
            return 0;
          }
          return pv + 1;
        });
      }
    }, AUTO_DELAY);

    return () => clearInterval(intervalRef);
  }, [dragX, displayImgs.length]);

  const onDragEnd = () => {
    const x = dragX.get();

    if (x <= -DRAG_BUFFER && imgIndex < displayImgs.length - 1) {
      setImgIndex((pv) => pv + 1);
    } else if (x >= DRAG_BUFFER && imgIndex > 0) {
      setImgIndex((pv) => pv - 1);
    }
  };

  // Debug: add a simple test render first
  if (!project) {
    return (
      <section className="py-32 bg-white">
        <div className="container mx-auto px-8">
          <h2 className="text-5xl font-light text-center mb-20 text-black">
            Property overview
          </h2>
          <div className="bg-red-100 p-8 rounded-lg text-center">
            <p>No project data available</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-32 bg-white">
      <div className="container mx-auto px-8">
        <motion.h2 
          className="text-5xl font-light text-center mb-20 text-black"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Property overview
        </motion.h2>

        <div className="relative overflow-hidden bg-black py-8 rounded-[40px]">
          <motion.div
            drag="x"
            dragConstraints={{
              left: 0,
              right: 0,
            }}
            style={{
              x: dragX,
            }}
            animate={{
              translateX: `-${imgIndex * 100}%`,
            }}
            transition={SPRING_OPTIONS}
            onDragEnd={onDragEnd}
            className="flex cursor-grab items-center active:cursor-grabbing"
          >
            <Images imgIndex={imgIndex} imgs={displayImgs} />
          </motion.div>

          <Dots imgIndex={imgIndex} setImgIndex={setImgIndex} imgs={displayImgs} />
          <GradientEdges />
        </div>
      </div>
    </section>
  );
};

const Images = ({ imgIndex, imgs }: { imgIndex: number; imgs: string[] }) => {
  return (
    <>
      {imgs.map((imgSrc, idx) => {
        return (
          <motion.div
            key={idx}
            style={{
              backgroundImage: `url(${imgSrc})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
            animate={{
              scale: imgIndex === idx ? 0.95 : 0.85,
            }}
            transition={SPRING_OPTIONS}
            className="aspect-video w-screen shrink-0 rounded-xl bg-neutral-800 object-cover"
          />
        );
      })}
    </>
  );
};

const Dots = ({ imgIndex, setImgIndex, imgs }: { imgIndex: number; setImgIndex: (index: number) => void; imgs: string[] }) => {
  return (
    <div className="mt-4 flex w-full justify-center gap-2">
      {imgs.map((_, idx) => {
        return (
          <button
            key={idx}
            onClick={() => setImgIndex(idx)}
            className={`h-3 w-3 rounded-full transition-colors ${
              idx === imgIndex ? "bg-neutral-50" : "bg-neutral-500"
            }`}
          />
        );
      })}
    </div>
  );
};

const GradientEdges = () => {
  return (
    <>
      <div className="pointer-events-none absolute bottom-0 left-0 top-0 w-[10vw] max-w-[100px] bg-gradient-to-r from-neutral-950/50 to-neutral-950/0" />
      <div className="pointer-events-none absolute bottom-0 right-0 top-0 w-[10vw] max-w-[100px] bg-gradient-to-l from-neutral-950/50 to-neutral-950/0" />
    </>
  );
};