const mongoose=require('mongoose')
const Schema=mongoose.Schema

const transactionsSchema=new Schema({
    image:{type:String},
    my_account_number:{type:Number,required:true},
    account_name: {type:String,required:true},
    account_number:{type:Number,required:true},
    date:{type:String,required:true},
    time:{type:String,required:true},
    credit:{type:Number},
    debit:{type:Number},
    balance:{type:Number,default:0}},
    {timestamps: true})
const Transactions=mongoose.model('Transactions',transactionsSchema)
module.exports=Transactions
    