import { useState, useEffect } from 'react';
import { useItems } from './components/helpers.js';

export function useSessionStorage(key, initialValue) { 
  const sessionStorage = typeof window !== 'undefined' ?
    window.sessionStorage : undefined;

  const [value, setValue] = useState(() => {
    const storedValue = sessionStorage && sessionStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : initialValue;
  });

  useEffect(() => {
    sessionStorage && sessionStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}

export function useStoredOffsetItems(items, pageItemCount, resetOffset = false) {
  return useItems(items, pageItemCount, () => useSessionStorage('offset', 0), resetOffset); 
}
