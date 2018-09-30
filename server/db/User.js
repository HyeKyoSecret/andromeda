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
  birthday: {
    type: Date
  },
  sex: {
    type: String,
    default: '未设置'
  },
  sign: {
    type: String
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
  myCreationDraft: {    //  草稿
    root: {
      name: String,
      content: String,
      writePermit: Boolean
    },
    story: [{
      id: String,
      content: String
    }]
  },
  pending: {     //  待处理请求
    request: [
      {
        date: { type: Date, default: Date.now },
        to: {
          type: Schema.Types.ObjectId,
          ref: 'User'
        },
        state: { type: String, default: 'pending' }
      }
    ],
    addFriend: [
      {
        date: { type: Date, default: Date.now },
        from: {
          type: Schema.Types.ObjectId,
          ref: 'User'
        },
        state: { type: String, default: 'pending' }
      }
    ]
  },
  friendList: [
    {
      date: { type: Date, default: Date.now },
      friend: {
        type: Schema.Types.ObjectId,
        ref: 'User'
      }
    }
  ],
  promote: [
    {
      date: { type: Date, default: Date.now },
      description: String,
      content_1: String,
      content_2: String,
      content_3: String,
      content_4: String
    }
  ],
  mark: [
    {
      rootId: String,
      story: [{
        name: { type: String, default: '未命名' },
        id: String,
        brief: String,
        date: { type: Date, default: Date.now }
      }]
    }
  ],
  history: [
    {
      date: {
        type: Date
      },
      rootPack: [
        {
          rootId: {
            type: Schema.Types.ObjectId,
            ref: 'StoryRoot'
          },
          story: [ {
            storyId: {
              type: Schema.Types.ObjectId,
              ref: 'Story'
            },
            date: {
              type: Date
            }
          }
          ]
        }
      ]
    }
  ],
  commentTo: [{
    type: Schema.Types.ObjectId,
    ref: 'Comment'
  }],
  commentFrom: [{
    type: Schema.Types.ObjectId,
    ref: 'Comment'
  }],
  headImg: String,
  focus: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  follower: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }]
})
UserSchema.pre('save', function (next) {
  'use strict'
  let doc = this
  UserCounts.findOneAndUpdate({name: 'userId'}, { $inc: { seq: 1 } }, function (error, counter) {
    if (error) {
      return next(error)
    }
    doc.id = counter.seq
    next()
  })
})
const User = mongoose.model('User', UserSchema)
module.exports = User
