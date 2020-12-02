// Server setup
const express = require('express')
const app = express()
const api = require('./server/routes/api')

// For parsing application/json 
app.use(express.json()); 
  
// For parsing application/x-www-form-urlencoded 
app.use(express.urlencoded({ extended: true }));


app.use('/', api)

const port = 4200
app.listen(port, function () {
    console.log(`Running on port ${port}`)
})