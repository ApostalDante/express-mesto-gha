const { celebrate, Joi } = require('celebrate');

const regex = /^(https?:\/\/)?[^\s]*\.(jpeg|png|ico|gif|webp|bmp|test)$/;

const validateCreateUser = celebrate({
  body: Joi.object().keys({
    email: Joi.string().min(4).email()
      .required(),
    password: Joi.string()
      .required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(regex),
  }),
});

const validateUser = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex().length(24)
      .required(),
  }),
});

const validateUpdateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30)
      .required(),
    about: Joi.string().min(2).max(30)
      .required(),
  }),
});

const validateUpdateUserAvatar = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().min(4).pattern(regex)
      .required(),
  }),
});

const validateLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().min(4).email()
      .required(),
    password: Joi.string()
      .required(),
  }),
});

const validateCreateCard = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30)
      .required(),
    link: Joi.string().pattern(regex)
      .required(),
  }),
});

const validateCard = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24)
      .required(),
  }),
});

module.exports = {
  validateCreateUser,
  validateUser,
  validateUpdateUser,
  validateUpdateUserAvatar,
  validateLogin,
  validateCreateCard,
  validateCard,
};
