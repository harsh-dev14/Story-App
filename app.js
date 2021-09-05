const path = require('path')
const express = require('express')
const dotenv = require('dotenv')
const connectDB = require('./config/db')
const morgan= require('morgan')
const passport=require('passport')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const exphps = require('express-handlebars')
//load config
dotenv.config({path :'./config/config.env'})

//Passport config
require('./config/passport')(passport)

connectDB()

const app = express()

//Logging

if(process.env.NODE_ENV==='development'){
    app.use(morgan('dev'))
}

//HANdleBars
app.engine('hbs',exphps({defaultLayout:'main' ,extname:'.hbs'}));
app.set('view engine', '.hbs'); /* by doing this we can use .hbs instead of .handlebars*/

//Sessiosns
app.use(session({
    secret: 'keyboard-cat',
    resave:false,
    saveUninitialized:false
}))

//Passport middleware
app.use(passport.initialize())
app.use(passport.session())

//Routes
app.use('/',require('./routes/index'))
app.use('/auth',require('./routes/auth'))

// static folder
app.use(express.static(path.join(__dirname,'public')));

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});