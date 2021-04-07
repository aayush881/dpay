const mongoose=require('mongoose')
const Schema=mongoose.Schema

const loanSchema=new Schema({
    account_name: {type:String,required:true},
    account_number:{type:Number,required:true},
    start_date:{type:Date,required:true},
    end_date:{type:Date,required:true},
    amount:{type:Number,required:true}},
    {timestamps: true})
const Loan=mongoose.model('Loan',loanSchema)
module.exports=Loan
    