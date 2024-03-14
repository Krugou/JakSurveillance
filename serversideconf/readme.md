# Server Side Configuration

This repository contains the configuration files for the server running on Azure.

## Setup

### Server SSL Configuration

```apacheconf
<VirtualHost *:443>
    ServerAdmin webmaster@localhost.com

    ErrorLog ${APACHE_LOG_DIR}/error.log
    CustomLog ${APACHE_LOG_DIR}/access.log combined

    ProxyPass /api/ http://localhost:3002/
    ProxyPassReverse /api/ http://localhost:3002/
    ProxyPass / http://localhost:3001/
    ProxyPassReverse / http://localhost:3001/

    RewriteEngine on
    RewriteCond %{HTTP:Upgrade} WebSocket [NC]
    RewriteCond %{HTTP:Connection} upgrade [NC]
    RewriteRule ^/api/?(.*) "ws://localhost:3002/$1" [P,L]

    ServerName jaksec.northeurope.cloudapp.azure.com
    Include /etc/letsencrypt/options-ssl-apache.conf
    SSLCertificateFile /etc/letsencrypt/live/jaksec.northeurope.cloudapp.azure.com/fullchain.pem
    SSLCertificateKeyFile /etc/letsencrypt/live/jaksec.northeurope.cloudapp.azure.com/privkey.pem
</VirtualHost>

```

### pm2 config

[ecosystem.config.cjs](../backend/ecosystem.config.cjs)

```javascript
module.exports = {
	apps: [
		{
			name: 'FileServer', // Application name
			script: './nodejs/jaksecfileserver.js', // Script to be run
			watch: false, // Don't watch this app
			min_uptime: 10000, // Minimum time to keep the process alive
			ignore_watch: ['node_modules', 'logs', 'package-lock.json'], // Ignore watch on jaksec folder to avoid infinite loop
			watch_delay: 3000,
			cron_restart: '0 0 * * *', // Reboot at midnight
		},
		{
			name: 'WSDBServer', // Application name
			script: './nodejs/jaksecserver.js', // Script to be run
			watch: false, // Don't watch this app
			min_uptime: 10000, // Minimum time to keep the process alive
			ignore_watch: ['node_modules', 'logs', 'package-lock.json', 'jaksec'], // Ignore watch on jaksec folder to avoid infinite loop
			watch_delay: 3000, // Delay between restart
			cron_restart: '0 0 * * *', // Reboot at midnight
		},
	],
};
```
