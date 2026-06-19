import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface SectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
  subtitle?: string;
  fullScreen?: boolean;
  decorative?: boolean;
}

export function Section({
  children,
  className = '',
  id,
  subtitle,
  fullScreen = false,
  decorative = false,
}: SectionProps) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
      className={`
        relative px-5 py-20 md:py-28
        ${fullScreen ? 'min-h-screen flex flex-col justify-center' : ''}
        ${decorative ? '' : ''}
        ${className}
      `}
    >
      {/* Ambient decorative glow */}
      <div
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2
                     w-[500px] h-[500px] rounded-full opacity-[0.04]"
        style={{
          background: 'radial-gradient(circle, rgb(var(--glow-color)) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 max-w-2xl mx-auto w-full">
        {subtitle && (
          <p className="text-theme-primary-dim text-sm tracking-[0.2em] uppercase mb-2 font-sans">
            {subtitle}
          </p>
        )}
        {children}
      </div>
    </motion.section>
  );
}

export default Section;
