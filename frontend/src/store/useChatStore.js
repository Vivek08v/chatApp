import { create } from "zustand";
import toast from "react-hot-toast";

import { axiosInstance } from "../lib/axios";

export const useChatStore = create((set) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: true,

    getUsers: async () => {
        set({ isUsersLoading: true});
        try{
            const res = await axiosInstance.get("/messages/users");
            console.log("RESPONSE FROM SERVER: ", res.data)
            set({ users: res.data.data });
        }
        catch(error){
            console.log(error.response.data.data);
            toast.error(error.response.data.data);
        }
        finally{
            set({isUsersLoading: false})
        }
    },
    getMessages: async (userId) => {
        set({ isMessagesLoading: true});
        try{
            const res = await axiosInstance.get(`/messages/${userId}`);
            console.log("RESPONSE FROM SERVER: ", res.data)
            set({ messages: res.data });
        }
        catch(error){
            console.log(error.response.data.data);
            toast.error(error.response.data.data);
        }
        finally{
            set({isMessagesLoading: false})
        }
    },

    // todo: Optimize this later
    setSelectedUser: (selectedUser) => set({selectedUser})
}))
