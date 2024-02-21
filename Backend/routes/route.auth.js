const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.sendStatus(401); // Unauthorized if token is not provided
  }

  jwt.verify(token, process.env.SECRET_TOKEN, (err, user) => {
    if (err) {
      return res.sendStatus(403); // Forbidden if token is invalid
    }
    req.user = user; // Attach user object to the request for further use
    next(); // Proceed to the next middleware
  });
};

module.exports = authenticateToken;