const mongoose=require('mongoose')
const Schema=mongoose.Schema

const userSchema=new Schema({
    name: {type:String,required:true},
    mobile_no:{type:Number,required:true, unique:true},
    email:{type:String,required:true,unique:true},
    account_name :{type:String, required:true} ,
    account_number :{type:Number,required:true},
    bank_name :{type:String, required:true} ,
    branch_name :{type:String, required:true},
    state :{type:String, required:true},
    city :{type:String, required:true},
    area_pincode :{type:Number,required:true},
    residence :{type:Number,required:true},
    ifsc_code :{type:Number,default:0000},
    password:{type:String,required:true},
    mpin:{type:String,require:true},
    transactions:{type:Object,default:{}},
    role:{type:String,default:'customer'},
    balance:{type:Number,default:1000},
    fixed_bal:{type:Number,default:0},
    loan_bal:{type:Number,default:0},
    },{timestamps: true})

const User=mongoose.model('User',userSchema)
module.exports=User

