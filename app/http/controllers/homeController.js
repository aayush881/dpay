const fs=require('fs')
const Complain=require('../../model/complain')
function homeController(){
    //return object
    return {
        index(req,res){
            
            res.render('home')
        },
        dashboard(req,res){
            //console.log(req.body)
            res.render('dashboard')
        },
        pay(req,res){
            res.render('dashboard/pay')
        },
        aboutus(req,res){
            res.render('dashboard/aboutus')
        },
        complain(req,res){
            //console.log(req.body)
            const {
                complain_name,
                complain_type,
                mobile_number,
                date_event,
                desc
            }=req.body
            const complain=new Complain({
                complain_name,
                complain_type,
                mobile_number,
                date_event,
                desc
            })
            complain.save().then((complain)=>{
                return res.redirect('/')
            }).catch((err)=>{
                console.log(err)
                req.flash('err','Something went wrong')
                return res.redirect('/complain')
            })
        },
        customerget(req,res){
            res.render('dashboard/complain')
        },
        customercare(req,res){
            res.render('dashboard/customercare')
        }
    }
}

module.exports=homeController