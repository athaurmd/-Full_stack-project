import asyncHandler from '../services/asyncHandler'
import Collection from '../models/collection.schema'
import CustomError from '../utils/customError'

export const createCollection = asyncHandler(async (req, res)=>{
    const {name} = req.body

    if (!name) {
        throw new CustomError("Collection Name is requird", 400) 
    }

    const collection = await Collection.create()

})




export const updateCollection = asyncHandler(async(req, res)=>{
    const {id : collectionId} = req.params


    const collectionToDelete = await Collection.findByIdAndDelete(collectionId)

    if (!collectionToDelete) {
        throw new CustomError("Collection not Found", 400) 
    }

    collectionToDelete.remove()

    res.status(200).json({
        success : true,
        message : "Collection Found",
        updateCollection
    })
})