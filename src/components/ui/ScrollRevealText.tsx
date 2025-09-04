import React, { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

interface ScrollRevealTextProps {
  text: string;
  className?: string;
  containerClassName?: string;
}

export const ScrollRevealText: React.FC<ScrollRevealTextProps> = ({
  text,
  className = "",
  containerClassName = ""
}) => {
  const targetRef = useRef<HTMLDivElement>(null);
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: false
  });

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start 0.8", "end 0.2"]
  });

  // Convertir le texte en mots
  const words = text.split(' ');
  
  return (
    <div ref={(node) => {
      targetRef.current = node;
      ref(node);
    }} className={containerClassName}>
      <motion.h2 className={className}>
        {words.map((word, index) => {
          // Calculer le progrès pour chaque mot
          const start = index / words.length;
          const end = (index + 1) / words.length;
          
          const wordProgress = useTransform(
            scrollYProgress,
            [start, end],
            [0, 1]
          );

          return (
            <motion.span
              key={index}
              className="inline-block mr-2"
              style={{
                opacity: inView ? wordProgress : 0,
              }}
              initial={{ opacity: 0 }}
            >
              {word}
            </motion.span>
          );
        })}
      </motion.h2>
    </div>
  );
};

export const ScrollRevealTextLetters: React.FC<ScrollRevealTextProps> = ({
  text,
  className = "",
  containerClassName = ""
}) => {
  const targetRef = useRef<HTMLDivElement>(null);
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: false
  });

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start 0.8", "end 0.2"]
  });

  // Convertir le texte en lettres (en gardant les espaces)
  const letters = text.split('');
  
  return (
    <div ref={(node) => {
      targetRef.current = node;
      ref(node);
    }} className={containerClassName}>
      <motion.h2 className={className}>
        {letters.map((letter, index) => {
          // Calculer le progrès pour chaque lettre
          const start = index / letters.length;
          const end = (index + 1) / letters.length;
          
          const letterProgress = useTransform(
            scrollYProgress,
            [start, end],
            [0, 1]
          );

          return (
            <motion.span
              key={index}
              className="inline-block"
              style={{
                opacity: inView ? letterProgress : 0,
              }}
              initial={{ opacity: 0 }}
            >
              {letter === ' ' ? '\u00A0' : letter}
            </motion.span>
          );
        })}
      </motion.h2>
    </div>
  );
};