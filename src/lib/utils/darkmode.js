import { writable } from 'svelte/store';

const isDark = typeof document !== 'undefined' && document.documentElement.classList.contains('dark');
export const darkMode = writable(isDark);
