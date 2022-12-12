import mongoose from 'mongoose';


const productSchema = new mongoose.Schema(
{
        name : {
            type : String,
            required : [true, "Please provide product name"],
            trim : true,
            maxLength : [20, "Product name should not be greater than 20 characters"],
        },

},
{
    timestamps : true
}
);

export default mongoose.model("Product", productSchema);