const router = require('express').Router();
const { validateCreateUser, validateLogin } = require('../utils/validator');
const { createUser, login } = require('../controllers/users');
const { auth } = require('../middlewares/auth');
const usersRouter = require('./users');
const cardsRouter = require('./cards');
const NotFound = require('../utils/errors/NotFound');

router.post('/signup', validateCreateUser, createUser);
router.post('/signin', validateLogin, login);

router.use(auth);

router.use('/users', usersRouter);
router.use('/cards', cardsRouter);

router.use('*', (req, res, next) => {
  next(new NotFound('Сервер не найден'));
});

module.exports = router;
