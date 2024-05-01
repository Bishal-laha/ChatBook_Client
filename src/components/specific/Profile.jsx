import { Avatar, Box, Stack, Typography, IconButton, TextField, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { Face as FaceIcon, AlternateEmail as UserNameIcon, CalendarMonth as CalendarIcon, Edit as EditIcon, Done as DoneIcon, Camera as CameraIcon, Abc as AbcIcon } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { useFileHandler } from "6pp";
import axios from "axios";
import toast from "react-hot-toast";
import { useDeleteAccountMutation, useUpdateBioMutation } from "../../store/api/api";
import { changeUserData, userLogout } from "../../store/slice/auth";
import { transformImage } from "../../libs/Features";
import { useAsyncMutation } from "../../hooks/hooks";
import { VisuallyHiddenInput } from '../style/styledCustomComponents';

const Profile = () => {
    const dispatch = useDispatch();
    const { userData } = useSelector((state) => state.auth);
    const { isDarkMode } = useSelector((state) => state.misc);
    const avatar = useFileHandler("single");
    const [isEdit, setIsEdit] = useState(false);
    const [isImgEdit, setIsImgEdit] = useState(false);
    const [newBio, setNewBio] = useState("");
    const [dialogueOpen, setDialogueOpen] = useState(false);
    const [changeBio, isLoadingChangeBio, responseUserBioData] = useAsyncMutation(useUpdateBioMutation);
    const [deleteAccount] = useAsyncMutation(useDeleteAccountMutation);

    const updateBioHandler = () => {
        if (newBio) {
            setIsEdit(false);
            setNewBio("");
            changeBio("Updating Bio....", { newBio });
        } else
            toast.error("Please Provide Bio Between 5-60 Characters");
    }
    const handleImage = async () => {
        setIsImgEdit(false);
        if (avatar.file) {
            const responseUserImgData = await axios.post(`${import.meta.env.VITE_SERVER}/api/v1/user/change-img`, { "avatar": avatar.file },
                { withCredentials: true, headers: { "Content-Type": "multipart/form-data" } });
            dispatch(changeUserData(responseUserImgData?.data?.data));
            toast.success(responseUserImgData?.data?.message);
        } else
            toast.error("Please Select Avatar");
    }
    const deleteAccountHandler = async () => {
        setDialogueOpen(true);
        await deleteAccount("Deleting Account....");
        dispatch(userLogout());
    }

    useEffect(() => {
        if (responseUserBioData)
            dispatch(changeUserData(responseUserBioData?.data));
    }, [responseUserBioData?.data]);

    const DeleteDialog = (
        <Dialog open={dialogueOpen} onClose={() => setDialogueOpen(false)}>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogContent>
                <DialogContentText>Are you sure you want to delete your account permanently?</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={deleteAccountHandler} color="error">Yes</Button>
                <Button onClick={() => setDialogueOpen(false)}>No</Button>
            </DialogActions>
        </Dialog>
    )

    return (
        <Stack spacing={"1.2rem"} direction={"column"} alignItems={"center"}>
            <Stack position={"relative"}>
                <Avatar src={transformImage(userData?.avatar?.url)}
                    sx={{ width: 200, height: 200, objectFit: "contain", marginBottom: "1rem", border: "5px solid white" }} />
                <IconButton sx={{ position: "absolute", bottom: "10px", right: "10px", bgcolor: "rgba(0,0,0,0.5)", ":hover": { bgcolor: "rgba(0,0,0,1)" }, color: "bisque", fontSize: "2.5rem" }} component="label" onClick={() => setIsImgEdit(true)}>
                    <>
                        <CameraIcon fontSize="0.1rem" />
                        <VisuallyHiddenInput type='file' onChange={avatar.changeHandler} />
                    </>
                </IconButton>
                {isImgEdit && <IconButton onClick={handleImage} sx={{ position: "absolute", bottom: "19px", right: "-25px", color: "white", fontSize: "2rem", ":hover": { bgcolor: "rgba(0,0,0,0.4)" } }} > <DoneIcon /> </IconButton>}
            </Stack>

            {isEdit ? (
                <Box display={"flex"} >
                    <TextField value={newBio} onChange={(e) => setNewBio(e.target.value)} size="small" autoFocus sx={{ bgcolor: "white", borderRadius: "10px", alignItems: "center", marginLeft: "3rem" }} placeholder="Enter Bio" variant="outlined" />
                    <IconButton sx={{ color: isDarkMode ? "white" : "black", fontSize: "2rem", ":hover": { bgcolor: "rgba(0,0,0,0.4)" } }} onClick={updateBioHandler} disabled={isLoadingChangeBio}><DoneIcon /></IconButton>
                </Box>) : (
                <Box display={"flex"} justifyContent={"center"} alignItems={"center"} paddingLeft={"3rem"}>
                    <ProfileCard heading={"Bio"} text={userData?.bio} Icon={<AbcIcon />} />
                    <IconButton sx={{ color: "white", fontSize: "1.4rem", bgcolor: isDarkMode ? "rgba(0,0,0,0.1)" : "rgba(0,0,0,0.8)", "&:hover": { bgcolor: isDarkMode ? "rgba(0, 0, 0, 0.5)" : "rgba(0,0,0,0.4)" }, marginLeft: "10px" }} onClick={() => setIsEdit(true)} > <EditIcon fontSize="1rem" /> </IconButton>
                </Box>)
            }

            <ProfileCard heading={"Username"} text={userData?.username} Icon={<UserNameIcon />} />
            <ProfileCard heading={"Name"} text={userData?.fullName} Icon={<FaceIcon />} />
            <ProfileCard heading={"Joined"} text={moment(userData?.createdAt).fromNow()} Icon={<CalendarIcon />} />
            <Button variant="contained" color="error" onClick={() => setDialogueOpen(true)}>Delete My Account</Button>
            {dialogueOpen && (DeleteDialog)}
        </Stack >
    );
};

const ProfileCard = ({ text, Icon, heading }) => (
    <Stack direction={"row"} alignItems={"flex-start"} spacing={"1rem"} color={"white"} textAlign={"center"} position={"relative"}>
        <Stack sx={{ position: "absolute", top: "5px", left: "-20px" }}>{Icon && Icon}</Stack>
        <Stack>
            <Typography variant="body1" color={"white"}>{text}</Typography>
            <Typography variant="caption" color={"gray"}> {heading}</Typography>
        </Stack>
    </Stack>
);

export default Profile;