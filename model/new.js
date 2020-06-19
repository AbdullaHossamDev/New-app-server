const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({

  userId: { type: Schema.Types.ObjectId, required: true },
  source: { name: { type: Schema.Types.String, required: true } },
  author: { type: Schema.Types.String, required: true },
  title: { type: Schema.Types.String, required: true },
  description: { type: Schema.Types.String, required: true },
  url: { type: Schema.Types.String, required: true },
  urlToImage: { type: Schema.Types.String, required: true },
  publishedAt: { type: Schema.Types.Date, required: true },
});

module.exports = mongoose.model('favNews', userSchema, 'favNews');