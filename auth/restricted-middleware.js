const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/secrets')
// const bcrypt = require('bcryptjs');
// const Users = require('../users/users-model.js');

module.exports = (req, res, next) => {
  const token = req.headers.authorization;

  if (token){
    // check the token is valid
    jwt.verify(token, jwtConfig.jwtSecret, (err, decodedToken) => {
      
      if(err){
        // foul play
        res.status(401).json({message: "Bad panda!!!"})
      } else {
        // Token is gooooooooooood
        req.username = decodedToken.username;
        next();
      }

    })
  } else {
    res.status(400).json({ message: 'No credentials provided' });
  }
};
