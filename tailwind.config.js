/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.svelte', './src/**/*.css'],
	darkMode: 'class',
	theme: {
		extend: {
			colors: {
				orang: 'theme(colors.orange.500)',
				dark: 'theme(colors.orange.700)'
			},
			fontFamily: {
				visby: ['visby', 'roboto'],
				visby_mid: ['visby', 'roboto'],
				visby_bold: ['visby', 'roboto']
			}
		}
	},
	plugins: []
};
