import mongoose from "mongoose";
import { Request,Response } from "express";
import { APP_STATUS } from "../constants/constants";
import {validationResult} from "express-validator"
import userTable from "../database/userSchema";
import bcryptjs from "bcryptjs"
import { IUsers } from "../model/Iusers";
import jwt from "jsonwebtoken"

export const createUser=async(request:Request,response:Response)=>{
    const error=validationResult(request)
    if(!error.isEmpty()){
        return response.status(200).json({
            status:APP_STATUS.FAILED,
            data:null,
            error:error.array()
        })
    }
    try{
        let {name,email,password}=request.body;

        const usercheck=await userTable.findOne({email:email})
        if(usercheck){
            return response.status(400).json({
                status:APP_STATUS.FAILED,
                data:null,
                error:"user already exist"
            })
        }
        let Salt=await bcryptjs.genSalt(10)
        let hashpassword=await bcryptjs.hash(password,Salt)

        let userobj:IUsers={
            name:name,
            email:email,
            password:hashpassword
        }
        let userdata=await new userTable(userobj).save()

        if(userdata){
            return response.status(200).json(userdata)
        }
    }
    catch(error:any){
        return response.status(500).json({
            status:APP_STATUS.FAILED,
            data:null,
            error:error.message
        })
    }
}

export const loginUser=async(request:Request,response:Response)=>{
    const error=validationResult(request)
    if(!error.isEmpty()){
        return response.status(200).json({
            status:APP_STATUS.FAILED,
            data:null,
            error:error.array()
        })
    }
    try{
        let {email,password}=request.body;

        let userobj:IUsers|undefined|null=await userTable.findOne({email:email})
        if(!userobj){
            return response.status(400).json({
                status:APP_STATUS.FAILED,
                data:null,
                error:"Invalid Email address!"
            })
        }
        let isMatch:boolean=await bcryptjs.compare(password,userobj.password)
        if(!isMatch){
            return response.status(400).json({
                status:APP_STATUS.FAILED,
                data:null,
                error:"Invalid password!"
            })
        }

        let secretKey:string|undefined=process.env.JWT_SECRET_KEY

        let payload:any={
            user:{
                id:userobj._id,
                email:userobj.email
            }
        }
        if(payload&&secretKey){
            jwt.sign(payload,secretKey,{
                expiresIn:10000000
            },(error,encoded)=>{
                if(error) throw error;
                if(encoded){
                    return response.status(200).json({
                        status:APP_STATUS.SUCCESS,
                        msg:"Login Success!",
                        data:userobj,
                        token:encoded
                    })
                }
            })
        }
    }
    catch(error:any){
        return response.status(500).json({
            status:APP_STATUS.FAILED,
            data:null,
            error:error.message
        })
    }
}