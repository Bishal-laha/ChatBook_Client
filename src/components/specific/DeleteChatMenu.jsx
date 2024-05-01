import { Menu, Stack, Typography } from '@mui/material';
import { PersonRemove as PersonRemoveIcon, ExitToApp as ExitToAppIcon, } from "@mui/icons-material";
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setIsDeleteMenu } from '../../store/slice/misc';
import { useDeleteChatMutation, useLeaveGroupMutation } from '../../store/api/api';
import { useAsyncMutation } from '../../hooks/hooks';

const DeleteChatMenu = ({ deleteMenuAnchor }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isDeleteMenu, selectedDeleteChat } = useSelector((state) => state.misc);
    const [deleteChat, _, deleteChatData] = useAsyncMutation(useDeleteChatMutation);
    const [leaveGroup, __, deleteLeaveGroupData] = useAsyncMutation(useLeaveGroupMutation);
    const isGroup = selectedDeleteChat.isGroupChat;

    const closeHandler = () => {
        dispatch(setIsDeleteMenu(false));
        deleteMenuAnchor.current = null;
    }
    const leaveGroupHandler = () => {
        closeHandler();
        leaveGroup("Leaving Group....", selectedDeleteChat.chatId);
    }
    const deleteChatHandler = () => {
        closeHandler();
        deleteChat("Deleting Chat....", selectedDeleteChat.chatId);
    }

    useEffect(() => {
        if (deleteChatData || deleteLeaveGroupData) navigate("/");
    }, [deleteChatData, deleteLeaveGroupData]);

    return (
        <Menu open={isDeleteMenu} onClose={closeHandler} anchorEl={deleteMenuAnchor.current}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "center", horizontal: "center" }}>
            <Stack sx={{ width: "10rem", padding: "0.5rem", cursor: "pointer" }}
                direction={"row"} alignItems={"center"} spacing={"0.5rem"}
                onClick={isGroup ? leaveGroupHandler : deleteChatHandler}
            >
                {isGroup ? (
                    <>
                        <ExitToAppIcon />
                        <Typography>Leave Group</Typography>
                    </>
                ) : (
                    <>
                        <PersonRemoveIcon />
                        <Typography>Unfriend</Typography>
                    </>
                )}
            </Stack>
        </Menu>
    )
}

export default DeleteChatMenu