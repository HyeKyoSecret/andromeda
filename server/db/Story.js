/**
 * Created by swallow on 2017/9/23.
 */
const mongoose = require('./mongoose')
const Schema = mongoose.Schema
let StoryCountsSchema = new Schema({
  id: {type: String, required: true},
  seq: { type: Number, default: 0 }
})
let StoryCounts = mongoose.model('StoryCounts', StoryCountsSchema)
const StorySchema = new Schema({
  id: String,
  date: { type: Date, default: Date.now },
  root: { type: Schema.Types.ObjectId, ref: 'StoryRoot' },
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
    type: String
  }
})
StorySchema.pre('save', function (next) {
  'use strict'
  let doc = this
  StoryCounts.findOneAndUpdate({name: 'storyId'}, { $inc: { seq: 1 } }, function (error, counter) {
    if (error) {
      return next(error)
    }
    doc.id = 'S' + counter.seq
    next()
  })
})
const Story = mongoose.model('Story', StorySchema)
module.exports = Story
