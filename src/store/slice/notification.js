import { createSlice } from "@reduxjs/toolkit";
import { getOrSaveFromStorage } from "../../libs/Features";
import { NEW_ALERT_MESSAGE } from "../../constants/socketEvents";

const notificationSlice = createSlice({
    name:"notification",
    initialState:{
        notificationCount:0,
        newMessagesAlert: getOrSaveFromStorage({key:NEW_ALERT_MESSAGE,get:true}) || [{chatId:"",messageCount:0}]
    },
    reducers:{
        incrementNotification: (state)=>{
            state.notificationCount += 1;
        },
        resetNotification: (state)=>{
            state.notificationCount = 0;
        },
        setNewMessagesAlert: (state,action)=>{
            const index = state.newMessagesAlert.findIndex((item)=>item.chatId === action.payload.chatId);
            if(index !== -1){
                state.newMessagesAlert[index].messageCount += 1;
            }else{
                state.newMessagesAlert.push({
                    chatId:action.payload.chatId,
                    messageCount:1,
                })
            }
        },
        removeNewMessagesAlert: (state,action)=>{
            state.newMessagesAlert = state.newMessagesAlert.filter((item)=>item.chatId !== action.payload);
        },
    }
});

export default notificationSlice.reducer;
export const {incrementNotification,resetNotification,setNewMessagesAlert,removeNewMessagesAlert} = notificationSlice.actions;