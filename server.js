var express = require('express')
var app = express()
var morgan = require('morgan')

app.use(express.static('public'))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'))
app.listen(16663, function() {
  console.log('Example app listening on port 16663!')
})
