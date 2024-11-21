import { useState, useEffect } from 'react';

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
