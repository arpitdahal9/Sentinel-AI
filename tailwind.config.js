/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./App.tsx",
        "./components/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                maroon: {
                    50: '#fdf2f2',
                    100: '#fbe4e4',
                    200: '#f7cfcf',
                    300: '#f0acac',
                    400: '#e37d7d',
                    500: '#d35252',
                    600: '#be3838',
                    700: '#9f2b2b',
                    800: '#842626',
                    900: '#702424',
                    950: '#3d0f0f',
                },
            },
            fontFamily: {
                sans: ['Outfit', 'sans-serif'],
                mono: ['JetBrains Mono', 'monospace'],
            },
        },
    },
    plugins: [],
}
