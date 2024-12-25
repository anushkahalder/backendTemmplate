
import  dotenv from "dotenv";
import connectDB from "./db/index.js"
import { app } from "./app.js";

dotenv.config({
    path:'./env'
})

console.log(process.env) 

connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000 , ()=>{
        console.log(`App listeninh to PORT: ${process.env.PORT}`)
    })
})
.catch((err)=>{
    console.log(err,"MONGO DB CONNECTION ERROR")
})