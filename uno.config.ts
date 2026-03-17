import { defineConfig, presetIcons, presetUno, presetWebFonts } from 'unocss'

export default defineConfig({
  presets: [
    presetUno({ dark: 'class' }),
    presetIcons({
      scale: 1.2,
      warn: true,
    }),
    presetWebFonts({
      fonts: {
        sans: 'Inter:300,400,500,600,700',
        mono: 'JetBrains Mono:400,500',
        display: 'Cormorant Garamond:300,400,500,600,700',
      },
    }),
  ],

  theme: {
    colors: {
      // Apple color palette
      apple: {
        blue: '#0071e3',
        'blue-hover': '#0077ed',
        'blue-light': '#e8f1fb',
      },
      // Surfaces — light
      surface: {
        DEFAULT: '#ffffff',
        secondary: '#f5f5f7',   // Apple light gray sections
        tertiary: '#e8e8ed',    // Subtle borders/dividers
      },
      // Surfaces — dark
      dark: {
        DEFAULT: '#000000',
        secondary: '#1d1d1f',   // Apple dark sections
        tertiary: '#2d2d2f',    // Cards on dark
        elevated: '#3a3a3c',    // Elevated surfaces
      },
      // Text
      label: {
        primary: '#1d1d1f',     // Apple primary text
        secondary: '#6e6e73',   // Apple secondary text
        tertiary: '#ababab',    // Muted text
        'primary-dark': '#f5f5f7',
        'secondary-dark': '#a1a1a6',
        'tertiary-dark': '#6e6e73',
      },
      // Theme CSS variable tokens (from theme.css)
      background: 'var(--background)',
      foreground: 'var(--foreground)',
      card: { DEFAULT: 'var(--card)', foreground: 'var(--card-foreground)' },
      popover: { DEFAULT: 'var(--popover)', foreground: 'var(--popover-foreground)' },
      primary: { DEFAULT: 'var(--primary)', foreground: 'var(--primary-foreground)' },
      secondary: { DEFAULT: 'var(--secondary)', foreground: 'var(--secondary-foreground)' },
      muted: { DEFAULT: 'var(--muted)', foreground: 'var(--muted-foreground)' },
      accent: { DEFAULT: 'var(--accent)', foreground: 'var(--accent-foreground)' },
      destructive: { DEFAULT: 'var(--destructive)', foreground: 'var(--destructive-foreground)' },
      border: 'var(--border)',
      input: 'var(--input)',
      ring: 'var(--ring)',
      chart: {
        1: 'var(--chart-1)',
        2: 'var(--chart-2)',
        3: 'var(--chart-3)',
        4: 'var(--chart-4)',
        5: 'var(--chart-5)',
      },
      sidebar: {
        DEFAULT: 'var(--sidebar)',
        foreground: 'var(--sidebar-foreground)',
        primary: 'var(--sidebar-primary)',
        'primary-foreground': 'var(--sidebar-primary-foreground)',
        accent: 'var(--sidebar-accent)',
        'accent-foreground': 'var(--sidebar-accent-foreground)',
        border: 'var(--sidebar-border)',
        ring: 'var(--sidebar-ring)',
      },
    },
    borderRadius: {
      DEFAULT: 'var(--radius)',
    },
    animation: {
      keyframes: {
        'fade-in': '{from{opacity:0}to{opacity:1}}',
        'fade-up': '{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}',
        'fade-down': '{from{opacity:0;transform:translateY(-20px)}to{opacity:1;transform:translateY(0)}}',
        'slide-in-right': '{from{opacity:0;transform:translateX(40px)}to{opacity:1;transform:translateX(0)}}',
        'slide-in-left': '{from{opacity:0;transform:translateX(-40px)}to{opacity:1;transform:translateX(0)}}',
        'scale-in': '{from{opacity:0;transform:scale(0.9)}to{opacity:1;transform:scale(1)}}',
        'float': '{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}',
        'shimmer': '{from{background-position:-200% 0}to{background-position:200% 0}}',
        'spin-slow': '{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}',
      },
      durations: {
        'fade-in': '0.4s',
        'fade-up': '0.5s',
        'fade-down': '0.5s',
        'slide-in-right': '0.5s',
        'slide-in-left': '0.5s',
        'scale-in': '0.3s',
        'float': '3s',
        'shimmer': '2s',
        'spin-slow': '8s',
      },
      timingFns: {
        'fade-in': 'ease-out',
        'fade-up': 'cubic-bezier(0.16,1,0.3,1)',
        'fade-down': 'cubic-bezier(0.16,1,0.3,1)',
        'slide-in-right': 'cubic-bezier(0.16,1,0.3,1)',
        'slide-in-left': 'cubic-bezier(0.16,1,0.3,1)',
        'scale-in': 'cubic-bezier(0.16,1,0.3,1)',
        'float': 'ease-in-out',
        'shimmer': 'linear',
        'spin-slow': 'linear',
      },
      counts: {
        'float': 'infinite',
        'shimmer': 'infinite',
        'spin-slow': 'infinite',
      },
    },
  },

  shortcuts: {
    // Layout
    'container-base': 'max-w-[980px] mx-auto px-6 lg:px-8',

    // Typography — Apple style (tight tracking, SF weights)
    'text-heading-1': 'font-sans text-[56px] lg:text-[80px] font-semibold tracking-[-0.003em] leading-[1.05]',
    'text-heading-2': 'font-sans text-[40px] lg:text-[56px] font-semibold tracking-[-0.003em] leading-[1.07]',
    'text-heading-3': 'font-sans text-[28px] lg:text-[32px] font-semibold tracking-tight leading-snug',
    'text-body': 'font-sans text-[17px] leading-[1.47059] font-normal',
    'text-muted': 'text-label-secondary dark:text-label-secondary-dark',

    // Cards
    'card-base': 'rounded-[18px] bg-surface-secondary dark:bg-dark-secondary',
    'card-hover': 'transition-all duration-300 hover:shadow-xl hover:-translate-y-1',

    // Buttons — Apple style
    'btn-base': 'inline-flex items-center gap-2 font-sans font-normal transition-all duration-200 cursor-pointer',
    'btn-primary': 'btn-base bg-apple-blue text-white hover:bg-apple-blue-hover px-[18px] py-[8px] rounded-full text-[17px]',
    'btn-secondary': 'btn-base text-apple-blue dark:text-apple-blue hover:underline text-[17px]',
    'btn-ghost': 'btn-base hover:bg-surface-tertiary dark:hover:bg-dark-tertiary px-3 py-2 rounded-lg',

    // Nav
    'nav-link': 'text-[12px] font-normal text-label-secondary dark:text-label-secondary-dark hover:text-label-primary dark:hover:text-label-primary-dark transition-colors duration-200 cursor-pointer',

    // Focus
    'focus-ring': 'focus:outline-none focus-visible:ring-2 focus-visible:ring-apple-blue focus-visible:ring-offset-2',
  },
})
