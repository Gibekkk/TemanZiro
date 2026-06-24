import { LIGHT_THEME, DARK_THEME, Theme } from "@/constants/Theme";
import React, { createContext, ReactNode } from "react";
import { useColorScheme } from "react-native";

interface ThemeContextData {
    theme: Theme;
    isDark: boolean;
}

export const ThemeContext = createContext<ThemeContextData | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const colorScheme = useColorScheme();

    const isDark = colorScheme === "dark";
    const theme = (isDark ? DARK_THEME : LIGHT_THEME) as Theme;

    return (
        <ThemeContext.Provider value={{ theme, isDark }}>
            {children}
        </ThemeContext.Provider>
    );
};
