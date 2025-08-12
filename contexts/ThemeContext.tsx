// src/ui/ThemeProvider.tsx
import React, { createContext, useContext } from 'react';
import { theme as baseTheme } from '../theme';

const ThemeContext = createContext(baseTheme);
export const ThemeProviderCustom = ({ children }: { children: React.ReactNode }) => (
  <ThemeContext.Provider value={baseTheme}>{children}</ThemeContext.Provider>
);
export const useTheme = () => useContext(ThemeContext);
