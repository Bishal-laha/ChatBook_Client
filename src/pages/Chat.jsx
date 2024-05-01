import { Stack, IconButton, Skeleton, Typography, } from "@mui/material";
import { Send as SendIcon, AttachFile as AttachFileIcon, KeyboardBackspace as KeyboardBackIcon } from "@mui/icons-material";
import { useRef, Fragment, useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useInfiniteScrollTop } from "6pp";
import AppLayout from '../components/layout/AppLayout';
import { TypingLoader } from "../components/layout/Loaders";
import { FileMenu } from '../components/specific/Index';
import { MessageComponent } from '../components/shared/Index';
import { ChatInputBox } from '../components/style/styledCustomComponents';
import { ALERT, CHAT_EXIT, CHAT_JOIN, NEW_MESSAGE, START_TYPING, STOP_TYPING } from "../constants/socketEvents";
import { useChatDetailsQuery, useGetOldMessagesQuery } from "../store/api/api";
import { removeNewMessagesAlert } from "../store/slice/notification";
import { setIsFileMenu } from "../store/slice/misc";
import { useErrors, useSocketEvents } from "../hooks/hooks";
import { getSocket } from "../socket";
import { chatBgColor } from "../constants/color";

const Chat = ({ chatId }) => {
    const containerRef = useRef(null);
    const bottomRef = useRef(null);
    const socket = getSocket();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [message, setMessage] = useState("");
    const [chatMessage, setChatMessage] = useState([]);
    const [page, setPage] = useState(1);
    const [meTyping, setMeTyping] = useState(false);
    const [userTyping, setUserTyping] = useState(false);
    const [fileMenuAnchor, setFileMenuAnchor] = useState(null);
    const typingTimeout = useRef(null);
    const { userData } = useSelector((state) => state.auth);
    const oldMessageDetails = useGetOldMessagesQuery({ chatId, page });
    const chatDetails = useChatDetailsQuery({ chatId, skip: !chatId });
    const members = chatDetails?.data?.data?.members;

    const { data: oldMessageModified, setData: setOldMessageModified } = useInfiniteScrollTop(containerRef, oldMessageDetails?.data?.data?.totalPage, page, setPage, oldMessageDetails?.data?.data?.message);

    const handleFileOpen = (e) => {
        dispatch(setIsFileMenu(true));
        setFileMenuAnchor(e.currentTarget);
    };
    const messageOnChange = (e) => {
        setMessage(e.target.value);
        if (!meTyping) {
            socket.emit(START_TYPING, { members, chatId });
            setMeTyping(true);
        }
        if (typingTimeout.current) clearTimeout(typingTimeout.current);
        typingTimeout.current = setTimeout(() => {
            socket.emit(STOP_TYPING, { members, chatId });
            setMeTyping(false);
        }, [1000]);
    }

    const errors = [
        { isError: chatDetails.isError, error: chatDetails.error },
        { isError: oldMessageDetails.isError, error: oldMessageDetails.error },
    ];

    const formSubmitHandler = (e) => {
        e.preventDefault();
        if (!message.trim()) return;
        socket.emit(NEW_MESSAGE, { chatId, members, message });
        setMessage("");
    }

    useEffect(() => {
        if (bottomRef.current)
            bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }, [chatMessage]);

    useEffect(() => {
        if (chatDetails.isError) return navigate("/");
    }, [chatDetails.isError]);

    useEffect(() => {
        socket.emit(CHAT_JOIN, { userId: userData._id, members });
        dispatch(removeNewMessagesAlert(chatId));
        return () => {
            socket.emit(CHAT_EXIT, { userId: userData._id, members });
            setChatMessage([]);
            setMessage("");
            setPage(1);
            setOldMessageModified([]);
        }
    }, [chatId]);

    const newMessageListener = useCallback((data) => {
        if (data.chatId !== chatId) return;
        setChatMessage((prev) => [...prev, data.message]);
    }, [chatId]);

    const startTypingListener = useCallback((data) => {
        if (data.chatId !== chatId) return;
        setUserTyping(true);
    }, [chatId]);

    const stopTypingListener = useCallback((data) => {
        if (data.chatId !== chatId) return;
        setUserTyping(false);
    }, [chatId]);

    // const alertListener = useCallback((data) => {
    //     console.log(data);
    //     console.log(chatId);
    //     // if (data.chatId !== chatId) return;
    //     // if (data.message) {
    //     const messageForAlert = {
    //         // _id: Math.floor(Math.random() * 100),
    //         content: data.message,
    //         sender: { _id: "djasdhajksdhasdsadasdas", fullName: "Admin" },
    //         chat: chatId,
    //         createdAt: new Date().toISOString(),
    //     };
    //     console.log(messageForAlert);
    //     setChatMessage((prev) => [...prev, messageForAlert]);
    //     // }

    // }, [chatId]);

    const eventHandlers = {
        [NEW_MESSAGE]: newMessageListener,
        [START_TYPING]: startTypingListener,
        [STOP_TYPING]: stopTypingListener,
        // [ALERT]: alertListener
    };

    useSocketEvents(socket, eventHandlers);
    useErrors(errors);
    const allChatMessages = [...oldMessageModified, ...chatMessage];

    return (
        chatDetails.isLoading ? (<Skeleton />) : (<Fragment>
            <Stack ref={containerRef} boxSizing={"border-box"} position={"relative"} padding={"1rem"} spacing={"1rem"} bgcolor={chatBgColor} height={"90%"} sx={{ overflowX: "hidden", overflowY: "auto" }}>
                <IconButton sx={{ position: "absolute", top: "0.5rem", left: "0.5rem", padding: "0.4rem 0.4rem", bgcolor: "#1c1c1c", color: "white", ":hover": { bgcolor: "rgba(0,0,0,0.7)", } }} onClick={() => navigate("/")}><KeyboardBackIcon />
                </IconButton>
                {allChatMessages.length === 0 ? (<Typography variant="body1" color={"#515159"} textAlign={"center"}>No Messages Till Now</Typography>) : (allChatMessages.map((i, id) => <MessageComponent key={id} metaMessage={i} user={userData} />))}
                {userTyping && <TypingLoader />}
                <div ref={bottomRef} />
            </Stack>

            <form style={{ height: "10%" }} onSubmit={formSubmitHandler}>
                <Stack direction={"row"} height={"100%"} padding={"1rem"} alignItems={"center"} position={"relative"} bgcolor={chatBgColor} >
                    <IconButton sx={{ position: "absolute", left: "1.5rem", marginRight: "5px", rotate: "30deg", bgcolor: (theme) => (theme.palette.mode === 'dark' ? "rgba(0,0,0,0.8)" : "rgba(0,0,0,0.1)"), "&:hover": { bgcolor: (theme) => (theme.palette.mode === 'dark' ? "rgba(0,0,0,0.4)" : "rgba(0,0,0,0.5)") } }} onClick={handleFileOpen} >
                        <AttachFileIcon />
                    </IconButton>
                    <ChatInputBox placeholder="Type Message Here..." value={message} onChange={messageOnChange} />
                    <IconButton type="submit" sx={{
                        rotate: "-30deg", bgcolor: "#464782", color: "white", padding: "0.5rem", marginLeft: "1rem", "&:hover": { bgcolor: "#3f3f6e" }
                    }}>
                        <SendIcon />
                    </IconButton>
                </Stack>
            </form>
            <FileMenu anchorE1={fileMenuAnchor} chatId={chatId} />
        </Fragment >)
    )
}

export default AppLayout()(Chat);