const Card = require('../models/card');
const BadRequest = require('../utils/errors/BadRequest');
const NotFound = require('../utils/errors/NotFound');
const Forbidden = require('../utils/errors/Forbidden');

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  return Card.create({ name, link, owner })
    .then((card) => res.send(card))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные при создании карточки'));
      } else {
        next(error);
      }
    });
};

const getCards = (req, res, next) => {
  Card.find({})
    .then((card) => res.send(card))
    .catch((error) => next(error));
};

const deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  return Card.findById(cardId)
    .orFail(() => new NotFound('NotFound'))
    .then((card) => {
      if (card.owner.toString() !== req.user._id) {
        return next(new Forbidden('Удаление невозможно'));
      }
      return Card.findByIdAndRemove(cardId).then(() => res.send(card));
    })
    .catch(next);
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  ).orFail(() => new NotFound('NotFound'))
    .then((card) => res.send(card))
    .catch((error) => {
      if (error.name === 'CastError') {
        next(new BadRequest('Переданы некорректные данные для постановки лайка'));
      } else if (error.message === 'NotFound') {
        next(new NotFound(`Передан несуществующий _id ${req.params.cardId} карточки`));
      } else {
        next(error);
      }
    });
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  ).orFail(() => new NotFound('NotFound'))
    .then((card) => res.send(card))
    .catch((error) => {
      if (error.name === 'CastError') {
        next(new BadRequest('Переданы некорректные данные для снятия лайка'));
      } else if (error.message === 'NotFound') {
        next(new NotFound(`Передан несуществующий _id ${req.params.cardId} карточки`));
      } else {
        next(error);
      }
    });
};

module.exports = {
  createCard,
  getCards,
  deleteCard,
  likeCard,
  dislikeCard,
};
