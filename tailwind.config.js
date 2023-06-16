/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./app/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {},
	},
	plugins: [
		require("tailwind-scrollbar"),
		require("tailwind-scrollbar-hide"),
		require("@tailwindcss/forms"),
	],
	variants: {
		backgroundColor: ["odd"],
	},
};
