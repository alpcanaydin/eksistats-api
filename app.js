const dotenv = require('dotenv');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const monk = require('monk');

const router = require('./router');

// Dotenv config
dotenv.config();

// DB instance
const db = monk(`${process.env.MONGO_HOST}/${process.env.MONGO_DB}`);

// Express Instance
const app = express();

// Express Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use((req, res, next) => {
  req.db = db;
  next();
});
app.use('/', router);

// Run the API
app.listen(process.env.API_PORT, () => {
  console.log(`API is running on port ${process.env.API_PORT}`);
});
