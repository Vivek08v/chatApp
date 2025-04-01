import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const protectRoute = async(req, res, next) => {
    try{
        const token = req.cookies.jwt;  // jwt is token name
        
        if(!token){
            return res.status(400).json({
                success: false,
                message: "Unauthorized - No Token Provided"
            })
        }
        // console.log("hi");

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if(!decoded){
            return res.status(400).json({
                success: false,
                message: "Unauthorized - Incorrect Token"
            })
        }
        const user = await User.findById(decoded.userId).select("-password");

        if(!user){
            return res.status(400).json({
                success: false,
                message: "Unauthorized - No Token Provided"
            })
        }

        req.user = user;

        next();
    }
    catch(error){
        console.log("Error in protect route", error)
        return res.status(400).json({
            success: false,
            message: "Something went wrong in protect route"
        })
    }
}