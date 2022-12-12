const mongoose = require("mongoose");

import AuthRoles from '../utils/authRoles';
import bcrypt from 'bcryptjs'
import JWT from 'jsonwebtoken'
import config from '../config/index'
import crypto from 'crypto'




const userSchema = new mongoose.Schema(
{
    name : {
        type : String,
        required : [true, "Name is Required"],
        maxLength : [50, "Name must be less than 5o characters"],
        trim : true
    },
    email : {
        type : String,
        required : [true, "Email is Required"],
        unique : true
    },
    password : {
        type : String,
        required : [true, "Password is Required"],
        minLength : [8, "Password must atleast 8 characters"],
        select : false
    },
    roles : {
        type : String,
        enum : Object.values(AuthRoles),
        default : AuthRoles.USER
    },
    forgetPasswordToken : String,
    forgetPasswordExpiry : Date

},
{
    timestamps : true
}
);

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 10)
        next();

}
);

//features
//1.comparing the password
userSchema.methods = {
    comparePassword : async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password)
   },

   getJwtToken : function() {
    return JWT.sign(
        {
            _id : this.id,
            role : this.role
        },
        config.JWT_SECRET,
        {
            expiresIn : config.JWT_EXPIRY,

        }
    )
   }, 

   generateForgotPasswordToken : function(){
    const forgotToken = crypto.randomBytes(20).toString('hex');
    //saving to db
    this.forgetPasswordToken = crypto.createHash('sha256').update(forgotToken).digest('hex');

    this.forgetPasswordExpiry = Date.now() + 20 * 60 * 1000;
    //return to user
     return forgotToken;
   }
}




export default mongoose.model("User", userSchema);