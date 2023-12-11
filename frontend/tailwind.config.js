/** @type {import('tailwindcss').Config} */
export default {
	content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
	theme: {
		fontFamily: {
			sans: ['Open Sans', 'sans-serif'],
			bold: ['Roboto bold', 'sans-serif'],
		},
		extend: {
			rotate: {
				135: '135deg',
			},
			colors: {
				metropoliaMainOrange: '#ff5000',
				metropoliaSecondaryOrange: '#e54b00',
				metropoliaMainGrey: '#53565a',
				metropoliaSupportWhite: '#ffffff',
				metropoliaSupportBlack: '#000000',
				metropoliaSupportRed: '#cb2228',
				metropoliaSupportBlue: '#4046a8',
				metropoliaSupportYellow: '#fff000',
				metropoliaTrendPink: '#e384c4',
				metropoliaTrendLightBlue: '#5db1e4',
				metropoliaTrendGreen: '#3ba88f',
			},
			animation: {
				spin: 'spin 2s linear infinite',
				backandforth: 'backandforth 60s linear infinite',
			},

			inset: {
				10: '10%',
				20: '20%',
				30: '30%',
				40: '40%',
				50: '50%',
				60: '60%',
				70: '70%',
				80: '80%',
				90: '90%',
				100: '100%',
			},

			keyframes: {
				backandforth: {
					'0%, 100%': {transform: 'translateX(-10%)'},
					'50%': {transform: 'translateX(90%)'},
				},
			},
		},
	},
	plugins: [],
};
