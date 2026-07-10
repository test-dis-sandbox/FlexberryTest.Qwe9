import { createTheme, alpha, Shadows } from '@mui/material/styles';

const defaultTheme = createTheme();

export const brand = {
  50: 'hsl(221, 100%, 95%)',
  100: 'hsl(221, 100%, 92%)',
  200: 'hsl(221, 100%, 80%)',
  300: 'hsl(221, 100%, 65%)',
  400: 'hsl(221, 88%, 44%)',
  500: 'hsl(221, 98%, 42%)',
  600: 'hsl(221, 98%, 55%)',
  700: 'hsl(221, 100%, 35%)',
  800: 'hsl(221, 100%, 16%)',
  900: 'hsl(221, 100%, 21%)',
};

export const gray = {
  50: 'hsl(220, 35%, 97%)',
  100: 'hsl(220, 30%, 94%)',
  200: 'hsl(220, 20%, 88%)',
  300: 'hsl(220, 20%, 80%)',
  400: 'hsl(220, 20%, 65%)',
  500: 'hsl(220, 20%, 42%)',
  600: 'hsl(220, 20%, 35%)',
  700: 'hsl(220, 20%, 25%)',
  800: 'hsl(220, 30%, 6%)',
  900: 'hsl(220, 35%, 3%)',
};

export const colorSchemes = {
  light: {
    palette: {
      primary: {
        light: brand[200],
        main: brand[400],
        dark: brand[700],
        contrastText: brand[50],
      },
      error: {
        light: '#FCD9DE',
        main: '#E11432',
        dark: '#EE3F58',
      },
      grey: {
        ...gray,
      },
      divider: alpha(gray[300], 0.4),
      background: {
        default: '#f5f7fa',
      },
      FilledInput: {
        bg: '#f5f7fa',
        hoverBg: '#f5f7fa',
        disabledBg: '#E1E1E1',
      },
      text: {
        primary: '#0B1F33',
        secondary: '#66727F',
      },
      action: {
        hover: alpha(gray[200], 0.2),
        selected: `#E5E7EB`,
        active: '#9DACCE',
        disabled: '#86909C',
        disabledBackground: '#E5EAF5',
      },
      baseShadow: 'hsla(220, 30%, 5%, 0.07) 0px 4px 16px 0px, hsla(220, 25%, 10%, 0.07) 0px 8px 16px -5px',
    },
  },
  dark: {
    palette: {
      primary: {
        contrastText: brand[50],
        light: brand[300],
        main: brand[400],
        dark: brand[700],
      },
      grey: {
        ...gray,
      },
      divider: alpha(gray[700], 0.6),
      background: {
        default: gray[900],
      },
      text: {
        primary: 'hsl(0, 0%, 80%)',
        secondary: gray[400],
      },
      action: {
        hover: alpha(gray[600], 0.2),
        selected: alpha(gray[600], 0.3),
      },
      baseShadow: 'hsla(220, 30%, 5%, 0.7) 0px 4px 16px 0px, hsla(220, 25%, 10%, 0.8) 0px 8px 16px -5px',
    },
  },
};

export const typography = {
  fontFamily: '"Lato", "Helvetica", "Arial", sans-serif',

  h1: {
    fontSize: '1.5rem',
    fontWeight: 700,
  },
  h3: {
    fontSize: '1.125rem',
    fontWeight: 700,
  },
  h4: {
    fontSize: '2.25rem',
    fontWeight: 700,
  },
  button: {
    textTransform: 'none' as const,
    fontWeight: 400,
    fontSize: '1rem',
  },
};

export const shape = {
  borderRadius: 8,
};

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const defaultShadows: Shadows = ['none', 'var(--ns-palette-baseShadow)', ...defaultTheme.shadows.slice(2)];
export const shadows = defaultShadows;
