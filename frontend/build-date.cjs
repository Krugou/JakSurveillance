const fs = require('fs');
const path = require('path');

const date = new Date().toISOString();
const envFilePathCurrent = path.resolve(__dirname, '.env');
const envFilePathBackend = path.resolve(__dirname, '../backend/.env');

// Check if .env file exists in the current directory, if not, create it
if (!fs.existsSync(envFilePathCurrent)) {
  fs.writeFileSync(envFilePathCurrent, '');
}

// Check if .env file exists in the backend directory, if not, create it
if (!fs.existsSync(envFilePathBackend)) {
  fs.writeFileSync(envFilePathBackend, '');
}

// Read and update .env file in the current directory
let envContentCurrent = fs.readFileSync(envFilePathCurrent, 'utf8');
envContentCurrent = envContentCurrent.replace(
  /VITE_REACT_APP_BUILD_DATE=.*\n/g,
  '',
);
envContentCurrent += `VITE_REACT_APP_BUILD_DATE=${date}\n`;
fs.writeFileSync(envFilePathCurrent, envContentCurrent);

// Read and update .env file in the backend directory
let envContentBackend = fs.readFileSync(envFilePathBackend, 'utf8');
envContentBackend = envContentBackend.replace(
  /VITE_REACT_APP_BUILD_DATE=.*\n/g,
  '',
);
envContentBackend += `VITE_REACT_APP_BUILD_DATE=${date}\n`;
fs.writeFileSync(envFilePathBackend, envContentBackend);
