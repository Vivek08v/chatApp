import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useAuthStore = create((set) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,
    onlineUsers: [],

    checkAuth: async () => {
        try{
            const res = await axiosInstance.get("/auth/check")
            console.log("RESPONSE FROM SERVER: ", res.data);
            set({authUser: res.data.data})
        }
        catch(error){
            console.log("Error in checkAuth API:", error)
            set({authUser: null})
        }
        finally {
            set({isCheckingAuth: false})
        }
    },

    signup: async(data) => {
        set({isSigningUp: true});
        try{
            const res = await axiosInstance.post("/auth/signup", data);
            console.log("RESPONSE FROM SERVER: ", res.data);
            set(({ authUser: res.data.data}))
            toast.success("Account created successfully");
        }
        catch(error){
            console.log("Error in signup API:", error)
            toast.error("Error in signup API:", error.response.data.data.message)
        }
        finally{
            set({ isSigningUp: false});
        }
    },

    login: async(data) => {
        set({isLoggingIn: true});
        try{
            const res = await axiosInstance.post("/auth/login", data);
            console.log("RESPONSE FROM SERVER: ", res.data);
            set(({ authUser: res.data.data}))
            toast.success("User LoggedIn successfully");
        }
        catch(error){
            console.log("Error in login API:", error.response.data.message)
            toast.error("Error in login API:", error.response.data.message)
        }
        finally{
            set({ isLoggingIn: false});
        }
    },

    logout: async () => {
        try{
            const res = await axiosInstance.get("auth/logout")
            console.log("RESPONSE FROM SERVER: ", res.data);
            set({authUser : null})
            toast.success("Logged out successfully")
        }
        catch(error){
            console.log("Error in logout API:", error)
            console.log("Error in logout API:",error.response.data.data.message);
        }
    },

    updateProfile: async (data) => {
        set({isUpdatingProfile: true});
        try{
            const res = await axiosInstance.put("/auth/update-profile", data);
            console.log("RESPONSE FROM SERVER: ", res.data);
            set({authUser: res.data.data})
            toast.success("Profile updated successfully");
        }
        catch(error){
            console.log("Error in update API:", error);
            toast.error("Error in update API:", error.response.data.data);
        }
        finally{
            set({isUpdatingProfile: false});
        }
    }
}))
