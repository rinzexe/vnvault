import { useState, useEffect } from 'react';

export default function useDebouncedSearch(values: any, delay: number = 200): any {
  const [debouncedValue, setDebouncedValue] = useState(values);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(values);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [...values, delay]);

  return debouncedValue;
}
