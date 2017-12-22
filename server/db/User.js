/**
 * Created by swallow on 2017/10/7.
 */
const mongoose = require('./mongoose')
const Schema = mongoose.Schema
let UserCountsSchema = new Schema({
  id: {type: String, required: true},
  seq: { type: Number, default: 0 }
})
let UserCounts = mongoose.model('UserCounts', UserCountsSchema)
const UserSchema = new Schema({
  date: { type: Date, default: Date.now },
  id: {type: String},
  username: {
    type: String,
    required: true
  },
  nickname: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  myCreation: {
    root: [{
      type: Schema.Types.ObjectId,
      ref: 'StoryRoot'
    }],
    story: [{
      type: Schema.Types.ObjectId,
      ref: 'Story'
    }]
  },
  zan: {
    root: [{
      type: Schema.Types.ObjectId,
      ref: 'StoryRoot'
    }],
    story: [{
      type: Schema.Types.ObjectId,
      ref: 'Story'
    }]
  },
  subscribe: [
    {
      type: Schema.Types.ObjectId,
      ref: 'StoryRoot'
    }
  ],
  myCreationDraft: {
    root: {
      name: String,
      content: String,
      writePermit: Boolean
    },
    story: [{
      id: String,
      content: String
    }]
  }
})
UserSchema.pre('save', function (next) {
  'use strict'
  let doc = this
  UserCounts.findOneAndUpdate({name: 'userId'}, { $inc: { seq: 1 } }, function (error, counter) {
    if (error) {
      return next(error)
    }
    doc.id = 'U' + counter.seq
    next()
  })
})
const User = mongoose.model('User', UserSchema)
module.exports = User
