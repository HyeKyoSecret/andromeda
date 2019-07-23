/**
 * Created by swallow on 2019/7/16.
 */
const mongoose = require('./mongoose')
const Schema = mongoose.Schema
const ReportSchema = new Schema({
  date: { type: Date, default: Date.now },
  reportPeople: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  story: String
})
const Report = mongoose.model('Report', ReportSchema)
module.exports = Report
