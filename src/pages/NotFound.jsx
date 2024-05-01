import { Stack, Typography } from "@mui/material";
import { Error as ErrorIcon, Home as HomeIcon } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { pageBackgroundColor } from "../constants/color";

const NotFound = () => {
    return (
        <div style={{ height: "100vh", backgroundImage: pageBackgroundColor }}>
            <Stack alignItems={"center"} spacing={"2rem"} justifyContent={"center"} height="100%">
                <ErrorIcon sx={{ fontSize: "10rem" }} />
                <Typography variant="h1">404</Typography>
                <Typography variant="h3">Not Found</Typography>
                <Stack display={"flex"} flexDirection={"row"} gap={"1rem"}>
                    <HomeIcon />
                    <Link to="/">Go back to home</Link>
                </Stack>
            </Stack>
        </div>
    );
};

export default NotFound;