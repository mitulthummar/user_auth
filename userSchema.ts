import mongoose from "mongoose";
import {IUsers} from "../model/Iusers";

const userSchema=new mongoose.Schema<IUsers>({
    name:{type:String,required:true},
    email:{type:String,required:true},
    password:{type:String,required:true}
},{timestamps:true})
const userTable=mongoose.model<IUsers>('users',userSchema)
export default userTable