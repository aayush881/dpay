const admin = require("../../middlewares/admin")
const User=require('../../../model/user')
const Fixed=require('../../../model/fixed_deposit')
const Loan=require('../../../model/loan')
const Transactions=require('../../../model/transactions')
const Complain=require('../../../model/complain')
var id
function adminController(){
    return{
    admin(req,res){
        res.render('admin/welcome')
    },
    search(req,res){
        res.render('admin/search')
    },
    profile(req,res){
        res.render('admin/profile')
    },
    post_search(req,res){
        if(!req.body.id){
            req.flash('err','Fields cannot be empty')
            return res.redirect('/admin/search')
        }
        User.findOne({account_number:parseInt(req.body.id)}).then(doc => {
            if(doc){
                id=parseInt(req.body.id)
                console.log(doc)
                return res.render('admin/profile',{client:doc})
            }
            else
            {
                req.flash('err','Account not found')
                return res.redirect('/admin/search')
            }
        }).catch(err => {
            console.log(err);
            return res.status(500).send("something went wrong");
        })

        
    },
    transactions(req,res){
        Transactions.find({my_account_number: id},null,{sort:{'createdAt':-1}}).then(doc => {
            //console.log(id)
            if(doc){
                res.render('dashboard/transactions',{t:doc})
            }
        }).catch(err => {
            console.log(err);
            return res.status(500).send("something went wrong");
        })
        
    },
    async complains(req,res){
        const doc=await Complain.find({})
        res.render('admin/complain',{client:doc})
    },
    async fixed(req,res){
        const doc=await Fixed.find({})
        //console.log(doc)
        return res.render('admin/fixed_money',{client:doc})
        

        
    },
    async loan(req,res){
        const doc=await Loan.find({})
        //console.log(doc)
        return res.render('admin/loan_money',{client:doc})
        
    }
}
}
module.exports=adminController