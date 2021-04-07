const mongoose=require('mongoose')
const Schema=mongoose.Schema

const fixedSchema=new Schema({
    account_name: {type:String,required:true},
    account_number:{type:Number,required:true},
    start_date:{type:Date,required:true},
    end_date:{type:Date,required:true},
    amount:{type:Number,required:true}},
    {timestamps: true})
const Fixed=mongoose.model('Fixed',fixedSchema)
module.exports=Fixed
    