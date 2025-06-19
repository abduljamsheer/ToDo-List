
const jwt = require('jsonwebtoken');
const PRIVATE_KEY =
//  process.env.JWT_SECRET ||
 'abdul@123';

module.exports = function (req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(403).json({ message: "Token missing or invalid" });
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(token, PRIVATE_KEY, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Invalid token" });

    req.userId = decoded.userId;
    next();
  });
};
