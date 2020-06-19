const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const port = 3000;

const userRoutes = require('./routes/user');
const newsRoutes = require('./routes/news');


const app = express();

app.use(cors());
app.use(bodyParser.json());

app.listen(port, () => console.log(`Server running on port ${port}`));

app.use('/user', userRoutes);
app.use('/news', newsRoutes);





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


module.exports = app;