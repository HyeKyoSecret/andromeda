const mongoose = require('./mongoose')
const Schema = mongoose.Schema
const MessageSchema = new Schema({
  to: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  from: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  readed: {
    type: Boolean,
    default: false
  },
  content: String,
  date: { type: Date, default: Date.now }
})
const Message = mongoose.model('Message', MessageSchema)
module.exports = Message

