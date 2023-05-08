import { Router,Request,Response } from "express";
import {body} from "express-validator";
import * as userController from "../controller/userCotroller"

const userRouter:Router=Router();

userRouter.post("/register",[
    body('name').not().isEmpty().withMessage("name is required"),
    body('email').not().isEmpty().withMessage("Email is required"),
    body('password').not().isEmpty().withMessage("Password is required")
],async(request:Request,response:Response)=>{
    await userController.createUser(request,response)
})

userRouter.post("/login",[
    body('email').not().isEmpty().withMessage("Email is required"),
    body('password').not().isEmpty().withMessage("Password is required")
],async(request:Request,response:Response)=>{
    await userController.loginUser(request,response)
})

export default userRouter