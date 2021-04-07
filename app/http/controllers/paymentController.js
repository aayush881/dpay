const User=require('../../model/user')
const Transactions=require('../../model/transactions')
const bcrypt=require('bcrypt')
var main_no=0
var other={}
var to_be={}
function paymentController(){
    //return object
    return {
        recharge(req,res){
            res.render('pay/recharge')
        },
        topupget(req,res){
            res.render('pay/topup_dpay')
        },
        topup(req,res){
            //console.log(req.body)
            const {number}=req.body
            
            User.findOne({account_number:number}).then(doc => {
                //console.log(doc);
                if(doc){
                other=doc
                return res.render('finalsend',{info:doc})
                }
            }).catch(err => {
                console.log(err);
                return res.status(500).send("something went wrong");
            })

            User.findOne({mobile_no:number}).then(doc => {
                //console.log(doc);
                if(doc){
                other=doc
                return res.render('finalsend',{info:doc})
                }
            }).catch(err => {
                console.log("topup error is",err);
                return res.status(500).send("something went wrong");
            })
            
        },
        transfer(req,res){
            res.render('pay/transfer')
        },
        transfer_post(req,res){
            //console.log(req.body)
            const {account_name,account_number,bank_name,branch_name,ifsc_code,mobile_no,agree}=req.body
            if(!account_name || !account_number || !bank_name || !branch_name || !ifsc_code || !mobile_no)
            {
                req.flash('err','All fields are required')
                for (let key in req.body) {
                    req.flash(key,req.body[key])
                }
                return res.redirect('transfer')
            }
            if(!agree)
            {
                req.flash('err','You must agree with the details')
                for (let key in req.body) {
                    req.flash(key,req.body[key])
                }
                return res.redirect('transfer')
            }
            User.findOne({account_number: account_number}).then(doc => {
                //console.log(doc);
                if(doc){
                    other=doc
                    for (let key in req.body) {
                        if(key!="agree" & req.body[key]!=doc[key]){
                            //console.log(key)
                            req.flash('err','Account does not match!')
                            for (let key in req.body) {
                                req.flash(key,req.body[key])
                            }
                            return res.redirect('transfer')
                        }
                    }
                    return res.render('finalsend',{info:doc})
                }
            }).catch(err => {
                console.log("err is", err);
                return res.status(500).send("something went wrong");
            })
            
            
            //main_code_check
        },
        validget(req,res){
            res.render('pay/status')
        },
        valid(req,res){
            const {amount,num}=req.body
            //console.log(req.body)
            
            //
            //console.log("type is ",typeof(num))
            User.findOne({account_number: parseInt(num)}).then(doc => {
                //console.log(doc);
                if(doc){
                var a=parseInt(doc.balance),b=parseInt(amount)
                if(a>b){
                    var current = new Date();
                    var date=current.toLocaleDateString();
                    var time=current.toLocaleTimeString();
                    var account_number=doc.account_number
                    var account_name=doc.account_name
                    var my_account_number=parseInt(num)
                    var debit=amount
                    var credit=0
                    var balance=parseInt(doc.balance)-parseInt(amount)
                    var image="sdfg"
                    console.log(date,time)
                    const trans=new Transactions({
                        image,
                        my_account_number,
                        account_name,
                        account_number,
                        date,
                        time,
                        credit,
                        debit,
                        balance
                    })
                    to_be=trans
                    return res.redirect('/valid')
                   
                }
                else{
                    console.log('Low balance in Account')
                    req.flash('err','Low balance in Account')
                    res.render('finalsend',{info:doc})
                    }
                }
            }).catch(err => {
                console.log("err is", err);
                return res.status(500).send("something went wrong");
            })

           
            
        },
        utilities(req,res){
            res.render('pay/utilities')
        },
        finalsend(req,res){
            res.render('finalsend')
        }
        ,async status(req,res){
            const mpin=req.body
            

                await bcrypt.compare(mpin.pin,req.user.mpin).then(match=>{
                    if(match)
                    {
                        req.flash('success','done')
                        res.render('successful',{amount:to_be.debit,acc:other.account_number,action:"credited to",text:"Payment Credited"})
                        to_be.save().then((to_be)=>{
                            User.updateOne({account_number: req.user.account_number}, {$set: {balance:parseInt(req.user.balance)-parseInt(to_be.debit)}}, function(err, result){
                                //console.log(result);
                            }).catch((err)=>{
                                console.log("eror is ",err)
                                return res.status(500).send("something went wrong");
                            })
                            User.updateOne({account_number:other.account_number}, {$set: {balance:parseInt(to_be.debit)+parseInt(other.balance)}}, function(err, result){
                                //console.log(result);
                            }).catch((err)=>{
                                console.log("eror is ",err)
                                return res.status(500).send("something went wrong");
                            })
                            console.log("inserted")
                            
                        }).catch((err)=>{
                            console.log("eror is ",err)
                            return res.status(500).send("something went wrong");
                        })
                        var current = new Date();
                        var date=current.toLocaleDateString();
                        var time=current.toLocaleTimeString();
                        var account_number=req.user.account_number
                        var account_name=req.user.account_name
                        var my_account_number=parseInt(other.account_number)
                        var debit=0
                        var credit=to_be.debit
                        var balance=parseInt(other.balance)+parseInt(credit)
                        var image="sdfg"
                        console.log(date,time)
                        const trans=new Transactions({
                            image,
                            my_account_number,
                            account_name,
                            account_number,
                            date,
                            time,
                            credit,
                            debit,
                            balance
                        })
                              trans.save().then((trans)=>{console.log("stored on other side")})
                        .catch((err)=>{
                            console.log("eror is ",err)
                            return res.status(500).send("something went wrong");
                        })
                        
                    }
                    else{
                        req.flash('err','Wrong MPIN! TRY AGAIN')
                        res.redirect('valid')
    
                    }}).catch((err)=>{
                        console.log(err)
                        return res.status(500).send("something went wrong");
                    })
            
            
            
           
        }
    }
}
module.exports=paymentController