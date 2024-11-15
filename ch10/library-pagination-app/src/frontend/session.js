import { useState, useEffect } from 'react';
import { useItems } from './components/helpers.js';

export function useSessionStorage(key, initialValue) {
    const [value, setValue] = useState(() => {
      const storedValue = sessionStorage.getItem(key);
      return storedValue ? JSON.parse(storedValue) : initialValue;
    });

    useEffect(() => {
      sessionStorage.setItem(key, JSON.stringify(value));
    }, [key, value]);

    return [value, setValue];
}

export function useStoredPage() {
  return useSessionStorage('page', 1);
}

export function useStoredOffsetItems(items, pageItemCount) {
  return useItems(items, pageItemCount, () => useSessionStorage('offset', 0)); 
}
