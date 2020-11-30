const express = require('express')
const passport = require('./config/passport')
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const db = require('./models')
const app = express()
const port = process.env.PORT || 3000
const flash = require('connect-flash')
const session = require('express-session')
const helpers = require('./_helpers')


const methodOverride = require('method-override')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

app.use(methodOverride('_method'))
app.use('/upload', express.static(__dirname + '/upload'))
app.engine('handlebars', handlebars({ defaultLayout: "main" }))
app.set('view engine', 'handlebars')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(session(
  { secret: 'secret', resave: false, saveUninitialized: false }
))

app.use(passport.initialize())
app.use(passport.session())
app.use(flash())


app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  // res.locals.user = req.user
  res.locals.user = helpers.getUser(req) // 取代 req.user
  next()
})

// Handlebars.registerHelper('ifCond', function (v1, operator, v2, options) {

//   if (operator === '===')
//     return (v1 === v2) ? options.fn(this) : options.inverse(this)

// })

app.listen(port, () => {
  db.sequelize.sync() //讓models跟資料庫同步
  console.log(`Example app listening at http://localhost:${port}`)
})

require('./routes')(app, passport)

module.exports = app
