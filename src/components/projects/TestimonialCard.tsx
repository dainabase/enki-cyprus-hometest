'use client';

import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import type { TestimonialCardProps } from '@/types/project.types';

export function TestimonialCard({ testimonial, index = 0 }: TestimonialCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="bg-white p-8 shadow-sm hover:shadow-md transition-shadow duration-300 h-full flex flex-col"
    >
      {/* Quote Icon */}
      <Quote className="w-10 h-10 text-black/10 mb-6" />

      {/* Rating */}
      <div className="flex gap-1 mb-6">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < testimonial.rating ? 'fill-yellow-500 text-yellow-500' : 'text-black/20'
            }`}
          />
        ))}
      </div>

      {/* Quote Text */}
      <blockquote className="text-base md:text-lg text-black/80 font-light leading-relaxed mb-8 flex-grow">
        "{testimonial.quote}"
      </blockquote>

      {/* Author Info */}
      <div className="flex items-center gap-4 pt-6 border-t border-black/5">
        {/* Avatar */}
        {testimonial.avatar ? (
          <img
            src={testimonial.avatar}
            alt={testimonial.name}
            className="w-12 h-12 rounded-full object-cover"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-black/5 flex items-center justify-center">
            <span className="text-lg font-light text-black/40">
              {testimonial.name.charAt(0)}
            </span>
          </div>
        )}

        {/* Name and Details */}
        <div>
          <p className="text-base font-light text-black">{testimonial.name}</p>
          <p className="text-sm text-black/40 font-light">
            {testimonial.nationality} • {testimonial.propertyType}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
