/**
 * Created by swallow on 2017/9/23.
 */
const mongoose = require('./mongoose')
const Schema = mongoose.Schema
const StroySchema = new Schema({
  date: { type: Date, default: Date.now },
  name: String,
  content: String,
  lc: {
    type: Schema.Types.ObjectId,
    default: null,
    ref: 'Story'
  },
  rb: {
    type: Schema.Types.ObjectId,
    default: null,
    ref: 'Story'
  },
  author: Schema.Types.ObjectId,
  writeOpen: {
    type: Boolean,
    default: false
  }
})
const Story = mongoose.model('Story', StroySchema)
module.exports = Story
