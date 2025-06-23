import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark';
  });

  // Support all 4 themes instead of just toggle between light/dark
  const changeTheme = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  // Keep the toggle function for backward compatibility (light/dark only)
  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    changeTheme(nextTheme);
  };

  useEffect(() => {
    // Apply theme immediately when component mounts or theme changes
    document.documentElement.className = theme;
    document.documentElement.setAttribute('data-theme', theme);

    // Force a repaint to ensure CSS variables are applied immediately
    document.body.style.display = 'none';
    document.body.offsetHeight; // Trigger reflow
    document.body.style.display = '';
  }, [theme]);

  return (
    <ThemeContext.Provider value={{
      theme,
      setTheme: changeTheme,
      toggleTheme,
      availableThemes: ['light', 'dark', 'blue', 'sepia']
    }}>
      <div className={theme} data-theme={theme}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
