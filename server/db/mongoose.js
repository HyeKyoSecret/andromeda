/**
 * Created by YYW on 2017/3/18.
 */
const mongoose = require('mongoose')
mongoose.Promise = global.Promise
mongoose.connect('mongodb://localhost/andromeda', {
  useMongoClient: true
})
module.exports = mongoose
