const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer')
const User = require('../model/user');

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'yodawy.new.task@gmail.com',
    pass: 'ynt123456789'
  }
});

router.post('/register', (req, res) => {
  let { userName, email, birthDate } = req.body;

  if (!userName || !email || !birthDate) {
    res.status(400).json({ msg: 'Bad request' });
  }
  else {
    let password = makeRandom();
    let hashPassword = bcrypt.hashSync(password, 10);
    email = email.toLowerCase()
    let user = new User({ userName, email, password: hashPassword, birthDate });
    user.save((err, registerUser) => {
      if (err) {
        if (err.code == 11000) {
          res.status(409).json({ msg: 'The email is already exsit' });
        } else {
          res.status(500).json({ msg: 'Internal server error', err });
        }
      } else {
        var mailOptions = {
          from: 'yodawy.new.task@gmail.com',
          to: email,
          subject: 'News app task',
          text: `Hello ${userName},
          We are so happy for your interest to register with our app,
          
          please use this credentials for login: 
          Email: ${email}
          password: ${password}
          
          Thank you`
        };

        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
            res.status(500).json({ msg: 'Internal server error', error });
          } else {
            res.status(200).json({ msg: 'Please check your mail', password });
          }
        });
      }
    });
  }
});


router.post('/login', (req, res) => {
  let { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ msg: 'Bad request' });
  }
  else {
    email = email.toLowerCase()
    User.findOne({ email }, (err, user) => {
      if (err) {
        res.status(500).json({ msg: 'Internal server error' });
      } else {
        if (user) {
          if (!bcrypt.compareSync(password, user.password)) {
            return res.status(401).json({ msg: 'Invalid password' });
          }
          let payload = { subject: user._id }
          let token = jwt.sign(payload, 'secretKey')
          res.status(200).send({ token, id: user._id, userName: user.userName });
        } else {
          res.status(401).json({ msg: 'Invalid email' });
        }
      }
    });
  }
});

//for testing
router.delete('/delete/:id', (req, res) => {
  const { id } = req.params;

  User.deleteOne({ _id: id }, (err, data) => {
    if (err) {
      res.status(500).send('Internal server error');
    } else {
      res.status(200).json({ msg: 'User deleted successfully' })
    }
  })
})




module.exports = router;

function makeRandom() {
  let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890/[]\=-)(*&^%$#@!~0123456789";
  const lengthOfCode = 10;
  let text = "";
  for (let i = 0; i < lengthOfCode; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}