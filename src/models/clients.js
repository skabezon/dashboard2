const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ClientSchema = new Schema({
  _id: String,
  name: String,
  lastname: String,
  address: String
})
module.exports = mongoose.model('Client', ClientSchema)
