import {createAsyncThunk} from "@reduxjs/toolkit";
import axios from "axios";

export const adminLogin = createAsyncThunk("admin/login", async (secretKey)=>{
    try {
        const config = {withCredentials:true,headers:{"Content-Type":"application/json"}};
        const {data} = await axios.post(`${import.meta.env.VITE_SERVER}/api/v1/admin/verify`,{secretKey},config);
        return data.message;
    } catch (error) {
        throw error.response.data.message;
    }
}); 

export const getAdmin = createAsyncThunk("admin/getAdmin", async ()=>{
    try {
        const config = {withCredentials:true};
        const {data} = await axios.get(`${import.meta.env.VITE_SERVER}/api/v1/admin/`,config);
        return data.isAdmin;
    } catch (error) {
        throw error.response.data.message;
    }
}); 

export const logoutAdmin = createAsyncThunk("admin/lpgOutAdmin", async ()=>{
    try {
        const config = {withCredentials:true};
        const {data} = await axios.get(`${import.meta.env.VITE_SERVER}/api/v1/admin/logout`,config);
        return data.message;
    } catch (error) {
        throw error.response.data.message;
    }
}); 