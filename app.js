const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const routes = require('./routes');
const errorHandler = require('./middlewares/errorHandler');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.set('strictQuery', false);
mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use(express.json());

app.use(routes);

app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Адрес сервера — http://localhost:${PORT}`);
});

/*
Спасибо, что верите в мои силы сделать все комментарии "можно лучше".
Но к сожалению сейчас не позволяет время, нужно успеть сделать 15 проектную работу до дедлайна.
Но позже я вернусь к этой ПР и сделаю все комментарии "можно лучше".
PS: позже удалю это из проекта.
*/
