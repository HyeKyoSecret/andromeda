/**
 * Created by swallow on 2017/9/23.
 */
const mongoose = require('./mongoose')
const Schema = mongoose.Schema
const StorySchema = new Schema({
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
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  writeOpen: {
    type: Boolean,
    default: false
  }
})
const Story = mongoose.model('Story', StorySchema)
module.exports = Story
