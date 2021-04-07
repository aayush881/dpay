const LocalStrategy=require('passport-local').Strategy
const User=require('../model/user')
const bcrypt=require('bcrypt')
function init(passport)
{
    passport.use(new LocalStrategy({usernameField: 'email'} ,async (email,password,done)=>{
        //check if email exists
        const user=await User.findOne({email:email})
        if(!user)
        { 
            return done(null,false,{message:'no user exists'})
        }
        bcrypt.compare(password,user.password).then(match=>{
            if(match)
            {return done(null,user,{message:'logged in'})}
            return done(null,false,{message:'wrong password'})
        }).catch((err)=>{
                console.log(err)
                return done(null,false,{message:'something wrong'})})
            

    }))
    passport.serializeUser((user,done)=>{
        done(null,user._id)
    })
    passport.deserializeUser((id,done)=>{
        User.findById(id,(err,user)=>{
            done(err,user)
        })
    })
    
}

 module.exports=init