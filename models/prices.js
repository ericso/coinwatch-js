var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId;

var PriceSchema = new Schema({
  timeStamp: { type: Date },
  buyPrice: { type: Number },
  sellPrice: { type: Number }
});

module.exports = mongoose.model('Price', PriceSchema);