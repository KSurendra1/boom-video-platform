import { useState, useEffect, RefObject } from 'react';

export function useInView(
  elementRef: RefObject<Element>,
  threshold: number = 0.1
): boolean {
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
      observer.disconnect();
    };
  }, [elementRef, threshold]);

  return isInView;
}