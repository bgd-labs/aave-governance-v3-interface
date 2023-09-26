import { useEffect, useState } from 'react';

export function useScrollDirection() {
  const [scrollDirection, setScrollDirection] = useState<'down' | 'up' | null>(
    null,
  );

  let lastScrollY = typeof window !== 'undefined' ? window.pageYOffset : 0;

  const throttle = (fn: () => void, wait: number) => {
    let time = Date.now();
    return function () {
      if (time + wait - Date.now() < 0) {
        fn();
        time = Date.now();
      }
    };
  };

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
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', throttle(updateScrollDirection, 10)); // add event listener
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener(
          'scroll',
          throttle(updateScrollDirection, 10),
        ); // clean up
      }
    };
  }, [scrollDirection]);

  return { scrollDirection };
}
