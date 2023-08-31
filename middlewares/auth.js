const jwt = require('jsonwebtoken');
const Unauthorized = require('../utils/errors/Unauthorized');

const { JWT_SECRET = 'SECRET_KEY' } = process.env;

const auth = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new Unauthorized('Необходима авторизация'));
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (error) {
    next(new Unauthorized('Необходима авторизация'));
  }
  req.user = payload;
  next();
};

module.exports = {
  auth,
  JWT_SECRET,
};