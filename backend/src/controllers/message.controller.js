import cloudinary from "../lib/cloudinary.js";

import { User } from "../models/user.model.js";
import { Message } from "../models/message.model.js"

export const getUsersForSidebar = async(req, res) => {
    try{
        const loggedInUserId = req.user._id;
        const filteredUsers = await User.find({_id: {$ne: loggedInUserId} }).select("-password");

        return res.status(200).json({
            success: true,
            message: "sent users for side bar successfully",
            data: filteredUsers
        })
    }
    catch(error){
        console.log("Error in getUsersForSidebar: ", error.message);
        return res.status(500).json({
            success: false,
            message: "something went wrong while getting users for sidebar",
        })
    }
}

export const getMessages = async(req, res) => {
    try{
        const { id:userToChatId} = req.params;
        const myId = req.user._id;

        const messages = await Message.find({
            $or:[
                {senderId:myId, receiverId: userToChatId},
                {senderId:userToChatId, receiverId: myId}
            ]
        })

        return res.status(200).json({
            success: true,
            data: messages,
            message: "successfully got messages"
        })
    }
    catch(error){
        console.log("error in get messages", error.message);
        res.status(500).json({
            success: false,
            message: "something went wrong while getting messages"
        })
    }
}

export const sendMessage = async(req, res) => {
    try{
        console.log("hii");
        const { text, image} = req.body;
        const { id: receiverId } = req.params;  // id is renamed as receiverId
        const senderId = req.user._id;

        let imageUrl;
        if(image){
            // Upload base64 image to cloudinary
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl  // it can also be undefined
        })

        await newMessage.save();

        // todo: realtime functionality goes here => socket.io

        res.status(201).json({
            success: true,
            data: newMessage,
            message: "message sent Successfully"
        })
    }
    catch(error){
        console.log("error in send messages", error)
        return res.status(201).json({
            success: false,
            message: "something went wrong while sending messages"
        })
    }
}