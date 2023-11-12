# Server Side Configuration

This repository contains the configuration files for the server running on Azure.

## Setup

### Server SSL Configuration

```apacheconf
<VirtualHost *:443>
    ServerAdmin joonalam@metropolia.fi

    ErrorLog ${APACHE_LOG_DIR}/error.log
    CustomLog ${APACHE_LOG_DIR}/access.log combined

    ProxyPass /api/ http://localhost:3002/
    ProxyPassReverse /api/ http://localhost:3002/
    ProxyPass / http://localhost:3001/
    ProxyPassReverse / http://localhost:3001/

    RewriteEngine on
    RewriteCond %{HTTP:Upgrade} WebSocket [NC]
    RewriteCond %{HTTP:Connection} upgrade [NC]
    RewriteRule ^/api?(.*) "ws://localhost:3002/$1" [P,L]

    ServerName jaksec.northeurope.cloudapp.azure.com
    Include /etc/letsencrypt/options-ssl-apache.conf
    SSLCertificateFile /etc/letsencrypt/live/jaksec.northeurope.cloudapp.azure.com/fullchain.pem
    SSLCertificateKeyFile /etc/letsencrypt/live/jaksec.northeurope.cloudapp.azure.com/privkey.pem
</VirtualHost>

```

### pm2 config

```javascript
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
```
