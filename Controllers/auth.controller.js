import User from '../models/user.schema'
import asyncHandler from '../services/asyncHandler'
import CustomError from '../utils/customError'
import mailHelper from '../utils/mailHelper'


export const cookieOptions ={
    expires: new Date (Date.now() + 3 * 24 * 60 * 60 * 1000 ),
    httponly : true,
}


/********************************* 
 
 * @SignUP
 * @route http://localhost:4000/api/auth/signup
 * @description User signUp controller for creating a new User
 * @parameters username, emai, password
 * @returns User Object 

**********************************/

export const signUp = asyncHandler(async(req,res)=>{
    const {name, email, password}=  req.body;

    if(!name || !email || !password ){
        throw new CustomError("Please fill all the fields", 400);
    }

    const existingUser = await User.findOne({email})

    if(existingUser){
        throw new CustomError("User already exists", 400)
    }

    const user = await User.create({
        name,
        email,
        password
    });

    const token = user.getJwtToken()
    console.log(user)
    user.password = undefined

    res.cookie("token", token, cookieOptions)

    res.status(200).json({
        success : true,
        token,
        user
    })
})

/********************************* 
 
 * @signIn
 * @route http://localhost:4000/api/auth/signIn
 * @description User signIn controller for loging the User
 * @parameters email, password
 * @returns User Object 

**********************************/

export const signIn = asyncHandler(async (req, res)=>{
    const {email, password} = req.body

    if(!email || !password){
        throw new CustomError("All fields are required", 400)
    }
    
    const user = User.findOne({email}).select("+password")

    if(!user){
        throw new CustomError("Invalid Credentials", 400)
    }

    const  isPasswordMatched = await user.comparePassword(password)

    if(isPasswordMatched){
        const token = await user.getJwtToken()
        user.password = undefined
        res.cookie("token", token, cookieOptions)
        return res.status(200).json({
            success : true,
            token,
            user
        })
    }

    if(!isPasswordMatched){
        throw new CustomError("Passowrd Mismatced Invalid Credentials", 400)
    }

})

/********************************* 
 * @LOGOUT
 * @route http://localhost:4000/api/auth/logout
 * @description User logout by deleting user cookies
 * @parameters email, password
 * @returns Success Message

**********************************/

export const logOut = asyncHandler(async (_req, res)=>{
    res.cookie("token", null, {
        expires : new Date(Date.now()),
        httponly: true
    })
    res.status(200).json({
        success : true,
        message : 'LOGGED OUT'
    })

})

/********************************* 
 * @FORGOTPASSWORD
 * @route http://localhost:4000/api/auth/password/forgot
 * @description User sumit email we will generate a token
 * @parameters email
 * @returns Success Message -Email sent

**********************************/

export const forgotPassword = asyncHandler(async(req, res)=>{
    const {enail} = req.body

    const user = await User.findOne({email})
    if(!user){
        throw new CustomError("User is not found", 404)
    }

    const resetToken = user.generateForgotPasswordToken()
    
    await user.save({validateBeforeSave : false})

    const reserUrl = 
    `${req.protocol}://${req.get("host")}/api/auth/password/reset/${resetToken}`

    const text = `Your Password Reset Url is 
    \n\n ${reserUrl} \n\n`

    try {
        await mailHelper({
            email: user.email,
            subject : "Password Resest link for ur UserName",
            text : text

        })
        res.status(200).json({
            success : true,
            message :`Email send to ${user.email}`
        })
        
    } catch (err) {
        user.forgotPasswordToken = undefined
        user.forgotPasswordExpiry = undefined

        await user.save({validateBeforeSave: false})
        throw new CustomError(err.message || 'Reset Password link is not sent', 500)
    }

    
})
