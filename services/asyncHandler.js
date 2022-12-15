const asyncHandler = (fn) => async () => {
    try {
        await fn(req, res, next)
        
    } catch (err) {
        res.status(err.code || 500).json({
            success : false,
            message : err.message
        })
    }

}

export default asyncHandler;