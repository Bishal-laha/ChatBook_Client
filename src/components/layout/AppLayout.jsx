import { useNavigate, useParams } from "react-router-dom";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useMediaQuery } from "react-responsive";
import toast from "react-hot-toast";
import { Drawer, Grid, Skeleton } from "@mui/material";
import { setIsDeleteMenu, setIsFriendFalse, setIsMobileView, setIsMobileAvatar, setSelectedDeleteChat } from "../../store/slice/misc";
import { ChatList, Profile, DeleteChatMenu } from "../specific/Index";
import Header from "./Header";
import { useMyChatsQuery } from "../../store/api/api";
import { incrementNotification, setNewMessagesAlert } from "../../store/slice/notification";
import { getSocket } from "../../socket";
import { getOrSaveFromStorage } from "../../libs/Features";
import { useErrors, useSocketEvents } from "../../hooks/hooks";
import { ALERT_MAIN_PAGE, NEW_ALERT_MESSAGE, NEW_FRIEND_REQUEST, ONLINE_USER, REFETCH, REQ_REJECT } from "../../constants/socketEvents";



const AppLayout = () => (WrapComponent) => {
    return () => {
        const params = useParams();
        const chatId = params.chatId;
        const dispatch = useDispatch();
        const navigate = useNavigate();
        const { newMessagesAlert } = useSelector((state) => state.notification);
        const { isMobileAvatar, isMobileView } = useSelector((state) => state.misc);
        const [onlineUsers, setOnlineUsers] = useState([]);
        const deleteMenuAnchor = useRef(null);
        const isMobileScreen = useMediaQuery({ maxWidth: 600 });
        const socket = getSocket();

        const { isLoading, data, isError, error, refetch } = useMyChatsQuery("");

        useErrors([{ isError, error }]);

        useEffect(() => {
            getOrSaveFromStorage({ key: NEW_ALERT_MESSAGE, value: newMessagesAlert });
        }, [newMessagesAlert]);

        useEffect(() => {
            if (isMobileScreen)
                dispatch(setIsMobileView(true));
            else
                dispatch(setIsMobileView(false));
        }, []);

        const newAlertMessageListener = useCallback((data) => {
            if (data.chatId === chatId) return;
            dispatch(setNewMessagesAlert(data));
        }, [chatId]);

        const newFriendRequestListener = useCallback(() => {
            dispatch(incrementNotification());
        }, [dispatch]);

        const onlineUserListener = useCallback((data) => {
            setOnlineUsers(data);
        }, []);

        const reqRejectListener = useCallback((data) => {
            dispatch(setIsFriendFalse(data?.receiverId));
        }, [dispatch]);

        const alertDeleteAccountListener = useCallback((data) => {
            toast.success(data?.message);
        }, []);

        const refetchListener = useCallback(() => {
            refetch();
            navigate("/");
        }, [refetch, navigate]);


        const eventHandlers = {
            [NEW_ALERT_MESSAGE]: newAlertMessageListener,
            [NEW_FRIEND_REQUEST]: newFriendRequestListener,
            [REFETCH]: refetchListener,
            [ONLINE_USER]: onlineUserListener,
            [REQ_REJECT]: reqRejectListener,
            [ALERT_MAIN_PAGE]: alertDeleteAccountListener,

        };
        useSocketEvents(socket, eventHandlers);

        const handleDeleteChat = (e, chatId, isGroupChat) => {
            dispatch(setIsDeleteMenu(true));
            dispatch(setSelectedDeleteChat({ chatId, isGroupChat }));
            deleteMenuAnchor.current = e.currentTarget;
        }

        return (
            <>
                <Header />
                <DeleteChatMenu deleteMenuAnchor={deleteMenuAnchor} />
                {isMobileView &&
                    <Drawer open={isMobileAvatar} onClose={() => dispatch(setIsMobileAvatar(false))}>
                        <ChatList chats={data?.data} chatId={chatId} handleDeleteChat={handleDeleteChat}
                            newMessagesAlert={newMessagesAlert} onlineUsers={onlineUsers} />
                    </Drawer>
                }
                <Grid container height={"calc(100vh - 4rem)"} >
                    <Grid item sm={4} md={3} sx={{ display: { xs: "none", sm: "block" } }} height={"100%"}>
                        {isLoading ? (<Skeleton height={"5rem"} variant="round" />) : (<ChatList chats={data?.data} chatId={chatId} handleDeleteChat={handleDeleteChat} newMessagesAlert={newMessagesAlert} onlineUsers={onlineUsers} />)}
                    </Grid>
                    <Grid item xs={12} sm={8} md={5} lg={6} height={"100%"}> <WrapComponent chatId={chatId} /></Grid>
                    <Grid item md={4} lg={3} sx={{ display: { xs: "none", md: "block" }, padding: "2rem", bgcolor: "rgba(0, 0, 0, 0.85)" }} height={"100%"}> <Profile /> </Grid>
                </Grid>
            </>
        )
    }
}
export default AppLayout