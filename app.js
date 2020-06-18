const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const port = 3000;

const userRoutes = require('./routes/user');


const app = express();

app.use(cors());
app.use(bodyParser.json());

app.listen(port, () => console.log(`Server running on port ${port}`));

app.use('/user', userRoutes);





const mongoose = require('mongoose');
var db = ''
// process.env.ENV = 'Test';
if (process.env.ENV == 'Test') {
  db = "mongodb+srv://admin:admin@cluster0-idjkv.mongodb.net/yodawyDB?retryWrites=true&w=majority"
}
else {
  db = "mongodb+srv://admin:admin@cluster0-idjkv.mongodb.net/yodawyDB?retryWrites=true&w=majority"
}
mongoose.connect(db, err => {
  if (err) {
    console.error('Error! ', err);
  } else {
    console.log('connected to mongodb');
  }
});


function verifyToken(req, res, next) {
  if (!req.headers.authorization) {
    return res.status(401).json({msg:'Unauthorized request'})
  }
  let token = req.headers.authorization.split(' ')[1];
  if (token === 'null') {
    return res.status(401).json({msg:'Unauthorized request'})
  }
  let payload = jwt.verify(token, 'secretKey');
  if (!payload) {
    return res.status(401).json({msg:'Unauthorized request'})
  }
  let userId = payload.subject;
  User.findOne({ _id: userId }, (err, user) => {
    if (err) {
      res.status(500).json({msg:'Internal server error'})
    } else {
      if (user) {
        req.user = user;
        next();
      } else {
        res.status(401).json({msg:'Destroyed token'})
      }
    }
  });
}

module.exports = app;