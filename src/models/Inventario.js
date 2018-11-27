const mongoose = require('mongoose')
const Schema = mongoose.Schema

const InventarioSchema = new Schema({
  _id: String,
  BidonesIn: Number,
  BidonesOut: Number,
  BidonesTotal: Number
})
module.exports = mongoose.model('Inventario', InventarioSchema)
