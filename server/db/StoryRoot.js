/**
 * Created by swallow on 2017/9/23.
 */
const mongoose = require('./mongoose')
const Schema = mongoose.Schema
let RootCountsSchema = new Schema({
  id: {type: String, required: true},
  seq: { type: Number, default: 0 }
})
let RootCounts = mongoose.model('RootCounts', RootCountsSchema)
const StroyRootSchema = new Schema({
  id: { type: String },
  date: { type: Date, default: Date.now },
  name: String,
  content: String,
  zan: {
    type: Schema.Types.ObjectId, ref: 'User'
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  writePermit: Boolean,
  lc: {
    type: Schema.Types.ObjectId,
    default: null,
    ref: 'Story'
  },
  rb: {
    type: Schema.Types.ObjectId,
    default: null,
    ref: 'Story'
  }
})
StroyRootSchema.pre('save', function (next) {
  'use strict'
  let doc = this
  RootCounts.findOneAndUpdate({name: 'rootId'}, { $inc: { seq: 1 } }, function (error, counter) {
    if (error) {
      return next(error)
    }
    doc.id = 'R' + counter.seq
    next()
  })
})
const StoryRoot = mongoose.model('StoryRoot', StroyRootSchema)
module.exports = StoryRoot
