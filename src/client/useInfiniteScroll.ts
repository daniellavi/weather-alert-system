import { useEffect, useRef, useCallback, useState } from 'react';

interface UseInfiniteScrollOptions<T> {
  fetchFn: (params: { offset: number; limit: number }) => Promise<T[]>;
  pageSize?: number;
  enabled?: boolean;
}

export function useInfiniteScroll<T>({ fetchFn, pageSize = 10, enabled = true }: UseInfiniteScrollOptions<T>) {
  const [items, setItems] = useState<T[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isInitialLoad = useRef(true);

  const loadMore = useCallback(() => {
    if (!enabled || loading || !hasMore) return;

    setLoading(true);
    fetchFn({ offset: page * pageSize, limit: pageSize })
      .then((data) => {
        setItems((prev) => [...prev, ...data]);
        setHasMore(data.length === pageSize);
        setPage((prev) => prev + 1);
      })
      .catch(() => {
        setError('Failed to fetch data. Please try again.');
      })
      .finally(() => setLoading(false));
  }, [enabled, loading, hasMore, page, pageSize, fetchFn]);

  useEffect(() => {
    if (!enabled) return;

    if (isInitialLoad.current) {
      setLoading(true);
      fetchFn({ offset: 0, limit: pageSize })
        .then((data) => {
          setItems(data);
          setHasMore(data.length === pageSize);
          setPage(1);
        })
        .catch(() => {
          setError('Failed to fetch data. Please try again.');
        })
        .finally(() => {
          setLoading(false);
          isInitialLoad.current = false;
        });
    }
  }, [enabled, fetchFn, pageSize]);

  useEffect(() => {
    if (!enabled) return;

    const handleScroll = () => {
      if (!hasMore || loading) return;
      const scrollY = window.scrollY;
      const viewportHeight = window.innerHeight;
      const fullHeight = document.body.offsetHeight;
      if (fullHeight - (scrollY + viewportHeight) < 200) {
        loadMore();
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasMore, loading, enabled, loadMore]);

  const reset = useCallback(() => {
    setItems([]);
    setPage(0);
    setHasMore(true);
    isInitialLoad.current = true;
  }, []);

  return { items, loading, error, reset };
}
