const jwt = require('jsonwebtoken');

const getToken = (req) => {
  if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
    return req.headers.authorization.split(' ')[1];
  }
  return null;
};

// eslint-disable-next-line consistent-return
const verifyToken = async (req, res, next) => {
  const token = getToken(req);

  if (token) {
    try {
      const decoded = await jwt.verify(token, process.env.JWT_SECRET);

      req.user = {
        userId: decoded.userId,
        name: decoded.name,
        role: decoded.role,
      };
      next();
    } catch (e) {
      if (e.name === 'TokenExpiredError') {
        return res.status(400).json({ status: 'Expired token' });
      }
      return res.status(400).json({ status: 'Invalid token' });
    }
  } else {
    return res.status(400).json({ status: 'No token provided' });
  }
};

module.exports = { verifyToken };
