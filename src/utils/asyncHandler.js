const asyncHandler = (requestHandler) =>{
    (res,res,next) =>{
        Promise.resolve(requestHandler(res,res,next)).
        catch((err)=>next(err))
    }

}

export {asyncHandler}