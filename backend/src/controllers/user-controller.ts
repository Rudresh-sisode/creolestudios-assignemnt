
import validator from "validator";
import bcrypt from 'bcrypt';
import { Op, Sequelize } from "sequelize";
import jwt from "jsonwebtoken";
import moment from 'moment';
require('dotenv').config();
import path from "path";
import UserTableModel from "../models/user-model";

type UserRegister = {
    userName: string,
    email: string,
    password: string,
    isAdmin: boolean,
    role: string
}

const registerUser = async (req: any, res: any, next:any) => {
    let status = 200;
    try{

        let requesBody:UserRegister = req.body;

        if(validator.isEmpty(requesBody.userName.trim()) || validator.isEmpty(requesBody.email.trim()) || validator.isEmpty(requesBody.password.trim())){
            status = 400;
            throw new Error("Username, email and password are required!");
        }

        if(!validator.isEmail(requesBody.email.trim())){
            status = 400;
            throw new Error("Invalid email!");
        }

        const user:any = await UserTableModel.findOne({where:{email:requesBody.email.trim().toLowerCase(), is_deleted:false}, raw:true, attributes:["id"]});
        if(user && user != undefined && user != null){
            status = 400;
            throw new Error("User already exist!");
        }

        //hash the password
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(requesBody.password, salt);

        const userObj = {
            username: requesBody.userName.trim(),
            email: requesBody.email.trim().toLowerCase(),
            role: requesBody.role ? requesBody.role.trim().toUpperCase() : 'USER',
            is_admin: requesBody.isAdmin ? requesBody.isAdmin : false,
            password_hash: hashPassword,
            is_active: true,
            created_at: moment().utc().toDate(),
            created_by: req.keyId
        }

        //creating the user
        await UserTableModel.create(userObj);

        return res.status(status).json({
            status:"success",
            message:"User Created!"
        });

    }
    catch(error:any){
        console.log(`error: ${error}`);
        return res.status(status === 200 ? 500 : status).json({
            status:"error",
            message:error.message
        });
    }
}

const loginUser = async (req: any, res: any, next:any) => {
    let status = 200;
    try{

        let email:string = req.body.email;
        let password:string =  req.body.password;

        //with validator email and password shouldn't be empty
        if(validator.isEmpty(email.trim()) || validator.isEmpty(password.trim())){
            status = 400;
            throw new Error("Email and password are required!");
        }

        //with validator email should be valid
        if(!validator.isEmail(email.trim())){
            status = 400;
            throw new Error("Invalid email!");
        }

        //check if the user is registered or not
        const user:any = await UserTableModel.findOne({where:{email:email.trim().toLowerCase(), is_deleted:false}, raw:true, attributes:["id", "username", "is_active", "password_hash"]});
        if(!user || user == undefined || user == null){
            status = 401;
            throw new Error("Invalid credentials!");
        }

        //check if the user has been inactive
        if(!user.is_active){
            status = 401;
            throw new Error("Invalid credentials!");
        }

        //check if the password is correct or not
        const isPasswordCorrect = await bcrypt.compare(password, user.password_hash);
        if(!isPasswordCorrect){
            status = 401;
            throw new Error("Invalid credentials!");
        }

        //generate the token
        const token = jwt.sign({
            emailId: email,
            keyId: user.id,
            userName: user.username,
            tokenTime: moment().add(24, 'hours').utc().toDate(),
            password: password,
            role: user.role
        }, process.env.JWT_TOKEN_KEY as string);

        //send the token
        return res.status(status).json({
            status:"success",
            message:"successfully logged in!",
            data:{
                token:token,
                expiresIn: 3600,
                userName: user.username,
            }
        });

    }
    catch(error:any){
        console.log(`error: ${error}`);
        return res.status(status === 200 ? 500 : status).json({
            status:"error",
            message:error.message
        });
    }
}

export {registerUser, loginUser};