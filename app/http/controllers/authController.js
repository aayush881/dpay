const User=require('../../model/user')
const bcrypt=require('bcrypt')
const passport=require('passport')
function authController(){
    //return object
    return {
        login(req,res){
            res.render('auth/login')
        },
        register(req,res){
            res.render('auth/register')
        }
        ,
        postLogin(req,res,next){
            //console.log(req.body)
            passport.authenticate('local',(err,user,info)=>{
                    if(err){
                        req.flash('err',info.message)
                        return next(err)
                    }
                    if(!user){
                        req.flash('err',info.message)
                        return res.redirect('/login')
                    }
                    req.logIn(user,(err)=>{
                        if(err){
                            req.flash('err',info.message)
                            return next(err)
                        }
                        return res.redirect('/')
                    })
            })(req,res,next)
        },
        async postRegister(req,res){
            const {name,mobile_no,email,account_name,account_number,bank_name,branch_name,state,city,area_pincode,residence,password,mpin}=req.body
            if(!name || !mobile_no || !email || !account_name || !account_number || !bank_name || !branch_name || !state || !city || !area_pincode || !residence || !password || !mpin)
            {
                req.flash('err','All fields are required')
                for (let key in req.body) {
                    req.flash(key,req.body[key])
                }
                return res.redirect('/register')
            }  
            User.exists({email: email},(err,result)=>{
                if(result){
                    req.flash('err','Email Already exists')
                    for (let key in req.body) {
                        req.flash(key,req.body[key])
                    }
                    return res.redirect('/register')
                }
            }) 
            User.exists({account_number: account_number },(err,result)=>{
                if(result){
                    req.flash('err','Account already registered')
                    for (let key in req.body) {
                        req.flash(key,req.body[key])
                    }
                    return res.redirect('/register')
                }
            }) 
            User.exists({mobile_no: mobile_no},(err,result)=>{
                if(result){
                    req.flash('err','Account already registered with this number')
                    for (let key in req.body) {
                        req.flash(key,req.body[key])
                    }
                    return res.redirect('/register')
                }
            }) 
            
            
            const hashed=await bcrypt.hash(password,10)
            const hashed_mpin=await bcrypt.hash(mpin,10)

            const user=new User({
                name,
                mobile_no,
                email,
                account_name,
                account_number,
                bank_name,
                branch_name,
                account_name,
                account_number,
                state,
                city,
                residence,
                area_pincode,
                password:hashed,
                mpin:hashed_mpin
            })

            user.save().then((user)=>{
                res.redirect('/')
            }).catch((err)=>{
                console.log(err)
                for (let key in req.body) {
                    req.flash(key,req.body[key])
                }
                req.flash('err','Something went wrong')
                return res.redirect('/register')
            })
            
        },
        logout(req,res){
            req.logout()
            return res.redirect('/login')
        }
    }
}

module.exports=authController