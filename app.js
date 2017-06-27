const dotenv = require('dotenv');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const router = require('./router');

// Dotenv config
dotenv.config();

// Express Instance
const app = express();

// Express Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use('/', router);

// Run the API
app.listen(process.env.API_PORT, () => {
  console.log(`API is running on port ${process.env.API_PORT}`);
});
