const mongoose = require('mongoose')
const Schema = mongoose.Schema

const BidonSchema = new Schema({
  _id: String,
  cantidad: Number
})
module.exports = mongoose.model('Bidon', BidonSchema)
