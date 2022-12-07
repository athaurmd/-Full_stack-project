const mongoose = require("mongoose");


const userSchema = new mongoose.Schema(
{
    name : {
        type:String,
        required : [true, "Name is Required"],
        maxLength : [50, "Name must be less than 5o characters"],
        trim : true
    }

}
)