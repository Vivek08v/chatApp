import { generateToken } from "../lib/utils.js";
import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs"

export const signup = async(req, res) => {
    // res.send("signIn route")
    try{
        const {fullName, email, password} = req.body;  // becoz of app.use(express.json())

        if(!fullName || !email || !password){
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }

        const user = await User.findOne({email});

        if(user){
            return res.status(400).json({
                success: false,
                message: "User already exists"
            })
        }

        if(password.length < 6){
            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters"
            })
        }

        // hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullName: fullName,
            email: email,
            password: hashedPassword,
        })

        if(newUser){
            // generate jwt token here
            generateToken(newUser._id, res);
            const storedUser = await newUser.save();

            return res.status(201).json({
                success: true,
                data: storedUser,
                message: "User added Successfully"
            })
        }
        else{
            return res.status(400).json({
                success: false,
                message: "Invalid user data"
            })
        }
    }
    catch(error){
        console.log("Error in signup controller", error.message);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while signup"
        })
    }
}

export const login = async(req, res) => {
    try{
        const {email, password} = req.body;
        if(!email || !password){
            res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }

        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({
                success: false,
                message: "Invalid Credentials"  // user donot exists
            })
        }

        const isPassCorrect = await bcrypt.compare(password, user.password);
        if(!isPassCorrect){
            // console.log("hi");
            return res.status(400).json({
                success: false,
                message: "Invalid Credentials" // Incorrect password
            })
        }

        generateToken(user._id, res);
        
        return res.status(200).json({
            success: true,
            data: user,
            message: "loggedIn successfully"
        })
    }
    catch(error){
        console.log("Error in login controller", error.message);
        return res.status(500).json({
            success: false,
            message: "something went wrong while login"
        })
    }
}

export const logout = (req, res) => {
    try{
        res.cookie("jwt", "", {maxAge: 0})
        res.status(200).json({
            success: true,
            message: "Logged Out Successfully"
        })
    }
    catch(error){
        console.log("Error in logout controller", error.message);
        res.status(500).json({
            success: false,
            message: "something went wrong while logout"
        })
    }
}