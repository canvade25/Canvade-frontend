const fs = require('fs');

const serverFile = '/Users/store/CanvadeBackend/server.js';
let content = fs.readFileSync(serverFile, 'utf8');

content = content.replace(/max: 150,/g, 'max: 150000,');
content = content.replace(/max: 20,/g, 'max: 20000,');

fs.writeFileSync(serverFile, content, 'utf8');
console.log("Rate limits increased in server.js");
