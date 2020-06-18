const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  userName: { type: Schema.Types.String, required: true },
  email: { type: Schema.Types.String, required: true, unique: true },
  password: { type: Schema.Types.String, required: true }, 
  birthDate: {type: Schema.Types.Date, required: true}
});

module.exports = mongoose.model('user', userSchema, 'user');
