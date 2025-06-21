import { ref, watch } from 'vue';
import { useColorMode } from '@vueuse/core';

type Theme = 'light' | 'dark' | 'auto';

// Global shared theme state - singleton pattern
let globalThemeState: {
  theme: any;
  colorMode: any;
  initialized: boolean;
} | null = null;

// Create a centralized theme management system
export function useTheme() {
  // Initialize global state only once
  if (!globalThemeState) {
    // Configure useColorMode to use our storage key and default
    const colorMode = useColorMode({
      storageKey: 'theme',
      selector: 'html',
      attribute: 'class',
      modes: {
        light: '',
        dark: 'dark',
        auto: ''
      }
    });

    const theme = ref<Theme>(colorMode.value as Theme);

    globalThemeState = {
      theme,
      colorMode,
      initialized: false
    };

    // Watch for theme changes - only set up once
    watch(theme, (newTheme) => {
      applyTheme(newTheme);
    });

    // Watch for colorMode changes from vueuse
    watch(colorMode, (newMode) => {
      if (newMode !== theme.value) {
        theme.value = newMode as Theme;
      }
    });

    // Watch for system preference changes when in auto mode
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addEventListener('change', () => {
        if (theme.value === 'auto') {
          applyTheme('auto');
        }
      });
    }
  }

  const { theme, colorMode } = globalThemeState;

  // Initialize theme properly
  function initializeTheme() {
    if (globalThemeState!.initialized) return;

    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme && ['light', 'dark', 'auto'].includes(savedTheme)) {
      theme.value = savedTheme as Theme;
      colorMode.value = savedTheme as any;
    } else {
      // Default to light mode for new users
      theme.value = 'light';
      colorMode.value = 'light' as any;
      localStorage.setItem('theme', 'light');
    }

    // Apply the theme to the document
    applyTheme(theme.value);
    globalThemeState!.initialized = true;
  }

  // Apply theme to document
  function applyTheme(newTheme: Theme) {
    const isDark = newTheme === 'dark' || (newTheme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Also apply color scheme and radius from localStorage
    const savedColorScheme = localStorage.getItem('theme-color') || 'green';
    const savedRadius = localStorage.getItem('theme-radius') || '0.25';
    
    document.documentElement.setAttribute('data-color-scheme', savedColorScheme);
    document.documentElement.style.setProperty('--radius', `${savedRadius}rem`);
    
    console.log(`Theme applied: ${newTheme}, isDark: ${isDark}, class contains dark: ${document.documentElement.classList.contains('dark')}`);
  }

  // Set theme function
  function setTheme(newTheme: Theme) {
    console.log(`Setting theme from ${theme.value} to ${newTheme}`);
    theme.value = newTheme;
    colorMode.value = newTheme as any;
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
  }

  // Get current theme from localStorage (for immediate reads)
  function getCurrentTheme(): Theme {
    const savedTheme = localStorage.getItem('theme');
    return (savedTheme && ['light', 'dark', 'auto'].includes(savedTheme)) ? savedTheme as Theme : 'light';
  }

  return {
    theme,
    setTheme,
    initializeTheme,
    applyTheme,
    getCurrentTheme
  };
} 