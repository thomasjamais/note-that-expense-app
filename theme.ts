export type ColorScale = {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
};

export interface Theme {
  colors: {
    primary: ColorScale;
    secondary: ColorScale;
    success: ColorScale;
    warning: ColorScale;
    danger: ColorScale;
    neutral: ColorScale;
    background: string;
    surface: string;
    text: {
      primary: string;
      secondary: string;
      muted: string;
      inverted: string;
    };
    border: string;
    chart: string[];
  };
  radii: { xs: number; sm: number; md: number; lg: number; xl: number; pill: number };
  spacing: { xs: number; sm: number; md: number; lg: number; xl: number; xxl: number };
  typography: {
    family: { regular: string; medium: string; bold: string };
    title: { fontSize: number; lineHeight: number; fontWeight: '700' | '600' | '500' };
    subtitle: { fontSize: number; lineHeight: number; fontWeight: '600' | '500' };
    body: { fontSize: number; lineHeight: number; fontWeight: '400' | '500' };
    small: { fontSize: number; lineHeight: number; fontWeight: '400' };
    code: { fontSize: number; lineHeight: number; fontWeight: '500' };
  };
  shadow: {
    level1: object;
    level2: object;
    level3: object;
    elevation: { 1: number; 2: number; 3: number };
  };
  opacity: { disabled: number; pressed: number };
  timing: { fast: number; normal: number; slow: number };
  hitSlop: { top: number; bottom: number; left: number; right: number };
}

export const theme: Theme = {
  colors: {
    // Jade primary
    primary: {
      50: '#E6FAF4',
      100: '#CFF5EA',
      200: '#9FEBD6',
      300: '#6FE0C3',
      400: '#3FD6AF',
      500: '#00B894',
      600: '#00A684',
      700: '#009273',
      800: '#007D62',
      900: '#005C48',
    },
    // Sky secondary
    secondary: {
      50: '#F0F7FF',
      100: '#E0EFFF',
      200: '#B9DBFF',
      300: '#92C7FF',
      400: '#6BB3FF',
      500: '#74B9FF',
      600: '#4BA3FF',
      700: '#2D8DF0',
      800: '#1D6FC4',
      900: '#154E89',
    },
    success: {
      50: '#E9FFF7',
      100: '#CFFCEB',
      200: '#9FF9D7',
      300: '#6AF2C1',
      400: '#3BE8AB',
      500: '#10D19A',
      600: '#0CB985',
      700: '#089E71',
      800: '#067F59',
      900: '#035A3F',
    },
    warning: {
      50: '#FFF8E6',
      100: '#FFEFC7',
      200: '#FFE397',
      300: '#FFD867',
      400: '#FFCB36',
      500: '#FFB020',
      600: '#E39215',
      700: '#C27410',
      800: '#98580B',
      900: '#6D3E07',
    },
    danger: {
      50: '#FFF0F0',
      100: '#FFDADA',
      200: '#FFB3B3',
      300: '#FF8C8C',
      400: '#FF6666',
      500: '#FF4D4D',
      600: '#E83B3B',
      700: '#CC2E2E',
      800: '#A32323',
      900: '#7A1919',
    },
    neutral: {
      50: '#F9FAFB',
      100: '#F2F3F5',
      200: '#E5E7EB',
      300: '#D1D5DB',
      400: '#9CA3AF',
      500: '#6B7280',
      600: '#4B5563',
      700: '#374151',
      800: '#1F2937',
      900: '#111827',
    },
    background: '#F6F7F9',
    surface: '#FFFFFF',
    text: {
      primary: '#1B1F23',
      secondary: '#5A6472',
      muted: '#8E99A3',
      inverted: '#FFFFFF',
    },
    border: '#E5E7EB',
    chart: ['#00B894', '#74B9FF', '#FFB020', '#FF4D4D', '#6B7280', '#10D19A'],
  },
  radii: { xs: 6, sm: 8, md: 12, lg: 16, xl: 24, pill: 999 },
  spacing: { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 },
  typography: {
    family: {
      regular: 'PlusJakartaSans_400Regular',
      medium: 'PlusJakartaSans_600SemiBold',
      bold: 'PlusJakartaSans_700Bold',
    },
    title: { fontSize: 24, lineHeight: 30, fontWeight: '700' },
    subtitle: { fontSize: 18, lineHeight: 24, fontWeight: '600' },
    body: { fontSize: 15, lineHeight: 22, fontWeight: '400' },
    small: { fontSize: 12, lineHeight: 16, fontWeight: '400' },
    code: { fontSize: 13, lineHeight: 18, fontWeight: '500' },
  },
  shadow: {
    level1: {
      shadowColor: '#000',
      shadowOpacity: 0.06,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 3 },
    },
    level2: {
      shadowColor: '#000',
      shadowOpacity: 0.08,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 6 },
    },
    level3: {
      shadowColor: '#000',
      shadowOpacity: 0.12,
      shadowRadius: 20,
      shadowOffset: { width: 0, height: 10 },
    },
    elevation: { 1: 2, 2: 4, 3: 8 },
  },
  opacity: { disabled: 0.5, pressed: 0.85 },
  timing: { fast: 120, normal: 220, slow: 320 },
  hitSlop: { top: 6, bottom: 6, left: 6, right: 6 },
};

export type Variant = 'primary' | 'secondary' | 'soft' | 'link' | 'destructive';
export type Size = 'sm' | 'md' | 'lg';

export const tokens = {
  button: {
    heights: { sm: 36, md: 44, lg: 52 },
    paddingsX: { sm: 12, md: 16, lg: 18 },
    gap: { sm: 6, md: 8, lg: 10 },
    radius: 12,
  },
} as const;

export const rgba = (hex: string, alpha = 1) => {
  const v = hex.replace('#', '');
  const bigint = parseInt(
    v.length === 3
      ? v
          .split('')
          .map((c) => c + c)
          .join('')
      : v,
    16,
  );
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export const softBg = (hex: string) => rgba(hex, 0.12);
export const softFg = (hex: string) => hex;
