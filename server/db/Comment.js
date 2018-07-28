/**
 * Created by swallow on 2018/7/27.
 */
const mongoose = require('./mongoose')
const Schema = mongoose.Schema
const CommentSchema = new Schema({
  people: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  content: {
    type: String
  },
  zan: [
    {
      type: Schema.Types.ObjectId, ref: 'User'
    }
  ],
  commentTo: 
  date: { type: Date, default: Date.now },
})

const Comment = mongoose.model('Comment', CommentSchema)
module.exports = Comment

