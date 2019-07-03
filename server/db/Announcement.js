const mongoose = require('./mongoose')
const Schema = mongoose.Schema
const AnnouncementSchema = new Schema({
  author: String,
  title: String,
  content: String,
  date: { type: Date, default: Date.now },
  readed: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }]
})
const Announcement = mongoose.model('Announcement', AnnouncementSchema)
module.exports = Announcement

