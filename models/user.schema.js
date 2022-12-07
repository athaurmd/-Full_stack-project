const mongoose = require("mongoose");

import AuthRoles from '../utils/authRoles';


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

)

export default mongoose.model("User", userSchema);