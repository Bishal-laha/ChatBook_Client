import { createSlice } from "@reduxjs/toolkit";
import { adminLogin, getAdmin, logoutAdmin } from "../thunk/admin";
import toast from "react-hot-toast";

const authSlice = createSlice({
    name:"auth",
    initialState:{
        userData:null,
        isLogin:false,
        isAdmin:false,
        isLoader:true
    },
    reducers:{
        userLogin:(state,action)=>{
            state.userData = action.payload;
            state.isLogin = true;
            state.isLoader = false;
        },
        userLogout:(state)=>{
            state.userData = null;
            state.isLogin = false;
            state.isLoader = false;
        },
        changeUserData:(state,action)=>{
            state.userData = action.payload;
        }
    },
    extraReducers: (builder)=>{
        builder.addCase(adminLogin.fulfilled, (state,action)=>{
                    state.isAdmin = true;
                    toast.success(action.payload);
                })
               .addCase(adminLogin.rejected, (state,action)=>{
                    state.isAdmin = false;
                    toast.error(action.error.message);
               })
               .addCase(getAdmin.fulfilled, (state,action)=>{
                    if(action.payload)
                        state.isAdmin = true;
                    else    
                        state.isAdmin = false;
               })
               .addCase(getAdmin.rejected, (state)=>{
                    state.isAdmin = false;
               })
               .addCase(logoutAdmin.fulfilled, (state,action)=>{
                    state.isAdmin = false;
                    toast.success(action.payload);
                })
               .addCase(logoutAdmin.rejected, (state,action)=>{
                    state.isAdmin = true;
                    toast.error(action.error.message);
               })
    }
});

export const {userLogin,userLogout,changeUserData} = authSlice.actions;
export default authSlice.reducer;