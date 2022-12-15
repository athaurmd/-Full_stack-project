import mongoose from 'mongoose';


const productSchema = new mongoose.Schema(
{
        name : {
            type : String,
            required : [true, "Please provide product name"],
            trim : true,
            maxLength : [20, "Product name should not be greater than 20 characters"],
        },
        
        price : {
            type : Number,
            required : [true, "Please provide Price of product"],
            maxLength : [6, "Price must not be greater than 6 digits"],
        },
        description : {
            type : String,
            //Assignment to add npm editor and markdown
        },
        photos :[ {
            _url : {
                type : String,
                required : true
            }
            
        }],
        stock : {
            type : Number,
            default : 0
        },
        slod : {
            type : Number,
            default : 0
        },
        collectionId : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Collection"
        }
        

},
{
    timestamps : true
}
);

export default mongoose.model("Product", productSchema);