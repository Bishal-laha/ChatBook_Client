import { Avatar, AvatarGroup, Box, Stack } from "@mui/material";
import { transformImage } from "../../libs/Features";

const AvatarCard = ({ avatar = [], max = 4 }) => {
    return (
        <Stack direction={"row"} spacing={0.5}>
            <AvatarGroup max={max} sx={{ position: "relative" }}>
                <Box width={"5rem"} height={"3rem"}>
                    {avatar.map((i, index) => (
                        <Avatar key={Math.random() * 100} src={transformImage(i)} alt={`Avatar ${index}`}
                            sx={{ width: "3rem", height: "3rem", position: "absolute" }} />
                    ))}
                </Box>
            </AvatarGroup>
        </Stack>
    );
};

export default AvatarCard;