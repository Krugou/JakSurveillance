const fs = require('fs');
const path = require('path');

const date = new Date().toISOString();
const envFilePath = path.resolve(__dirname, '.env');

let envContent = fs.readFileSync(envFilePath, 'utf8');
envContent = envContent.replace(/VITE_REACT_APP_BUILD_DATE=.*\n/g, '');
envContent += `VITE_REACT_APP_BUILD_DATE=${date}\n`;

fs.writeFileSync(envFilePath, envContent);
