import { Add as AddIcon, Remove as RemoveIcon } from "@mui/icons-material";
import { Avatar, IconButton, ListItem, Stack, Typography } from "@mui/material";
import { memo } from "react";
import { transformImage } from "../../libs/Features";

const GroupUserItem = ({ user, handler, handlerIsLoading, isAdded = "false", groupAdminId }) => {
    let isAdmin = false;
    const { fullName, _id, avatar } = user;
    if (groupAdminId === _id) isAdmin = true;

    return (
        <ListItem>
            <Stack direction={"row"} alignItems={"center"} justifyContent={"space-between"} spacing={"3rem"} width={"100%"}>
                <Avatar src={transformImage(avatar)} />
                <Stack display={"flex"} flexDirection={"row"} alignItems={"center"} justifyContent={"left"}>
                    <Typography variant="body1"
                        sx={{
                            flexGlow: 1, display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical", overflow: "hidden",
                            textOverflow: "ellipsis", width: "100%"
                        }}>
                        {fullName}
                    </Typography>
                    {isAdmin && <Typography variant="body2" color={"#737373"} marginLeft={"5px"}>(Admin)</Typography>}
                </Stack>

                <IconButton size="small" sx={{
                    bgcolor: isAdded ? "error.main" : "primary.main", color: "white",
                    "&:hover": { bgcolor: isAdded ? "error.dark" : "primary.dark" }
                }}
                    onClick={() => handler(_id)} disabled={handlerIsLoading}>
                    {isAdded ? <RemoveIcon /> : <AddIcon />}
                </IconButton>
            </Stack>
        </ListItem>
    );
};

export default memo(GroupUserItem);