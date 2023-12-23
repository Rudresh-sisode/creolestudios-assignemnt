import jwt from "jsonwebtoken";
import moment from "moment";
import UserTableModel from "../models/user-model";
import bcrypt from 'bcrypt';


require('dotenv').config();

const authMiddleware = async (req: any, res: any, next: any) => {
    let step = 1;
    try {
        const authHeader = req.get("Authorization");
        if (!authHeader || authHeader == null) {
            throw new Error("Auth Header missing!");
        }

        //@ts-ignore
        const comingToken = req.headers.authorization.split(" ")[1];
        step = 2; // verifying if token matches or not
        const decodedToken: any = jwt.verify(comingToken, process.env.JWT_TOKEN_KEY as string);

        //if token is not valid
        if (!decodedToken) {
            throw new Error("Invalid Token!");
        }

        // decoding the JWT token
        req.email = decodedToken.emailId;
        req.name = decodedToken.userName;
        req.keyId = decodedToken.keyId;
        req.expiredTime = decodedToken.tokenTime;
        req.password = decodedToken.password;
        req.role = decodedToken.role;

        if (moment().isAfter(req.expiredTime)) {
            // verifying the expiration time
            throw new Error("Login Expired, Please Login Again.");
        }

        step = 3.5; // checking if the user exist or not
        const isUserExist: any = await UserTableModel.findOne({ where: { id: req.keyId, is_deleted: false }, raw: true, attributes: ["id", ["is_active", "isActive"], ["password_hash", "password"]] });
        if (!isUserExist || isUserExist == undefined || isUserExist == null) {
            throw new Error("Invalid credentials!");
        }

        //check if the user has been inactive
        step = 3.6;
        if (!isUserExist.isActive) {
            throw new Error("Invalid credentials!");
        }

        const isPasswordCorrect = await bcrypt.compare(req.password, isUserExist.password);
        if (!isPasswordCorrect) {
            throw new Error("Password changed, Login again!");
        }

        console.log("You are authorized, go ahead.", req);
        return next(); // if succeeded, go ahead

    } catch (error: any) {
        console.log(`step ${step}, your auth-middleware error: ${error.message}`);
        console.log("Authorization failed!");
        res.status(401).json({
            status: "error",
            message: error.message === "jwt expired" ? "Please, login again!" : error.message,
        });
    }
};

export default authMiddleware;