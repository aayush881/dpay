const mongoose=require('mongoose')
const Schema=mongoose.Schema

const complainSchema=new Schema({
    complain_name: {type:String,required:true},
    complain_type: {type:String,required:true},
    mobile_number:{type:Number,required:true, unique:true},
    date_event:{type:Date,required:true},
    desc:{type:String,required:true}
},{timestamps: true})

const Complain=mongoose.model('Complain',complainSchema)
module.exports=Complain