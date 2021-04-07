const User=require('../../model/user')
const Fixed=require('../../model/fixed_deposit')
const Loan=require('../../model/loan')
const Transactions = require('../../model/transactions')
var num
function servicesController(){
    //return object
    return {
        fixed_deposit(req,res){
            res.render('dashboard/fixeddeposit')
        },
        loan(Req,res){
            res.render('dashboard/loan')
        },
        loan_post(req,res){
            var bal
            //console.log(req.body)
            const {account_name,account_number,start_date,end_date,amount,agree}=req.body
            if(!account_name || !account_number || !start_date || !end_date || !amount)
            {
                req.flash('err','All fields are required')
                for (let key in req.body) {
                    req.flash(key,req.body[key])
                }
                return res.redirect('loan')
            }
            if(!agree)
            {
                req.flash('err','You must agree with the terms')
                for (let key in req.body) {
                    req.flash(key,req.body[key])
                }
                return res.redirect('loan')
            }
            User.findOne({account_number: account_number}).then(doc => {
                //console.log(doc);
                num=account_number
                if(!doc){
                    req.flash('err','cannot take loan, sorry! try again')
                    for (let key in req.body) {
                        req.flash(key,req.body[key])
                }
                    return res.redirect('loan')
                }
                else{
                    var val= parseInt(amount)
                    bal=parseInt(doc.balance)
                
                    const loan=new Loan({
                        account_name,
                        account_number,
                        start_date,
                        end_date,
                        amount
                    })
                    loan.save().then((loan)=>{
                        var current = new Date();
                            var date=current.toLocaleDateString();
                            var time=current.toLocaleTimeString();
                            var account_number=999999999999
                            var account_name="LOAN"
                            var my_account_number=parseInt(num)
                            var debit=0
                            var credit=amount
                            var balance=parseInt(req.user.balance)+parseInt(amount)
                            //console.log(balance,typeof(balance))
                            var image="sdfg"
                            //console.log(date,time)
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
                            trans.save().then((trans)=>{
                                User.updateMany({account_number: my_account_number}, {$set: {balance:parseInt(req.user.balance)+parseInt(amount),loan_bal:parseInt(req.user.loan_bal)+parseInt(amount)}}, function(err, result){
                                    //console.log(result);
                                    req.flash('success','done')
                                    return res.render('successful',{amount:amount,acc:my_account_number,action:"credited to",text:"Loan Account Created"})
                                }).catch((err)=>{
                                    console.log("eror is ",err)
                                    return res.status(500).send("something went wrong");
                                })
                            }).catch((err)=>{
                                console.log("eror is ",err)
                                return res.status(500).send("something went wrong");
                            })
                        //res.render('home')
                    }).catch((err)=>{
                        console.log(err)
                        req.flash('err','Something went wrong')
                        return res.redirect('loan')
                    })
                }
            }).catch(err => {
                console.log(err);
                return res.status(500).send("something went wrong");
            })

            
            
        },
        fd_post(req,res){
            //console.log(req.body)
            var bal
            const {account_name,account_number,start_date,end_date,amount,agree}=req.body
            if(!account_name || !account_number || !start_date || !end_date || !amount) 
            {
                req.flash('err','All fields are required')
                for (let key in req.body) {
                    req.flash(key,req.body[key])
                }
                return res.redirect('fixeddeposit')
            }
            if(!agree)
            {
                req.flash('err','You must agree with the terms')
                for (let key in req.body) {
                    req.flash(key,req.body[key])
                }
                return res.redirect('fixeddeposit')
            }
            User.findOne({account_number: account_number}).then(doc => {
                //console.log(doc);
                num=account_number
                
                if(!doc){
                    req.flash('err','cannot do fd, sorry! try again')
                    return res.redirect('fixeddeposit')
                }
                else{
                    var val= parseInt(amount)
                    bal=parseInt(doc.balance)
                    //console.log(val,bal)
                    if(val>bal)
                        {req.flash('err','Low balance in Account')
                        for (let key in req.body) {
                            req.flash(key,req.body[key])
                        }
                        return res.redirect('fixeddeposit')
                    }
                    else{
                        const fd=new Fixed({
                            account_name,
                            account_number,
                            start_date,
                            end_date,
                            amount
                        })
                        fd.save().then((fd)=>{
                                var current = new Date();
                                var date=current.toLocaleDateString();
                                var time=current.toLocaleTimeString();
                                var account_number=999999999999
                                var account_name="FIXED DEPOSIT"
                                var my_account_number=parseInt(num)
                                var debit=amount
                                var credit=0
                                var balance=parseInt(bal)-parseInt(amount)
                                var image="sdfg"
                                //console.log(date,time)
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
                                trans.save().then((trans)=>{
                                    User.updateMany({account_number: my_account_number}, {$set: {balance:parseInt(req.user.balance)-parseInt(amount),fixed_bal:parseInt(req.user.fixed_bal)+parseInt(amount)}}, function(err, result){
                                        //console.log(result);
                                        req.flash('success','done')
                                        return res.render('successful',{amount:amount,acc:my_account_number,action:"debited from",text:"Fixed Deposit Created"})
                                    }).catch((err)=>{
                                        console.log("eror is ",err)
                                        return res.status(500).send("something went wrong");
                                    })
                                    console.log("fixed deposit successful")
                                    
                                }).catch((err)=>{
                                    console.log("eror is ",err)
                                    return res.status(500).send("something went wrong");
                                })
                            //res.render('home')
                        }).catch((err)=>{
                            console.log(err)
                            req.flash('err','Something went wrong')
                            return res.redirect('fixeddeposit')
                        })
                    }
                }
            }).catch(err => {
                console.log("error is ",err);
                return res.status(500).send("something went wrong");
            })
            
            
        
        },
        terms(req,res){
            res.render('dashboard/terms')
        },
        transactions(req,res){
            const my_account_number=req.user.account_number
            //console.log(my_account_number)
            
            //console.log(req.user)
            Transactions.find({my_account_number: my_account_number},null,{sort:{'createdAt':-1}}).then(doc => {
                
                if(doc){
                    res.render('dashboard/transactions',{t:doc})
                }
            }).catch(err => {
                console.log(err);
                return res.status(500).send("something went wrong");
            })
            
        },
        downloads(req,res){
            res.render('dashboard/downloads')
        },
        shares(req,res){
            res.render('dashboard/shares')
        }
        ,interest(req,res){
            res.render('dashboard/interest')
        }
    }
}
module.exports=servicesController