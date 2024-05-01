import { Typography, Box, Stack } from "@mui/material";
import { memo } from "react";
import { motion } from "framer-motion";
import { AvatarCard } from "./Index";
import { Link } from '../style/styledCustomComponents'
import { chatListHoverColor, lightNewMessageNotificationColor } from "../../constants/color";

const ChatItem = ({ avatar = [], name, _id, isOnline, newMessageAlert, isGroupChat, sameSender, index = 0, handleDeleteChat }) => {
    return (
        <Link to={`/chat/${_id}`} onContextMenu={(e) => handleDeleteChat(e, _id, isGroupChat)}>
            <motion.div initial={{ opacity: 0, y: "-100%" }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * index }}
                style={{ display: "flex", gap: "1rem", alignItems: "center", backgroundColor: sameSender ? `${chatListHoverColor}` : "unset", position: "relative", padding: "0.8rem", borderRadius: "10px", transitionDuration: "300ms", "&hover": { transitionDuration: "300ms" } }}>

                <AvatarCard avatar={avatar} />
                <Stack>
                    <Typography color={(theme) => (theme.palette.mode === 'dark') ? "white" : "black"} fontSize={"1.1rem"}>{name}</Typography>
                    {newMessageAlert && <Typography variant="caption" color={lightNewMessageNotificationColor} marginTop={"5px"}>{newMessageAlert.messageCount} New Message</Typography>}
                </Stack>

                {isOnline && <Box sx={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "green", position: "absolute", top: "50%", right: "1rem", transform: "translateY(-50%)" }} />}
            </motion.div>
        </Link >
    )
}

export default memo(ChatItem);