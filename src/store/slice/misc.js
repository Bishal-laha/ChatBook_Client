import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isDarkMode:false,
  isFriend:[],
  isNewGroup: false,
  isAddMember: false,
  isNotification: false,
  isMobileView:false,
  isMobileAvatar:false,
  isSearch: false,
  isFileMenu: false,
  isDeleteMenu: false,
  uploadingLoader: false,
  selectedDeleteChat: {
    chatId: "",
    isGroupChat: false,
  },
};

const miscSlice = createSlice({
  name: "misc",
  initialState,
  reducers: {
    setIsDarkMode: (state,action)=>{
      state.isDarkMode = action.payload;
    },
    setIsNewGroup: (state, action) => {
      state.isNewGroup = action.payload;
    },
    setIsAddMember: (state, action) => {
      state.isAddMember = action.payload;
    },
    setIsNotification: (state, action) => {
      state.isNotification = action.payload;
    },
    setIsMobileView:(state,action)=>{
        state.isMobileView = action.payload;
    },
    setIsMobileAvatar:(state,action)=>{
        state.isMobileAvatar = action.payload;
    },
    setIsSearch: (state, action) => {
      state.isSearch = action.payload;
    },
    setIsFileMenu: (state, action) => {
      state.isFileMenu = action.payload;
    },
    setIsDeleteMenu: (state, action) => {
      state.isDeleteMenu = action.payload;
    },
    setUploadingLoader: (state, action) => {
      state.uploadingLoader = action.payload;
    },
    setSelectedDeleteChat: (state, action) => {
      state.selectedDeleteChat = action.payload;
    },
    setIsFriendTrue: (state,action)=>{
      state.isFriend.push(action.payload);
    },
    setIsFriendFalse: (state,action)=>{
      const newArray = state.isFriend.filter((item)=>item !== action.payload);
      state.isFriend = [...newArray];
    }
  },
});

export default miscSlice.reducer;
export const {setIsNewGroup,setIsAddMember,setIsNotification,setIsMobile,setIsSearch,setIsFileMenu,
  setIsDeleteMenu,setUploadingLoader,setSelectedDeleteChat,setIsMobileView,setIsFriendTrue,setIsFriendFalse,setIsDarkMode,setIsMobileAvatar} = miscSlice.actions;