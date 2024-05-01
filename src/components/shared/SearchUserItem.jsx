import { Add as AddIcon, Remove as RemoveIcon } from "@mui/icons-material";
import { Avatar, IconButton, ListItem, Stack, Typography } from "@mui/material";
import { memo } from "react";
import { transformImage } from "../../libs/Features";

const SearchUserItem = ({ user, handler, handlerIsLoading, isFriendArray = [] }) => {
    const { fullName, _id, avatar } = user;
    const isFriend = isFriendArray.includes(_id);

    return (
        <ListItem>
            <Stack direction={"row"} alignItems={"center"} spacing={"1rem"} width={"100%"}>
                <Avatar src={transformImage(avatar)} />
                <Typography variant="body1"
                    sx={{
                        flexGlow: 1, display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical", overflow: "hidden",
                        textOverflow: "ellipsis", width: "100%"
                    }}>
                    {fullName}
                </Typography>
                <IconButton size="small"
                    sx={{
                        bgcolor: isFriend ? "error.main" : "primary.main", color: "white",
                        "&:hover": { bgcolor: isFriend ? "error.dark" : "primary.dark" },
                    }}
                    onClick={() => handler(_id)} disabled={handlerIsLoading || isFriend}
                >
                    {isFriend ? <RemoveIcon /> : <AddIcon />}
                </IconButton>
            </Stack>
        </ListItem>
    );
};

export default memo(SearchUserItem);