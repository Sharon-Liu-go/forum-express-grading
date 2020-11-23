const express = require('express')
const handlebars = require('express-handlebars')
const app = express()
const port = 3000

app.engine('hanldebars', handlebars())
app.set('view engine', 'hanldebars')

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

require('./routes')(app)

module.exports = app
