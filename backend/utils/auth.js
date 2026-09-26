const jwt = require('jsonwebtoken');

const createToken = (user) => jwt.sign(
  { sub: user._id.toString(), role: user.role },
  process.env.JWT_SECRET,
  { expiresIn: '8h' }
);

const publicUser = (user) => {
  const value = user.toSafeObject ? user.toSafeObject() : user.toObject();
  delete value.password;
  return { ...value, id: value._id?.toString() || value.id };
};

module.exports = { createToken, publicUser };
