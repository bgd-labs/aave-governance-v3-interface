'use client';

import { useEffect, useState } from 'react';

import { media } from '../styles/themeMUI';
import { useMediaQuery } from './useMediaQuery';

export function useScrollDirection() {
  const sm = useMediaQuery(media.sm);

  const [scrollDirection, setScrollDirection] = useState<'down' | 'up' | null>(
    null,
  );

  let lastScrollY = typeof window !== 'undefined' ? window.pageYOffset : 0;

  const updateScrollDirection = () => {
    if (typeof window !== 'undefined') {
      const scrollY = window.pageYOffset;
      const direction = scrollY > lastScrollY ? 'down' : 'up';
      if (
        direction !== scrollDirection &&
        (scrollY - lastScrollY > 0 || scrollY - lastScrollY < 0)
      ) {
        setScrollDirection(direction);
      }
      lastScrollY = scrollY > 0 ? scrollY : 0;
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && !sm) {
      window.addEventListener('scroll', updateScrollDirection); // add event listener
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('scroll', updateScrollDirection); // clean up
      }
    };
  }, [scrollDirection]);

  return { scrollDirection };
}
