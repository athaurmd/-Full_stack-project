class CustomError extends error{
    constructor(message, code){
        super(message);
        this.code = code
    }
}

export default CustomError