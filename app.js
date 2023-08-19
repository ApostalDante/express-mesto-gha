const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.set('strictQuery', false);
mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use((req, res, next) => {
  req.user = {
    _id: '64e12143f0c7975bfc69bfd3',
  };
  next();
});

app.use(express.json());

app.use(routes);

app.listen(PORT, () => {
  console.log(`Адрес сервера — http://localhost:${PORT}`);
});
