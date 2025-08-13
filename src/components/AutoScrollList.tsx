"use client";

import { useEffect, useRef } from 'react';

export default function AutoScrollList({
  items,
  speed = 40,
  className = '',
}: {
  items: Array<React.ReactNode>;
  speed?: number; // pixels per second
  className?: string;
}){
  const containerRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const animRef = useRef<number | null>(null);
  const lastTsRef = useRef<number>(0);
  const offsetRef = useRef<number>(0);
  const pausedRef = useRef<boolean>(false);

  useEffect(()=>{
    const container = containerRef.current;
    const content = contentRef.current;
    if(!container || !content) return;

    const handleMouseEnter = () => { pausedRef.current = true; };
    const handleMouseLeave = () => { pausedRef.current = false; };
    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('mouseleave', handleMouseLeave);

    function step(ts: number){
      if (!lastTsRef.current) lastTsRef.current = ts;
      const dt = (ts - lastTsRef.current) / 1000; // seconds
      lastTsRef.current = ts;

      if (!pausedRef.current) {
        const distance = speed * dt;
        offsetRef.current += distance;
        const contentHeight = content.scrollHeight / 2; // since duplicated
        if (offsetRef.current >= contentHeight) offsetRef.current = 0;
        content.style.transform = `translateY(${-offsetRef.current}px)`;
      }
      animRef.current = requestAnimationFrame(step);
    }

    // Duplicate content for seamless loop
    const clone = content.cloneNode(true) as HTMLDivElement;
    clone.setAttribute('aria-hidden', 'true');
    content.parentElement?.appendChild(clone);

    animRef.current = requestAnimationFrame(step);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      container.removeEventListener('mouseenter', handleMouseEnter);
      container.removeEventListener('mouseleave', handleMouseLeave);
      clone.remove();
    };
  }, [speed, items.length]);

  return (
    <div ref={containerRef} className={["overflow-hidden relative", className].join(' ')}>
      <div ref={contentRef} className="will-change-transform">
        {items.map((item, idx) => (
          <div key={idx} className="py-2">{item}</div>
        ))}
      </div>
    </div>
  );
}


