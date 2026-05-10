import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.{js,jsx,ts,tsx}',
    ],

    theme: {
        extend: {
            colors: {
                'wise-black': '#0e0f0c',
                'wise-green': '#9fe870',
                'wise-dark-green': '#163300',
                'wise-mint': '#e2f6d5',
                'wise-pastel': '#cdffad',
                'wise-positive': '#054d28',
                'wise-danger': '#d03238',
                'wise-warning': '#ffd11a',
                'wise-orange': '#ffc091',
                'wise-warm-dark': '#454745',
                'wise-gray': '#868685',
                'wise-light': '#e8ebe6',
                'wise-bg': '#f9fbf7',
                'wise-surface': '#ffffff',
            },
        },
    },

    plugins: [forms],
};
