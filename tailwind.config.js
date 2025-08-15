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
				visby: ['DM sans', 'roboto'],
				visby_mid: ['DM sans', 'roboto'],
				visby_bold: ['DM sans','roboto']
			}
		}
	},
	plugins: []
};
