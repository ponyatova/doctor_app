'use client'
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { ReactNode } from 'react';


interface RevealSectionProps {
  children: ReactNode;
  animation?: 'fade-up' | 'fade-down' | 'slide-left' | 'slide-right' | 'scale' | 'rotate' | 'blur';
  delay?: number;
  className?: string;
}

export function RevealSection({ 
  children, 
  animation = 'fade-up', 
  delay = 0,
  className = '' 
}: RevealSectionProps) {
  const { elementRef, isVisible } = useScrollReveal({
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px',
    triggerOnce: true,
  });

  const animationClass = {
    'fade-up': 'scroll-reveal',
    'fade-down': 'scroll-reveal-down',
    'slide-left': 'scroll-reveal-left',
    'slide-right': 'scroll-reveal-right',
    'scale': 'scroll-reveal-scale',
    'rotate': 'scroll-reveal-rotate',
    'blur': 'scroll-reveal-blur',
  }[animation];

  const delayClass = delay > 0 ? `delay-${delay}` : '';

  return (
    <div
      ref={elementRef}
      className={`${animationClass} ${isVisible ? 'visible' : ''} ${delayClass} ${className}`}
    >
      {children}
    </div>
  );
}
