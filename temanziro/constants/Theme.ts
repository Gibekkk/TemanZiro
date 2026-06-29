export const COMMON_COLORS = {
    primary: `#001846`,
    secondary: `#e96100`,
    primaryBackground: `#f8f7f5`,
    secondaryBackground: `#F0D2BC`,
    textPrimary: `#0f172a`,
    textSecondary: `#475569`,
    border: `#efd7c4`,
    lightText: `#ffffff`,
    online: `#10b981`,
} as const;

export const LIGHT_THEME = {
    colors: {
        ...COMMON_COLORS,
        primaryBackground: `#f8f7f5`
    }
} as const;

export const DARK_THEME = {
    colors: {
        ...COMMON_COLORS,
        primaryBackground: `#0f172a`
    }
} as const;

export const FONTS = {
    montserrat: `Montserrat`,
    quicksand: `Quicksand`,
} as const;

export type Theme = typeof LIGHT_THEME;