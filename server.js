const express=require('express')
const app=express()
const path=require('path')
const ejs=require('ejs')
const expressLayout=require('express-ejs-layouts')
app.get('/',(req,res)=>{
    res.render('home')
})

app.use(expressLayout)
app.set('views',path.join(__dirname,'/resources/views'))
app.set('view engine','ejs')

app.listen(4333,()=>{
    console.log("http://localhost:4333")
})