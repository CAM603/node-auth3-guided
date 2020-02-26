- Install `npm i jsonwebtoken`
- Require `const jwt = require('jsonwebtoken');` in `auth-router.js`
- Sign the token after successful login
    * inside the login route above `res.status(200)` add `const token = generateToken(user)`
    * create the `generateToken()` function
```js
function generateToken(user) {
  // Do not include sensitive information inside token
  const payload = {
    subject: user.id, // sub property in the header of the token
    username: user.username,
    // ...any other data you want
  }
  const secret = 'ICUP'; // This is the secret that only the server knows and this is how the server is going to sign the token and when the token comes back on a new request we will use this same secret to decode and verify that the token is correct and that it hasn't been tampered with in the client. This is how we protect it!
  const options = {
    // See more options on the JWT library -> https://jwt.io/
    expiresIn: '8h'
  }
  return jwt.sign(payload, secret, options)
}
```
- Add token to the response we are sending
```js
res.status(200).json({
          message: `Welcome ${user.username}!`,
          token,
        });
```

- Move gererateYoken() to `secrets.js` inside `config` folder

## 
- npm i dotenv
- Inside index.js `require('dotenv').config();` at very top
- Create .env file
    * inside add JWT_SECRET=I like pineapple on pizza