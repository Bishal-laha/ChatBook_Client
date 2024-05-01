import AppLayout from '../components/layout/AppLayout';
import { Box, Typography } from "@mui/material";

const Home = () => {
    return (
        <Box bgcolor={"rgba(247,247,247,1)"} height={"100%"}>
            <Typography p={"2rem"} variant="h5" color={"#737373"} textAlign={"center"} >Select Friend To Chat
            </Typography>
        </Box>
    )
}

export default AppLayout()(Home)