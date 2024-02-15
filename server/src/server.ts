import app from './app';
const ngrok = require("@ngrok/ngrok");
require('dotenv').config();

const PORT = 8080;
app.listen(PORT);
console.log(`Running in port ${PORT}`);

ngrok.connect({ addr: 8080, authtoken_from_env: true })
    .then(listener => console.log(`Ingress established at: ${listener.url()}`));

