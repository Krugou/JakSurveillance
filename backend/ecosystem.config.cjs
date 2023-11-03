module.exports = {
	apps: [
		{
			name: 'FileServer',
			script: './nodejs/jaksecfileserver.js',
			watch: true,
			min_uptime: 10000,
			ignore_watch: ['node_modules', 'logs', 'package-lock.json'],
			watch_delay: 3000,
		},
		{
			name: 'WSDBServer',
			script: './nodejs/jaksecserver.js',
			watch: true,
			min_uptime: 10000,
			ignore_watch: ['node_modules', 'logs', 'package-lock.json', 'jaksec'],
			watch_delay: 3000,
		},
	],
};
