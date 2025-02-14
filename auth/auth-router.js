const router = require('express').Router();
const bcrypt = require('bcryptjs');
// bring in jwt
const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/secrets')
const Users = require('../users/users-model.js');

// Create a JWT
function generateToken(usr){
  
  const payload = {
    subject: usr.id,
    username: usr.username,
  }

  const options = {
    expiresIn: "1h",
  }


  return jwt.sign(payload, jwtConfig.jwtSecret, options)
}

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

router.post('/login', (req, res) => {
  let { username, password } = req.body;

  Users.findBy({ username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        
        // create a token
        const token = generateToken(user)

        // add token to the res
        res.status(200).json({
          message: `Welcome ${user.username}!`,
          token: token // add in the created token
        });
      } else {
        res.status(401).json({ message: 'Invalid Credentials' });
      }
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

module.exports = router;
