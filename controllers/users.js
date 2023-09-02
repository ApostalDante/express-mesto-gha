const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const BadRequest = require('../utils/errors/BadRequest');
const NotFound = require('../utils/errors/NotFound');
const ConflictingBadRequest = require('../utils/errors/ConflictingBadRequest');
const { JWT_SECRET } = require('../middlewares/auth');

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => res.status(201).send(user))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные при создании пользователя'));
      } else if (error.code === 11000) {
        next(new ConflictingBadRequest('Пользователь с указанной почтой уже есть в системе'));
      } else {
        next(error);
      }
    });
};

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};

const getUserId = (req, res, next) => {
  const { userId } = req.params;
  return User.findById(userId)
    .orFail(() => new NotFound('NotFound'))
    .then((user) => res.send(user))
    .catch((error) => {
      if (error.name === 'CastError') {
        next(new BadRequest('Переданы некорректные данные'));
      } else if (error.message === 'NotFound') {
        next(new NotFound(`Пользователь по указанному _id ${userId} не найден`));
      } else {
        next(error);
      }
    });
};

const updateUser = (req, res, next) => {
  const { name, about } = req.body;
  return User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  ).orFail(() => new NotFound('NotFound'))
    .then((user) => res.send(user))
    .catch((error) => {
      if (error.name === 'ValidationError' || error.name === 'CastError') {
        next(new BadRequest('Переданы некорректные данные при обновлении профиля'));
      } else if (error.message === 'NotFound') {
        next(new NotFound(`Пользователь с указанным _id ${req.user._id} не найден`));
      } else {
        next(error);
      }
    });
};

const updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  return User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  ).orFail(() => new NotFound('NotFound'))
    .then((user) => res.send(user))
    .catch((error) => {
      if (error.name === 'ValidationError' || error.name === 'CastError') {
        next(new BadRequest('Переданы некорректные данные при обновлении аватара'));
      } else if (error.message === 'NotFound') {
        next(new NotFound(`Пользователь с указанным _id ${req.user._id} не найден`));
      } else {
        next(error);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
      res.send({ token });
    })
    .catch((error) => next(error));
};

const getUser = (req, res, next) => {
  const userId = req.user._id;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        next(new NotFound('Профиль не найден'));
      } else { res.send(user); }
    })
    .catch((error) => next(error));
};

module.exports = {
  createUser,
  getUsers,
  getUserId,
  updateUser,
  updateUserAvatar,
  login,
  getUser,
};
