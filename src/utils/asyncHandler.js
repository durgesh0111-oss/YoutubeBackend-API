export const asyncHandler = (asyncHandler) => {
    (req, res, next) => Promise.resolve(asyncHandler(req,res,next)).catch((err)=>next(err))
    
}

//higher function 
// const asyncHandler = (fn) => async(req,res,next) => { 
//     try {
//         await fn(req,res,next)
//     } catch (err) {
//         res.status(err.code || 500).json{
//             success: false;
//             message : err.message
//         }
//         console.log("err " ,err);
        
//     }
// }
