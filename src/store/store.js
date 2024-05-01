import {configureStore} from "@reduxjs/toolkit";
import authReducer from "./slice/auth.js";
import miscReducer from "./slice/misc.js";
import notificationReducer from "./slice/notification.js";
import api from "./api/api.js";

const store = configureStore({
    reducer:{
        auth:authReducer,
        [api.reducerPath]:api.reducer,
        misc:miscReducer,
        notification:notificationReducer,
    },
    middleware:(defaultMiddleware) => [...defaultMiddleware(),api.middleware]
});
export default store;