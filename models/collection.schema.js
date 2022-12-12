import mongoose from 'mongoose';


const collectionSchema = new mongoose.Schema(
{
        name : {
            type : String,
            required : [true, "Please provide collection name"],
            trim : true,
            maxLength : [20, "Collection name should not be greater than 20 characters"],
        },

},
{
    timestamps : true
}
);

export default mongoose.model("Collection", collectionSchema);