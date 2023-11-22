const fs = require('fs');
const path = require('path');

const date = new Date().toISOString();
const envFilePath = path.resolve(__dirname, '.env');

fs.appendFileSync(envFilePath, `\nVITE_REACT_APP_BUILD_DATE=${date}`);
