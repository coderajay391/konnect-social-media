import { useEffect, useRef, useCallback } from 'react';

export function useInfiniteScroll(callback: () => void, hasMore: boolean, loading: boolean) {
  const observerRef = useRef<IntersectionObserver | null>(null);

  const sentinelRef = useCallback(
    (node: HTMLElement | null) => {
      if (loading) return;

      if (observerRef.current) {
        observerRef.current.disconnect();
      }

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          callback();
        }
      });

      if (node) {
        observerRef.current.observe(node);
      }
    },
    [callback, hasMore, loading]
  );

  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return sentinelRef;
}
