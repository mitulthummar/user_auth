import express, { Application, Request, Response, response } from "express";
import dotenv from "dotenv"
import { DBUtil } from "./util/DButil";
import { hostname } from "os";
import userRouter from "./router.ts/userRouter";

const app: Application = express();

app.use(express.json())

dotenv.config({
    path: ".env"
})

const Port: string | number = process.env.PORT || 2141;
const Hostname: string | undefined = process.env.HOST;
const dbname: string | undefined = process.env.MONGO_DB_DATABASE;
const dburl: string | undefined = process.env.MONGO_DB_URL;

app.get("/", (request: Request, response: Response) => {
    response.status(200).json({
        msg: "this is home page"
    })
})

app.use("/user",userRouter)

    if (Port && Hostname) {
        app.listen(Number(Port),Hostname,()=>{
            if(dbname&&dburl){
                console.log(`${dbname}-${dburl}`)
                DBUtil.ConnectToDB(dburl,dbname).then((dbresponse)=>{
                    console.log(dbresponse)
                }).catch((error)=>{
                    console.log(error);
                    process.exit(0)
                })
            }
            console.log(`express server started at http://${Hostname}:${Port}`)
        })
    }