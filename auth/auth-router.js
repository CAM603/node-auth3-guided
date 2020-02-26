const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Users = require('../users/users-model.js');
const secrets = require('../config/secrets');

// for endpoints beginning with /api/auth
router.post('/register', (req, res) => {
  let user = req.body;
  const hash = bcrypt.hashSync(user.password, 10); // 2 ^ n
  user.password = hash;

  Users.add(user)
    .then(saved => {
      res.status(201).json(saved);
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

/////////////////// BEFORE ///////////////////
// router.post('/login', (req, res) => {
//   let { username, password } = req.body;

//   Users.findBy({ username })
//     .first()
//     .then(user => {
//       if (user && bcrypt.compareSync(password, user.password)) {
//         res.status(200).json({
//           message: `Welcome ${user.username}!`,
//         });
//       } else {
//         res.status(401).json({ message: 'Invalid Credentials' });
//       }
//     })
//     .catch(error => {
//       res.status(500).json(error);
//     });
// });

/////////////////// AFTER ///////////////////
router.post('/login', (req, res) => {
  let { username, password } = req.body;

  Users.findBy({ username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        const token = generateToken(user) // Get token

        res.status(200).json({
          message: `Welcome ${user.username}!`,
          token, // Send token
        });
      } else {
        res.status(401).json({ message: 'Invalid Credentials' });
      }
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

function generateToken(user) {
  // Do not include sensitive information inside token
  const payload = {
    subject: user.id, // sub property in the header of the token
    username: user.username,
    role: user.role || 'user'
    // ...any other data you want
  }
  // const secret = 'ICUP' --> This is the secret that only the server knows and this is how the server is going to sign the token and when the token comes back on a new request we will use this same secret to decode and verify that the token is correct and that it hasn't been tampered with in the client. This is how we protect it!
  const options = {
    // See more options on the JWT library -> https://jwt.io/
    expiresIn: '8h'
  }
  return jwt.sign(payload, secrets.jwtSecret, options)
}

module.exports = router;
