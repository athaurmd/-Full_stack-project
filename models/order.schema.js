import mongoose from 'mongoose'

const orderSchema = new mongoose.Schema(
    {
        products : {
            type : [
                {
                    productId :{
                        type : mongoose.Schema.Types.ObjectId,
                        ref : "Product",
                        required : true
                    },
                    count : Number,
                    price : Number
            }
                
            ],
            required : true
        },
        user : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User",
            required : true
        },
        phoneNumber : {
            type : Number,
            required : true
        },
        amount : {
            type : Number,
            required : true
        },
        coupon : String,
        transactionId : String,
        status : {
            type : String,
            enum : ["Ordered","SHIPPED","DELIVERED","CANCELLED"],
            default : "Ordered"
        }
        //paymentMOde : 


},
{
    timestamps : true
}
)

export default mongoose.model("Order", orderSchema)