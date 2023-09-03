const router = require('express').Router();

const {
  createCard,
  getCards,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

const {
  validateCreateCard,
  validateCard,
} = require('../utils/validation');

router.get('/', getCards);
router.post('/', validateCreateCard, createCard);
router.delete('/:cardId', validateCard, deleteCard);
router.put('/:cardId/likes', validateCard, likeCard);
router.delete('/:cardId/likes', validateCard, dislikeCard);

module.exports = router;
