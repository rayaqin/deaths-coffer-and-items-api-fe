import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react';
import { ThemeType } from './types';
import cn from 'classnames';
import { useMediaQuery } from 'react-responsive';

interface ThemeContextProps {
  theme: ThemeType;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextProps | undefined>(
  undefined
);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const preferredColorScheme = useMediaQuery({
    query: '(prefers-color-scheme: dark)',
  })
    ? 'dark'
    : 'light';
  const storedPreference = ['dark', 'light'].includes(
    localStorage.getItem('theme') ?? ''
  )
    ? (localStorage.getItem('theme') as ThemeType)
    : undefined;
  const [theme, setTheme] = useState<ThemeType>(
    storedPreference || preferredColorScheme
  );

  const toggleTheme = () => {
    setTheme((prevTheme) => {
      const newTheme = prevTheme === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', newTheme);
      return newTheme;
    });
  };

  useEffect(() => {
    setTheme(
      storedPreference && storedPreference !== preferredColorScheme
        ? storedPreference
        : preferredColorScheme
    );
  }, [preferredColorScheme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextProps => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const appendThemeClass = (className: string, theme: ThemeType) =>
  cn(className, { light: theme === 'light' });
