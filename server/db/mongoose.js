/**
 * Created by YYW on 2017/3/18.
 */
const mongoose = require('mongoose')
mongoose.Promise = global.Promise
var uri = 'mongodb://localhost:27017/andromeda,mongodb://localhost:27027/andromeda,mongodb://localhost:27037/andromeda'
// mongoose.connect('mongodb://localhost:27017', {
//   useMongoClient: true
// })
var opts = {}
global.db = mongoose.createConnection(uri, opts)
mongoose.connection = global.db
module.exports = mongoose
