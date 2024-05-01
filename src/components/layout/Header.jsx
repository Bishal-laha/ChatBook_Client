import { Add as AddIcon, Group as GroupIcon, Logout as LogoutIcon, Notifications as NotificationsIcon, Search as SearchIcon, AccountBox as AccountBoxIcon, DarkMode as DarkModeIcon, LightMode as LightModeIcon, Menu as MenuIcon } from "@mui/icons-material";
import { AppBar, Avatar, Backdrop, Badge, Box, Drawer, IconButton, Menu, MenuItem, Stack, Toolbar, Tooltip } from "@mui/material";
import { Suspense, lazy, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { setIsDarkMode, setIsMobileAvatar, setIsNewGroup, setIsNotification, setIsSearch } from "../../store/slice/misc";
import { resetNotification } from "../../store/slice/notification";
import { userLogout } from "../../store/slice/auth";
import { LightGradientText, DarkGradientText } from "../style/styledCustomComponents";


const SearchDialog = lazy(() => import("../specific/Search"));
const NotificationDialog = lazy(() => import("../specific/Notification"));
const NewGroupDialog = lazy(() => import("../specific/NewGroup"));
const Profile = lazy(() => import("../specific/Profile"));

function Header() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { userData } = useSelector((state) => state.auth);
    const { isSearch, isNotification, isNewGroup, isDarkMode, isMobileView } = useSelector((state) => state.misc);
    const { notificationCount } = useSelector((state) => state.notification);
    const [anchorElUser, setAnchorElUser] = useState(null);
    const [showProfileComponent, setShowProfileComponent] = useState(false);


    const toggleDarkLightMode = () => {
        dispatch(setIsDarkMode(!isDarkMode));
    }
    const openAccount = () => {
        setShowProfileComponent(!showProfileComponent);
        handleCloseUserMenu();
    }

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };
    const openNewGroup = () => {
        dispatch(setIsNewGroup(true));
        if (isMobileView)
            handleCloseUserMenu();
    }
    const openNotification = () => {
        dispatch(setIsNotification(true));
        dispatch(resetNotification());
        if (isMobileView)
            handleCloseUserMenu();
    }
    const openSearch = () => {
        dispatch(setIsSearch(true))
        if (isMobileView)
            handleCloseUserMenu();
    }

    const logoutHandler = async () => {
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_SERVER}/api/v1/user/logout`, { withCredentials: true });
            dispatch(userLogout());
            toast.success(data.message);
        } catch (error) {
            toast.error(error?.response?.data?.message || "Something went wrong");
        }
    }
    const navigateToGroup = () => {
        navigate("/group");
    }

    return (
        <>
            <Box sx={{ flexGrow: 1 }} height={"4rem"}>
                <AppBar position="static">
                    <Toolbar >
                        <Box display={"flex"} sx={{ flexGrow: 1 }}>
                            <Tooltip title={isMobileView && "Friend List"}>
                                <IconButton onClick={() => dispatch(setIsMobileAvatar(true))} sx={{ p: 0 }}>
                                    <Avatar alt="User" src={userData?.avatar?.url} />
                                </IconButton>
                            </Tooltip>
                            <Box marginLeft={isMobileView ? "0.7rem" : "2rem"} marginTop={"0.2rem"}>
                                {isDarkMode ? (<DarkGradientText variant="h4" fontSize={isMobileView ? "2rem" : "2.5rem"} fontWeight={"bold"}>ChatBook</DarkGradientText>) : (<LightGradientText variant="h4" fontSize={isMobileView ? "2rem" : "2.5rem"} fontWeight={"bold"}>ChatBook</LightGradientText>)}
                            </Box>

                            {isMobileView && <Stack>{isDarkMode ? <IconBtn title={"Light Mode On"} icon={<LightModeIcon />} onClick={toggleDarkLightMode} /> : <IconBtn title={"Dark Mode On"} icon={<DarkModeIcon />} onClick={toggleDarkLightMode} />}</Stack>}
                            {isMobileView && <Box sx={{ display: { xs: "block", sm: "none" }, fontSize: "1.8rem" }}>
                                <IconButton color="inherit" onClick={handleOpenUserMenu} ><MenuIcon /></IconButton>
                            </Box>}

                            <Menu sx={{ mt: '45px', display: { xs: "block", sm: "none" } }} id="menu-bar"
                                anchorEl={anchorElUser} anchorOrigin={{ vertical: 'top', horizontal: 'right', }}
                                keepMounted transformOrigin={{ vertical: 'top', horizontal: 'right', }}
                                open={Boolean(anchorElUser)} onClose={handleCloseUserMenu}>
                                <MenuItem><IconBtn title={"Profile"} icon={<AccountBoxIcon />} onClick={openAccount} /></MenuItem>
                                <MenuItem><IconBtn title={"Search"} icon={<SearchIcon />} onClick={openSearch} /></MenuItem>
                                <MenuItem> <IconBtn title={"New Group"} icon={<AddIcon />} onClick={openNewGroup} /></MenuItem>
                                <MenuItem><IconBtn title={"Manage Groups"} icon={<GroupIcon />} onClick={navigateToGroup} /></MenuItem>
                                <MenuItem><IconBtn title={"Notifications"} icon={<NotificationsIcon />} onClick={openNotification}
                                    value={notificationCount} /></MenuItem>
                                <MenuItem><IconBtn title={"Logout"} icon={<LogoutIcon />} onClick={logoutHandler} /></MenuItem>
                            </Menu>
                        </Box>

                        <Box sx={{ flexGrow: 1 }} />
                        {showProfileComponent &&
                            <Drawer open={showProfileComponent} onClose={() => setShowProfileComponent(false)} anchor="right">
                                <Profile />
                            </Drawer>
                        }

                        {!isMobileView && <Box >
                            {isDarkMode ? <IconBtn title={"Light Mode On"} icon={<LightModeIcon />} onClick={toggleDarkLightMode} /> : <IconBtn title={"Dark Mode On"} icon={<DarkModeIcon />} onClick={toggleDarkLightMode} />}
                            <IconBtn title={"Search"} icon={<SearchIcon />} onClick={openSearch} />
                            <IconBtn title={"New Group"} icon={<AddIcon />} onClick={openNewGroup} />
                            <IconBtn title={"Manage Groups"} icon={<GroupIcon />} onClick={navigateToGroup} />
                            <IconBtn title={"Notifications"} icon={<NotificationsIcon />} onClick={openNotification}
                                value={notificationCount} />
                            <IconBtn title={"Logout"} icon={<LogoutIcon />} onClick={logoutHandler} />
                        </Box>}
                    </Toolbar>
                </AppBar>
            </Box>

            {isSearch && (<Suspense fallback={<Backdrop open />}><SearchDialog /></Suspense>)}
            {isNotification && (<Suspense fallback={<Backdrop open />}><NotificationDialog /></Suspense>)}
            {isNewGroup && (<Suspense fallback={<Backdrop open />}><NewGroupDialog /></Suspense>)}
        </>
    );
}

const IconBtn = ({ title, icon, onClick, value }) => {
    return (
        <Tooltip title={title} placement='bottom-start'>
            <IconButton color="inherit" size="large" onClick={onClick} sx={{ marginX: "0.5rem" }}>
                {value ? (<Badge badgeContent={value} color="error">{icon}</Badge>) : (icon)}
            </IconButton>
        </Tooltip>
    );
};

export default Header;