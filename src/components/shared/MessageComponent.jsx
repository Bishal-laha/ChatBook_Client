import { Typography, Box, Stack } from "@mui/material";
import { RenderAttachment } from "./Index";
import moment from "moment";
import { motion } from "framer-motion";
import { checkFileExtension } from "../../libs/Features";

const MessageComponent = ({ metaMessage, user }) => {
    const { sender, attachments = [], content, createdAt } = metaMessage;
    const sameSender = sender?._id === user?._id;
    const timeAgo = moment(createdAt).fromNow();

    return (
        <motion.div initial={{ opacity: 0, x: "-100%" }} whileInView={{ opacity: 1, x: 0 }}
            style={{
                alignSelf: sameSender ? "flex-end" : "flex-start", backgroundColor: "whitesmoke",
                color: "black", borderRadius: "5px", padding: "0.5rem 1rem 0.5rem 1rem", margin: " 2rem 0 0 2rem", width: "fit-content"
            }} >
            <Stack>
                {!sameSender &&
                    // <Box>
                    /* <IconButton ><Avatar sx={{ width: "25px", height: "25px" }} src={sender?.avatar?.url} /></IconButton> */
                    <Typography color={"lightblue"} fontWeight={"600"} variant="caption">{sender.fullName}</Typography>
                    // </Box>
                }

                {content && <Typography>{content}</Typography>}
                {attachments && attachments.map((item, index) => {
                    const url = item.url;
                    const fileType = checkFileExtension(url);
                    return (
                        <Box key={index}>
                            <a href={url} target="_blank" download style={{ color: "black" }}>
                                {<RenderAttachment file={fileType} url={url} />}
                            </a>
                        </Box>
                    )
                })}
                <Typography variant="caption" color={(theme) => (theme.palette.mode === 'dark' ? "black" : "text.secondary")}>{timeAgo}</Typography>
            </Stack>
        </motion.div >
    )
}

export default MessageComponent