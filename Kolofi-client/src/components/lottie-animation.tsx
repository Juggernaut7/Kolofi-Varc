'use client'

import { useEffect, useRef } from 'react'

interface LottieAnimationProps {
  src: string
  autoplay?: boolean
  loop?: boolean
  speed?: number
  className?: string
}

export function LottieAnimation({
  src,
  autoplay = true,
  loop = true,
  speed = 1,
  className = '',
}: LottieAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<any>(null)

  useEffect(() => {
    let anim: any = null;
    let isMounted = true;

    const loadAnimation = async () => {
      if (!containerRef.current) return;

      const lottie = (await import('lottie-web')).default;
      if (!isMounted) return;

      anim = lottie.loadAnimation({
        container: containerRef.current,
        renderer: 'svg',
        loop: loop,
        autoplay: autoplay,
        path: src,
        speed: speed,
      });

      animationRef.current = anim;
    };

    loadAnimation();

    return () => {
      isMounted = false;
      if (anim) {
        anim.destroy();
      }
      if (animationRef.current) {
        animationRef.current.destroy();
        animationRef.current = null;
      }
    };
  }, [src, autoplay, loop, speed]);

  return <div ref={containerRef} className={className} />
}
