import mongoose from "mongoose";

export class DBUtil{
    public static ConnectToDB(dburl:string,dbname:string):Promise<string>{
        return new Promise((resolve,reject)=>{
            mongoose.connect(dburl,{
                dbName:dbname
            },(error)=>{
                if(error){
                    reject("Connection failed to MongoDB")
                }
                else{
                    resolve("Connection Successfully")
                }
            })
        })
    }
}