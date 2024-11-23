/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Poppins', 'sans-serif'], // Set Poppins as the default sans font
                poppins: ['Poppins', 'sans-serif'], // or create a custom `poppins` font family
            },
        },
    },
    plugins: [],
};
