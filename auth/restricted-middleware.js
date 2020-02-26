const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/secrets');

module.exports = (req, res, next) => {
  // Checks if token is good
  // (UNSPOKEN RULE) Token is normally sent in the authorization header
  const token = req.headers.authorization; 

  if(token) {
    // verify method expects a token (that is in the authorization)
    // when SIGNING we needed to provide a secret. We also need a secret when VERIFYING. These two secrets must be the same
    // A token you produce in development with a particular secret, if you try to check for the token in production and the secret is different it will fail
    jwt.verify(token, jwtSecret, (err, decodedToken) => {
      if(err) {
        // There is a problem with the token, it is not valid
        res.status(401).json({ message: 'Token is bad' })
      } else {
        req.decodedToken = decodedToken;
        next();
      }
    })
  } else {
    res.status(401).json({ message: 'You shall not pass' })
  }
};
