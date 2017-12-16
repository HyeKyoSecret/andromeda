/**
 * Created by swallow on 2017/10/7.
 */
const mongoose = require('./mongoose')
const Schema = mongoose.Schema
const UserSchema = new Schema({
  date: { type: Date, default: Date.now },
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
const User = mongoose.model('User', UserSchema)
module.exports = User
