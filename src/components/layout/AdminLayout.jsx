import { Close as CloseIcon, Dashboard as DashboardIcon, ExitToApp as ExitToAppIcon, Groups as GroupsIcon, ManageAccounts as ManageAccountsIcon, Menu as MenuIcon, Message as MessageIcon } from "@mui/icons-material";
import { Box, Drawer, Grid, IconButton, Stack, Typography } from "@mui/material";
import { useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutAdmin } from "../../store/thunk/admin";
import { AdminLink } from "../style/styledCustomComponents";
import { grayColor, matBlack } from "../../constants/color";

const adminTabs = [
    {
        name: "Dashboard",
        path: "/admin/dashboard",
        icon: <DashboardIcon />,
    },
    {
        name: "Users",
        path: "/admin/users",
        icon: <ManageAccountsIcon />,
    },
    {
        name: "Chats",
        path: "/admin/chats",
        icon: <GroupsIcon />,
    },
    {
        name: "Messages",
        path: "/admin/messages",
        icon: <MessageIcon />,
    },
];

const AdminLayout = ({ children }) => {

    const { isAdmin } = useSelector((state) => state.auth);
    const [isMobile, setIsMobile] = useState(false);
    const handleMobile = () => setIsMobile(!isMobile);

    if (!isAdmin) return <Navigate to="/admin" />;

    return (
        <Grid container minHeight={"100vh"}>
            <Box sx={{ display: { xs: "block", md: "none" }, position: "fixed", right: "1rem", top: "1rem" }}>
                <IconButton onClick={handleMobile}>{isMobile ? <CloseIcon /> : <MenuIcon />}</IconButton>
            </Box>
            <Grid item md={4} lg={3} sx={{ display: { xs: "none", md: "block" } }}><Sidebar /></Grid>
            <Grid item xs={12} md={8} lg={9} sx={{ bgcolor: grayColor }}>{children}</Grid>
            <Drawer open={isMobile} onClose={handleMobile}><Sidebar w="50vw" /></Drawer>
        </Grid>
    );
};

const Sidebar = ({ w = "100%" }) => {
    const location = useLocation();
    const dispatch = useDispatch();

    const logoutHandler = () => {
        dispatch(logoutAdmin());
    };

    return (
        <Stack width={w} direction={"column"} p={"3rem"} spacing={"3rem"}>
            <Typography variant="h5" textTransform={"uppercase"}>ChatBook</Typography>
            <Stack spacing={"1rem"}>
                {adminTabs.map((tab) => (
                    <AdminLink key={tab.path} to={tab.path}
                        sx={location.pathname === tab.path && { bgcolor: matBlack, color: "white", ":hover": { color: "white" } }}>
                        <Stack direction={"row"} alignItems={"center"} spacing={"1rem"}>
                            {tab.icon}
                            <Typography>{tab.name}</Typography>
                        </Stack>
                    </AdminLink>
                ))}

                <AdminLink onClick={logoutHandler}>
                    <Stack direction={"row"} alignItems={"center"} spacing={"1rem"}>
                        <ExitToAppIcon />
                        <Typography>Logout</Typography>
                    </Stack>
                </AdminLink>
            </Stack>
        </Stack>
    );
};

export default AdminLayout;