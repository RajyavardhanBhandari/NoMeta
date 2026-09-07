'use client';

import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem('nometa-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const nextDark = saved ? saved === 'dark' : prefersDark;
    document.documentElement.dataset.theme = nextDark ? 'dark' : 'light';
    setDark(nextDark);
  }, []);

  const toggle = () => {
    const nextDark = !dark;
    document.documentElement.dataset.theme = nextDark ? 'dark' : 'light';
    window.localStorage.setItem('nometa-theme', nextDark ? 'dark' : 'light');
    setDark(nextDark);
  };

  return (
    <button
      type="button"
      className="nm-theme-toggle"
      onClick={toggle}
      aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={dark ? 'Light mode' : 'Dark mode'}
    >
      <span aria-hidden="true">{dark ? '☀' : '☾'}</span>
      <span className="nm-theme-toggle__label">{dark ? 'Light' : 'Dark'}</span>
    </button>
  );
}
