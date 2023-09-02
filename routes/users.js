const router = require('express').Router();

const {
  getUsers,
  getUser,
  getUserId,
  updateUser,
  updateUserAvatar,
} = require('../controllers/users');

const {
  validateUser,
  validateUpdateUser,
  validateUpdateUserAvatar,
} = require('../utils/validation');

router.get('/', getUsers);
router.get('/me', getUser);
router.get('/:userId', validateUser, getUserId);
router.patch('/me', validateUpdateUser, updateUser);
router.patch('/me/avatar', validateUpdateUserAvatar, updateUserAvatar);

module.exports = router;
