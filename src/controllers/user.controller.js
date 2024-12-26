import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";


const register = asyncHandler( async (req, res)=>{

    //temp API Testing
    // res.status(200).json({
    //     message: "OK"
    // })

    //algorithm
    // 1. get all details from the Server 
    // 2. if the required fields are not given , send error 
    // 3. check if user already exists or not - with unique and not null fields
    // 4. Check if all the images are given - avatar and cover image
    // 5. upload images to cloudinary
    // 6. check successfull check on cloudinary for avatar upload
    // 7. create user object
    // 8 . create entry in DB
    // 9. Remove password and refresh token field from db
    // 10. check for user creation - return response

    const {email, username, fullname, password} = req.body
    console.log(email,"email")
    console.log(fullname,"fullname")
    console.log(username,"username")
    console.log(password,"password")

    if(fullname === "" || fullname === undefined){
        throw new ApiError(400, "fullname is required")
    }
    if(username === "" || username === undefined){
        throw new ApiError(400, "username is required")
    }
    if(password === "" || password === undefined){
        throw new ApiError(400, "password is required")
    }
    if(email === "" || email === undefined){
        throw new ApiError(400, "email is required")
    }

  
 

    const existedUser = await User.findOne({
        $or:[{username}, {email}]
    })

    

    if(existedUser){
        throw new ApiError(409," User already exists!!!")
    }


    console.log(req.files,"req.files")
   const avatarLocalPath =  req.files?.avatar[0]?.path ;
//    const coverImageLocalPath = req.files?.coverImage[0]?.path;
   let coverImageLocalPath;
   if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
       coverImageLocalPath = req.files.coverImage[0].path
   }

   if(!avatarLocalPath){
    throw new ApiError(400,"avatar is required!!!")
   }

   const avatar = await uploadOnCloudinary(avatarLocalPath);
   const coverImage = await uploadOnCloudinary(coverImageLocalPath);

   if(!avatar){
    throw new ApiError(400,"avatar is required!!!")
   }

  const user = await  User.create({
    fullname,
    avatar : avatar.url,
    coverImage : coverImage?.url || "",
    username : username.toLowerCase(),
    email,
    password
   })

   const createduser = await User.findById(user._id).select(
    "-password -refreshToken"
   );

   if(!createduser){
    throw new ApiError(500, "Something went wrong while creating the user!!!")
   }

   return res.status(201).json(
    new ApiResponse(201, createduser, "User Registered Successfully !!!")
   )



 


    


})

export {
    register
}