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
      ref: 'Root'
    }],
    story: [{
      type: Schema.Types.ObjectId,
      ref: 'Story'
    }]
  }
})
const User = mongoose.model('User', UserSchema)
module.exports = User
