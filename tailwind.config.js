/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Indian Flag inspired color palette
        saffron: {
          50: '#FFF5E6',
          100: '#FFE5CC',
          200: '#FFD199',
          300: '#FF9933',  // Main saffron
          400: '#FF8000',
          500: '#E67300',
          600: '#CC6600',
          700: '#B35900',
          800: '#994D00',
          900: '#804000',
        },
        'india-green': {
          50: '#E8F5E8',
          100: '#CDE6CD',
          200: '#A3D3A3',
          300: '#6BB86B',
          400: '#419641',
          500: '#138808',  // Main India green
          600: '#0F6B0F',
          700: '#0C550C',
          800: '#094009',
          900: '#062B06',
        },
        'navy-blue': {
          50: '#E6E6FF',
          100: '#CCCCFF',
          200: '#9999FF',
          300: '#6666FF',
          400: '#3333FF',
          500: '#000080',  // Main navy blue
          600: '#000066',
          700: '#00004D',
          800: '#000033',
          900: '#00001A',
        },
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))'
        }
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      }
    }
  },
  plugins: [],
}
