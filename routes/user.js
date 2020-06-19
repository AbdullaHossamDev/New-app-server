const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../model/user');

router.post('/register', (req, res) => {
  let { userName, email, password, birthDate } = req.body;

  if (!userName || !email || !password || !birthDate) {
    res.status(400).json({msg:'Bad request'});
  }
  else {
    password = bcrypt.hashSync(password, 10);
    let user = new User({ userName, email, password, birthDate });
    user.save((err, registerUser) => {
      if (err) {
        if (err.code == 11000) {
          res.status(409).json({msg:'The email is already exsit'});
        } else {
          res.status(500).json({msg:'Internal server error', err});
        }
      } else {
        let payload = { subject: registerUser._id }
        let token = jwt.sign(payload, 'secretKey')
        res.status(200).send({ token, id: registerUser._id, userName: registerUser.userName });
      }
    });
  }
});


router.post('/login', (req, res) => {
  let { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({msg:'Bad request'});
  }
  else {
    User.findOne({ email }, (err, user) => {
      if (err) {
        res.status(500).json({msg:'Internal server error'});
      } else {
        if (user) {
          if (!bcrypt.compareSync(password, user.password)) {
            return res.status(401).json({msg:'Invalid password'});
          }
          let payload = { subject: user._id }
          let token = jwt.sign(payload, 'secretKey')
          res.status(200).send({ token, id: user._id, userName: user.userName });
        } else {
          res.status(401).json({msg:'Invalid email'});
        }
      }
    });
  }
});




module.exports = router;
