const mongoose = require('mongoose');

const dishSchema = mongoose.Schema({
  category: { type: String, required: true },
  picture: { type: String, required: true },
  title: { type: String, required: true },
  description: {type: String, require: true},
  allergenArray:  {type: Array, require: true},
  price: {type: String, require: true},
  inCard:  {type: Boolean, require: true},
});

module.exports = mongoose.model('Dish', dishSchema);