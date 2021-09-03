const path = require('path')
const express = require('express')
const dotenv = require('dotenv')
const connectDB = require('./config/db')
const morgan= require('morgan')
const exphps = require('express-handlebars')
//load config
dotenv.config({path :'./config/config.env'})

connectDB()

const app = express()

//Logging

if(process.env.NODE_ENV==='development'){
    app.use(morgan('dev'))
}

//HANdleBars
app.engine('hbs',exphps({defaultLayout:'main' ,extname:'.hbs'}));
app.set('view engine', '.hbs'); /* by doing this we can use .hbs instead of .handlebars*/

//Routes
app.use('/',require('./routes/index'))

// static folder
app.use(express.static(path.join(__dirname,'public')));

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});