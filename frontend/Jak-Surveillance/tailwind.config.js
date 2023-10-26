/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{js,jsx,ts,tsx}'],
	theme: {
		extend: {
			colors: {
				metropoliaMainOrange: '#ff5000',
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
		},
	},
	plugins: [],
};
