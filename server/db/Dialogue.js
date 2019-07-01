const mongoose = require('./mongoose')
const Schema = mongoose.Schema
const DialogueSchema = new Schema({
  people1: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  people2: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  message: [{
    type: Schema.Types.ObjectId,
    ref: 'Message'
  }],
  date: { type: Date, default: Date.now }
}, {timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }})
const Dialogue = mongoose.model('Dialogue', DialogueSchema)
module.exports = Dialogue
