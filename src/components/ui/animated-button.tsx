'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface AnimatedButtonProps {
  href?: string;
  onClick?: () => void;
  children?: ReactNode;
  text?: string;
}

export function AnimatedButton({ href, onClick, children, text = 'Start free' }: AnimatedButtonProps) {
  const buttonContent = (
    <>
      <div 
        className="loader absolute top-0 left-0 h-full w-full z-[1] bg-transparent"
        style={{
          mask: 'repeating-linear-gradient(90deg, transparent 0, transparent 6px, black 7px, black 8px)',
          WebkitMask: 'repeating-linear-gradient(90deg, transparent 0, transparent 6px, black 7px, black 8px)',
        }}
      >
        <div 
          className="absolute top-0 left-0 w-full h-full animate-glow-slide"
          style={{
            backgroundImage: `radial-gradient(circle at 50% 50%, var(--accent-brand) 0%, transparent 50%), 
                             radial-gradient(circle at 45% 45%, #ef4444 0%, transparent 45%), 
                             radial-gradient(circle at 55% 55%, var(--accent-brand) 0%, transparent 45%), 
                             radial-gradient(circle at 45% 55%, #f87171 0%, transparent 45%), 
                             radial-gradient(circle at 55% 45%, var(--accent-shadow) 0%, transparent 45%)`,
            mask: 'radial-gradient(circle at 50% 50%, transparent 0%, transparent 10%, black 25%)',
            WebkitMask: 'radial-gradient(circle at 50% 50%, transparent 0%, transparent 10%, black 25%)',
            filter: 'drop-shadow(0 0 8px rgba(247, 184, 7, 0.6))',
          }}
        />
      </div>
      
      <span className="relative z-[2] font-semibold select-none text-white flex gap-2 items-center">
        {children || text}
        <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
      </span>
    </>
  );

  const className = "inline-flex transition overflow-hidden group text-base font-medium text-white rounded-full py-3 px-8 relative gap-x-2 gap-y-2 items-center h-[60px] min-w-[200px] hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.15),inset_0_-1px_0_rgba(0,0,0,0.6),0_0_0_2px_rgba(247,184,7,0.3)]";
  
  const style = {
    background: 'linear-gradient(135deg, rgb(26, 26, 26) 0%, rgb(10, 10, 10) 100%)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1), inset 0 -1px 0 rgba(0,0,0,0.5)',
    transition: '0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  };

  if (href) {
    return (
      <Link href={href} className={className} style={style}>
        {buttonContent}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={className} style={style}>
      {buttonContent}
    </button>
  );
}
