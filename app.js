const path = require('path')
const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const connectDB = require('./config/db')
const morgan= require('morgan')
const passport=require('passport')
const methodOverride = require('method-override')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const exphps = require('express-handlebars')

//load config
dotenv.config({path :'./config/config.env'})

//Passport config
require('./config/passport')(passport)

connectDB()

const app = express()

//BOdy parser
app.use(express.urlencoded({extended:false}))
app.use(express.json())

//Logging

if(process.env.NODE_ENV==='development'){
    app.use(morgan('dev'))
}

//Handlebars Helper
const {formatDate,truncate,stripTags,editIcon,select} = require('./helpers/hbs')
const { nextTick } = require('process')

//HANdleBars
app.engine('.hbs',exphps({
    helpers:{
        formatDate,
        stripTags,
        truncate,
        editIcon,
        select
        },
    defaultLayout: 'main',extname:'.hbs'}) );
app.set('view engine','.hbs')

// Method override
app.use(
  methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      // look in urlencoded POST bodies and delete it
      let method = req.body._method
      delete req.body._method
      return method
    }
  })
)
//Sessiosns
app.use(session({
    secret: 'keyboard-cat',
    resave:false,
    saveUninitialized:false,
    store: MongoStore.create({
            mongoUrl: process.env.MONGO_URI,
        })
}))

//Passport middleware
app.use(passport.initialize())
app.use(passport.session())

// set global var
app.use(function(req,res,next) {
    res.locals.user = req.user || null
    next()
})

//Routes
app.use('/',require('./routes/index'))
app.use('/auth',require('./routes/auth'))
app.use('/stories',require('./routes/stories'))

// static folder
app.use(express.static(path.join(__dirname,'public')));

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});