import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionTemplate } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

interface BaseProps {
  text: string;
  className?: string;
  containerClassName?: string;
}

// Effet d'écriture fluide au scroll via un masque (mask-image) piloté par un pourcentage lissé
export const ScrollRevealText: React.FC<BaseProps> = ({
  text,
  className = '',
  containerClassName = ''
}) => {
  const targetRef = useRef<HTMLDivElement>(null);
  const [observeRef] = useInView({ threshold: 0.1, triggerOnce: false });

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ['start 0.85', 'end 0.15']
  });

  // Lissage pour éviter les saccades
  const smooth = useSpring(scrollYProgress, { stiffness: 80, damping: 20, mass: 0.3 });
  const percent = useTransform(smooth, [0, 1], ['0%', '100%']);
  const mask = useMotionTemplate`linear-gradient(to right, black 0%, black ${percent}, transparent ${percent}, transparent 100%)`;

  return (
    <div
      ref={(node) => {
        targetRef.current = node;
        observeRef(node);
      }}
      className={containerClassName}
    >
      {/* Calque de fond (piste) */}
      <h2 className={`${className} text-left`} aria-hidden>
        <span className="text-muted-foreground/40">{text}</span>
      </h2>
      {/* Calque révélé par le masque */}
      <motion.h2
        className={`${className} text-left -mt-[1.05em]`} // superpose exactement
        style={{ WebkitMaskImage: mask as unknown as string, maskImage: mask as unknown as string }}
      >
        {text}
      </motion.h2>
    </div>
  );
};

export const ScrollRevealParagraph: React.FC<BaseProps> = ({
  text,
  className = '',
  containerClassName = ''
}) => {
  const targetRef = useRef<HTMLDivElement>(null);
  const [observeRef] = useInView({ threshold: 0.1, triggerOnce: false });

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ['start 0.9', 'end 0.2']
  });

  const smooth = useSpring(scrollYProgress, { stiffness: 80, damping: 20, mass: 0.3 });
  const percent = useTransform(smooth, [0, 1], ['0%', '100%']);
  const mask = useMotionTemplate`linear-gradient(to right, black 0%, black ${percent}, transparent ${percent}, transparent 100%)`;

  return (
    <div
      ref={(node) => {
        targetRef.current = node;
        observeRef(node);
      }}
      className={containerClassName}
    >
      <p className={`${className} text-left`} aria-hidden>
        <span className="text-muted-foreground/50">{text}</span>
      </p>
      <motion.p
        className={`${className} text-left -mt-[1.7em]`}
        style={{ WebkitMaskImage: mask as unknown as string, maskImage: mask as unknown as string }}
      >
        {text}
      </motion.p>
    </div>
  );
};
