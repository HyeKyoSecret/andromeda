const mongoose = require('./mongoose')
const Schema = mongoose.Schema
const historySchema = new Schema(
  {
    data: [{
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
              type: String
            },
            date: {
              type: Date
            }
          }
          ],
          update: { type: Date }
        }
      ]
    }]
  }, { timestamps: { updateAt: 'updatedTime' } })
const History = mongoose.model('History', historySchema)
module.exports = History
