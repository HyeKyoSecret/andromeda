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
const StoryRootSchema = new Schema({
  id: { type: String },
  date: { type: Date, default: Date.now },
  name: String,
  content: String,
  coverImg: String,
  readCounts: [{
    type: Schema.Types.ObjectId, ref: 'User'
  }],
  zan: [{
    type: Schema.Types.ObjectId, ref: 'User'
  }],
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  writePermit: {
    type: Boolean,
    default: true
  },
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
  subscribe: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  tempTraversal: {
    preOrderTraversal: Array,
    date: { type: Date, default: Date.now }
  },
  comment: [{
    type: Schema.Types.ObjectId,
    ref: 'Comment'
  }]
})
StoryRootSchema.pre('save', function (next) {
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
const StoryRoot = mongoose.model('StoryRoot', StoryRootSchema)
module.exports = StoryRoot
