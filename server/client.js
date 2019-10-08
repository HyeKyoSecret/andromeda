const elasticsearch = require('elasticsearch')
// const client = new elasticsearch.Client({
//   host: 'localhost:9200',
//   log: 'trace'
// })
const client = new elasticsearch.Client({
  host: 'http://172.31.236.200:9200',
  log: 'trace'
})
module.exports = client

