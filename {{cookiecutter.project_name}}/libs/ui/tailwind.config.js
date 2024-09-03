const { fontFamily } = require('tailwindcss/defaultTheme');
const plugin = require('tailwindcss/plugin');

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    `${__dirname}/src/pages/**/*.{ts,tsx}`,
    `${__dirname}/src/components/**/*.{ts,tsx}`,
    `${__dirname}/src/**/*.{ts,tsx}`,
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': { max: '1419px' },
        // => @media (max-width: 1419px) { ... }
        'xl': { max: '1179px' },
        // => @media (max-width: 1179px) { ... }
        'lg': { max: '1023px' },
        // => @media (max-width: 1023px) { ... }
        'md': { max: '767px' },
        // => @media (max-width: 767px) { ... }
        'sm': { max: '480px' },
        // => @media (max-width: 480px) { ... }
        'xs': { max: '375px' },
      },
    },
    extend: {
      spacing: {
        3: '0.75rem',
      },
      colors: {
        'border': 'hsl(var(--border))',
        'input': 'hsl(var(--input))',
        'ring': 'hsl(var(--ring))',
        'background': 'hsl(var(--background))',
        'foreground': 'hsl(var(--foreground))',
        'primary': {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        'secondary': {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        'destructive': {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        'muted': {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        'accent': {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        'popover': {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        'card': {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        'neutral': {
          '01-100': 'hsl(var(--neutral-01-100))',
          '03-100': 'hsl(var(--neutral-03-100))',
          '04-100': 'hsl(var(--neutral-04-100))',
        },
        'black': 'hsl(var(--black))',
        'blue': {
          50: 'hsl(var(--blue-50))',
          75: 'hsl(var(--blue-75))',
          100: 'hsl(var(--blue-100))',
          600: 'hsl(var(--blue-600))',
          700: 'hsl(var(--blue-700))',
          800: 'hsl(var(--blue-800))',
          900: 'hsl(var(--blue-900))',
        },
        'blue-gray': {
          25: 'hsl(var(--blue-gray-25))',
          50: 'hsl(var(--blue-gray-50))',
          75: 'hsl(var(--blue-gray-75))',
          100: 'hsl(var(--blue-gray-100))',
          500: 'hsl(var(--blue-gray-500))',
          600: 'hsl(var(--blue-gray-600))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      boxShadow: {
        'chat-container': '0px 24px 60px 0px rgba(0, 0, 0, 0.10)',
        'container':
          '0px 1.43897px 2.21381px rgba(28, 42, 71, 0.02), 0px 3.45805px 5.32008px rgba(28, 42, 71, 0.02), 0px 6.51121px 10.01724px rgba(28, 42, 71, 0.03), 0px 11.61488px 17.86905px rgba(28, 42, 71, 0.04), 0px 21.72436px 33.42209px rgba(28, 42, 71, 0.04), 0px 52px 80px rgba(28, 42, 71, 0.06)',
        'chat-message': '0px 2px 5px 0px rgba(31, 39, 52, 0.12)',
      },
      fontFamily: {
        sans: ['Inter', ...fontFamily.sans],
      },
      fontSize: {
        '0': ['0px', '0px'],
        // 'xl': ['1.125rem', '2rem'],
        '2xl': ['1.5rem', '2.5rem'],
        '3xl': ['1.75rem', '2.5rem'],
        '4xl': ['2.5rem', '3rem'],
        '5xl': ['3rem', '3.5rem'],
        '6xl': ['4rem', '4.5rem'],
      },
      letterSpacing: {
        tightest: '-0.0075rem',
      },
      keyframes: {
        'accordion-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: 0 },
        },
        'appear-from-bottom': {
          from: { transform: 'translateY(var(--chatbot-fixed-height))' },
          to: { transform: 'translateY(0)' },
        },
        'hide-to-bottom': {
          from: { transform: 'translateY(0)' },
          to: { transform: 'translateY(var(--chatbot-fixed-height))' },
        },
        'appear-from-right': {
          from: { transform: 'translate3d(var(--chatbot-fixed-width),0,0)' },
          to: { transform: 'translate3d(0,0,0)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'appear-from-bottom': 'appear-from-bottom 0.35s ease-in',
        'hide-to-bottom': 'hide-to-bottom 0.35 ease-out',
        'appear-from-right': 'appear-from-right 0.35s ease-in',
      },
      transitionProperty: {
        width: 'width',
      },
    },
  },
  plugins: [
    plugin(function ({ addComponents, theme }) {
      console.log(theme);
      addComponents({
        '.h1': {
          '@apply text-[4rem] leading-[4.5rem] font-bold -tracking-[0.03em]': {},
        },
        '.h2': {
          '@apply text-[3rem] leading-[3.5rem] font-bold -tracking-[.02em]': {},
        },
        '.h3': {
          '@apply text-[2.5rem] leading-[3rem] font-bold -tracking-[.05em]': {},
        },
        '.h4': {
          '@apply text-[1.75rem] leading-[2.5rem] font-bold -tracking-[.01em]': {},
        },
        '.h5': {
          '@apply text-[1.5rem] leading-[2.5rem] font-semibold -tracking-[.03em]': {},
        },
        '.h6': {
          '@apply text-[1.25rem] leading-[2rem] font-semibold -tracking-[.02em]': {},
        },
        '.h7': {
          '@apply text-[1.125rem] font-semibold -tracking-[.02em]': {},
        },
        '.body1': {
          '@apply text-[1.375rem] leading-[2.1875rem]': {},
        },
        '.body2': {
          '@apply text-[0.9375rem] leading-[1.5rem]': {},
        },
        '.body2-bold': {
          '@apply text-[0.9375rem] leading-[1.5rem] font-semibold': {},
        },
        '.body3': {
          '@apply text-[0.875rem] leading-[1.5rem] -tracking-[.01em]': {},
        },
        '.base1': {
          '@apply text-[1rem] leading-[1.5rem] font-semibold -tracking-[.01em]': {},
        },
        '.base2': {
          '@apply text-[0.875rem] leading-[1.25rem] -tracking-[.01em]': {},
        },
        '.base2-small': {
          '@apply text-[0.875rem] leading-[1.25rem] -tracking-[.01em]': {},
        },
        '.base2-semibold': {
          '@apply text-[0.875rem] leading-[1.25rem] font-semibold -tracking-[.01em]': {},
        },
        '.caption1': {
          '@apply text-[0.75rem] leading-[0.6563rem] -tracking-[.01em]': {},
        },
        '.caption1-semibold': {
          '@apply text-[0.75rem] leading-[0.9375rem] font-semibold -tracking-[.01em]': {},
        },
        '.caption2': {
          '@apply text-[0.6875rem] leading-[1rem] -tracking-[.01em]': {},
        },
      });
    }),
    require('tailwindcss-animate'),
    require('@tailwindcss/container-queries'),
  ],
};
