import { useState } from 'react';

export function useDevMode(): boolean {
  const [enabled] = useState(() => {
    if (typeof window === 'undefined') {
      return false;
    }

    return new URLSearchParams(window.location.search).get('dev') === '1';
  });

  return enabled;
}
