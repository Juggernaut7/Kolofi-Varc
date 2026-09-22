'use client';

import { useEffect, useRef } from 'react';

interface LottiePlayerProps {
  animationData: string | object;
  loop?: boolean;
  autoplay?: boolean;
  speed?: number;
  className?: string;
}

export default function LottiePlayer({
  animationData,
  loop = true,
  autoplay = true,
  speed = 1,
  className = '',
}: LottiePlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let animInstance: any = null;
    let isMounted = true;

    const loadLottie = async () => {
      try {
        const { default: lottieWeb } = await import('lottie-web');

        if (containerRef.current && isMounted) {
          const animData = typeof animationData === 'string'
            ? await fetch(animationData).then(res => res.json())
            : animationData;

          if (!isMounted) return;

          animInstance = lottieWeb.loadAnimation({
            container: containerRef.current,
            renderer: 'svg',
            loop,
            autoplay,
            animationData: animData,
            speed,
          });
        }
      } catch (error) {
        console.error('Failed to load Lottie animation:', error);
      }
    };

    loadLottie();

    return () => {
      isMounted = false;
      if (animInstance) {
        animInstance.destroy();
      }
    };
  }, [animationData, loop, autoplay, speed]);

  return <div ref={containerRef} className={className} />;
}
