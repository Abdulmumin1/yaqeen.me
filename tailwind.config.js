/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.svelte', './src/**/*.css'],
	darkMode: 'class',
	theme: {
		extend: {
			fontFamily: {
				visby: ['visby', 'roboto'],
				visby_mid: ['visby', 'roboto'],
				visby_bold: ['visby', 'roboto']
			}
		}
	},
	plugins: []
};
