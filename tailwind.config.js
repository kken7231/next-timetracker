/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors');
const { nextui } = require('@nextui-org/react');

module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    fontFamily: {
      // https://nextjs.org/docs/app/building-your-application/optimizing/fonts#with-tailwind-css
      sans: ['var(--font-inter)'],
      mono: ['var(--font-roboto-mono)'],
    },
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      black: colors.black,
      white: colors.white,
      gray: colors.gray,
      emerald: colors.emerald,
      indigo: colors.indigo,
      yellow: colors.yellow,

      primary: 'rgb(var(--color-primary) / <alpha-value>)',
      secondary: 'rgb(var(--color-secondary) / <alpha-value>)',
      tertiary: 'rgb(var(--color-tertiary) / <alpha-value>)',

      onPrimary: 'rgb(var(--color-on-primary) / <alpha-value>)',
      onSecondary: 'rgb(var(--color-on-secondary) / <alpha-value>)',
      onTertiary: 'rgb(var(--color-on-tertiary) / <alpha-value>)',

      primaryContainer: 'rgb(var(--color-primary-container) / <alpha-value>)',
      secondaryContainer:
        'rgb(var(--color-secondary-container) / <alpha-value>)',
      tertiaryContainer: 'rgb(var(--color-tertiary-container) / <alpha-value>)',

      onPrimaryContainer:
        'rgb(var(--color-on-primary-container) / <alpha-value>)',
      onSecondaryContainer:
        'rgb(var(--color-on-secondary-container) / <alpha-value>)',
      onTertiaryContainer:
        'rgb(var(--color-on-tertiary-container) / <alpha-value>)',

      error: 'rgb(var(--color-error) / <alpha-value>)',
      onError: 'rgb(var(--color-on-error) / <alpha-value>)',
      errorContainer: 'rgb(var(--color-error-container) / <alpha-value>)',
      onErrorContainer: 'rgb(var(--color-on-error-container) / <alpha-value>)',

      surfaceDim: 'rgb(var(--color-surface-dim) / <alpha-value>)',
      surface: 'rgb(var(--color-surface) / <alpha-value>)',
      surfaceBright: 'rgb(var(--color-surface-bright) / <alpha-value>)',

      surfaceContainerLowest:
        'rgb(var(--color-surface-container-lowest) / <alpha-value>)',
      surfaceContainerLow:
        'rgb(var(--color-surface-container-low) / <alpha-value>)',
      surfaceContainer: 'rgb(var(--color-surface-container) / <alpha-value>)',
      surfaceContainerHigh:
        'rgb(var(--color-surface-container-high) / <alpha-value>)',
      surfaceContainerHighest:
        'rgb(var(--color-surface-container-highest) / <alpha-value>)',

      onSurface: 'rgb(var(--color-on-surface) / <alpha-value>)',
      onSurfaceVariant: 'rgb(var(--color-on-surface-variant) / <alpha-value>)',
      outline: 'rgb(var(--color-outline) / <alpha-value>)',
      outlineVariant: 'rgb(var(--color-outline-variant) / <alpha-value>)',

      inverseSurface: 'rgb(var(--color-inverse-surface) / <alpha-value>)',
      inverseOnSurface: 'rgb(var(--color-inverse-on-surface) / <alpha-value>)',
      inversePrimary: 'rgb(var(--color-inverse-primary) / <alpha-value>)',
      scrim: 'rgb(var(--color-scrim) / <alpha-value>)',
      shadow: 'rgb(var(--color-shadow) / <alpha-value>)',
    },
    extend: {},
  },
  darkMode: 'class',
  plugins: [nextui()],
};
