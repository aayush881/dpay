const mongoose=require('mongoose')
const Schema=mongoose.Schema

const amountSchema=new Schema({
    credit: {type:String,required:true},
    debit: {type:String,required:true},
    balance:{type:Number,required:true, unique:true},
    date_event:{type:Date,required:true},
    desc:{type:String,required:true}
},{timestamps: true})

const Amount=mongoose.model('amount',amountSchema)
module.exports=Amount