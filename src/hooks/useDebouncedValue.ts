import { useEffect, useState } from 'react';

// Menunda pembaruan nilai selama `delay` ms supaya filtering/pencarian
// tidak dijalankan pada setiap ketukan huruf (mencegah aplikasi lemot).
export default function useDebouncedValue<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
