const express=require('express')
const app=express()
const path=require('path')
const ejs=require('ejs')
const expressLayout=require('express-ejs-layouts')
const bodyparser=require('body-parser')
require('dotenv').config()
const session=require('express-session')
const MongoStore = require('connect-mongo')(session)
const passport=require('passport')
const fs=require('fs')



//mongo
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/dpay', {useNewUrlParser: true,useUnifiedTopology: true,useCreateIndex: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("connected")
});

let mongoStore=new MongoStore({
  mongooseConnection:db,
  collection: 'sessions'

})

//session configuration should be above passport config
app.use(session({
  secret: process.env.COOKIE_SECRET,
  resave:false,
  saveUninitialized:false,
  //life
  store:mongoStore,
  cookie:{ maxAge:1000*60*60}
}))

app.use(passport.initialize())
app.use(passport.session())




//sessions



//flash
const flash=require('express-flash')
app.use(flash())
//session




app.use(express.json())
app.use(express.urlencoded({extended:false}))

app.use((req,res,next)=>{
  res.locals.session=req.session
  res.locals.user=req.user

  next()
})

//assets
app.use(express.static('public'))

app.use(expressLayout)
app.set('views',path.join(__dirname+'/resources/views'))
app.set('view engine','ejs')
require('./routes/web')(app)


//passport
const passportInit=require('./app/config/passport')
passportInit(passport)

process.setMaxListeners(0);
app.listen(4333,()=>{
    console.log("http://localhost:4333")
})