import { Grid, Box, Drawer, Typography, IconButton, Tooltip, Stack, Button, TextField, Backdrop, CircularProgress } from "@mui/material";
import { KeyboardBackspace as KeyboardBackIcon, Menu as MenuIcon, Add as AddIcon, Delete as DeleteIcon, Edit as EditIcon, Done as DoneIcon } from "@mui/icons-material";
import { useState, memo, useEffect, lazy, Suspense } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { AvatarCard, GroupUserItem } from "../components/shared/Index";
import Loaders from "../components/layout/Loaders";
import { useChatDetailsQuery, useDeleteChatMutation, useGetMyGroupsQuery, useRemoveGroupMemberMutation, useRenameGroupMutation } from "../store/api/api";
import { setIsAddMember } from "../store/slice/misc";
import { useAsyncMutation, useErrors } from "../hooks/hooks";
import { GradientHeading, GroupLink } from "../components/style/styledCustomComponents";
import { darkBgBackground, lightBgGradient } from "../constants/color";

const ConfirmDeleteDialog = lazy(() => import("../components/specific/ConfirmDeleteDialog"));
const AddMemberDialog = lazy(() => import("../components/specific/AddMemberDialog"));

const Group = () => {
    const chatId = useSearchParams()[0].get("group");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [groupName, setGroupName] = useState("");
    const [groupNameUpdatedValue, setGroupNameUpdatedValue] = useState("");
    const [isEdit, setIsEdit] = useState(false);
    const [members, setMembers] = useState([]);
    const [groupAdminId, setGroupAdminId] = useState(null);
    const [confirmDeleteDialog, setConfirmDeleteDialog] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { isAddMember, isMobileView } = useSelector((state) => state.misc);
    const myGroups = useGetMyGroupsQuery();
    const groupDetails = useChatDetailsQuery({ chatId, populate: true }, { skip: !chatId });
    const [updateGroup, isLoadingUpdateGroup] = useAsyncMutation(useRenameGroupMutation);
    const [removeMemberGroup, isLoadingRemoveMemberGroup] = useAsyncMutation(useRemoveGroupMemberMutation);
    const [deleteGroup, isLoadingDeleteGroup] = useAsyncMutation(useDeleteChatMutation);

    const errors = [
        { isError: myGroups.isError, error: myGroups.error },
        { isError: groupDetails.isError, error: groupDetails.error }
    ];
    useErrors(errors);

    const navigateBack = () => {
        navigate("/");
    }
    const handleButton = () => {
        setIsMenuOpen(!isMenuOpen);
    }

    const updateGroupName = () => {
        if (groupName !== groupNameUpdatedValue) {
            setIsEdit(false);
            updateGroup("Updating Group Name....", { chatId, name: groupNameUpdatedValue });
        } else {
            toast.error("Please Provide New Group Name");
        }
    }

    const openConfirmDeleteHandler = () => {
        setConfirmDeleteDialog(true);
    }
    const closeConfirmDeleteHandler = () => {
        setConfirmDeleteDialog(false);
    }
    const openAddMemberHandler = () => {
        dispatch(setIsAddMember(true));
    }

    const removeMemberHandler = (userId) => {
        removeMemberGroup("Removing Member....", { chatId, userId });
    }
    const deleteHandler = () => {
        deleteGroup("Deleting Group....", chatId);
        closeConfirmDeleteHandler();
        navigate("/");
    }

    useEffect(() => {
        if (groupDetails?.data?.data) {
            setGroupName(groupDetails.data.data.name);
            setGroupNameUpdatedValue(groupDetails.data.data.name);
            setMembers(groupDetails.data.data.members);
            setGroupAdminId(groupDetails.data.data.creator);
        }

        return () => {
            setGroupName("");
            setGroupNameUpdatedValue("");
            setMembers([]);
        }

    }, [groupDetails?.data?.data]);

    const GroupName = (
        <Stack direction={"row"} alignItems={"center"} justifyContent={"center"} spacing={"1rem"} padding={"3rem"}>
            {isEdit ? (
                <>
                    <Stack display={"flex"} flexDirection={"column"} gap={"1rem"}>
                        <Stack display={"flex"} flexDirection={"row"} justifyContent={"center"}>
                            <TextField value={groupNameUpdatedValue} onChange={(e) => setGroupNameUpdatedValue(e.target.value)} />
                            <IconButton onClick={updateGroupName} disabled={isLoadingUpdateGroup}><DoneIcon /></IconButton>
                        </Stack>
                        <Typography variant="h5" color={"#737373"}>SET GROUP NAME</Typography>
                    </Stack>
                </>
            ) : (
                <>
                    <Stack display={"flex"} flexDirection={"column"} gap={"1rem"}>
                        <Stack display={"flex"} flexDirection={"row"} justifyContent={"center"}>
                            <Typography variant="h4" color={"#4A3E7D"} fontWeight={"bold"}>{groupName}</Typography>
                            <IconButton onClick={() => setIsEdit(true)}><EditIcon /></IconButton>
                        </Stack>
                        <Typography variant="h5" color={"#737373"}>GROUP NAME</Typography>
                    </Stack>
                </>
            )}
        </Stack>
    );

    const ButtonGroup = (
        <Stack direction={{ xs: "column-reverse", sm: "row", }} spacing={"1rem"} p={{ xs: "0", sm: "1rem", md: "1rem 4rem" }}>
            <Button size="large" color="error" startIcon={<DeleteIcon />} onClick={openConfirmDeleteHandler} disabled={isLoadingDeleteGroup}>
                Delete Group
            </Button>
            <Button size="large" variant="contained" startIcon={<AddIcon />} onClick={openAddMemberHandler}>
                Add Member
            </Button>
        </Stack>
    );

    const IconBtn = (
        <>
            <Tooltip title="Open Groups">
                <Box sx={{ display: { xs: "block", sm: "none", position: "fixed", top: "1rem", right: "1rem" } }} >
                    <IconButton onClick={handleButton}><MenuIcon /></IconButton>
                </Box>
            </Tooltip>
            <IconButton sx={{ position: "absolute", top: "1rem", left: "1rem", padding: "0.5rem 0.5rem", bgcolor: "#1c1c1c", color: "white", ":hover": { bgcolor: "rgba(0,0,0,0.7)", } }} onClick={navigateBack}>
                <KeyboardBackIcon />
            </IconButton>
            <Drawer sx={{ display: { xs: "block", sm: "none" } }} open={isMenuOpen} onClose={handleButton}>
                <GroupsList myGroups={myGroups?.data?.data} chatId={chatId} />
            </Drawer>
        </>
    )

    return myGroups.isLoading ? (<Loaders />) : (
        <Grid container height={"100vh"}>
            <Grid item sx={{ display: { xs: "none", sm: "block" }, backgroundImage: (theme) => (theme.palette.mode === 'dark' ? `${darkBgBackground}` : `${lightBgGradient}`) }} sm={4} >
                <Box><GradientHeading variant="h5" fontSize={"1.8rem"} textAlign={"center"} marginY={"1rem"} fontWeight={"bold"}>Archived Group Settings</GradientHeading></Box>
                <GroupsList myGroups={myGroups?.data?.data} chatId={chatId} />
            </Grid>
            <Grid item sx={{ display: "flex", flexDirection: "column", alignItems: "center", position: "relative", padding: "1rem 3rem" }} xs={12} sm={8} >
                {IconBtn}
                {groupName && (
                    <Stack spacing={"0.1rem"} width={isMobileView ? "130%" : "100%"}>
                        {GroupName}
                        <Typography margin={"2rem"} color={"#737373"} variant="h5">Members: {members.length}</Typography>
                        <Stack maxWidth={"45rem"} width={"100%"} boxSizing={"border-box"} boxShadow={"0 0 5px rgba(0,0,0,0.3)"} padding={{ sm: "1rem", xs: "0", md: "1rem 4rem" }} spacing={"2rem"} height={"60vh"} overflow={"auto"}>
                            {isLoadingRemoveMemberGroup ? (<CircularProgress />) : (members.map((i) =>
                                <GroupUserItem user={i} key={i._id} isAdded groupAdminId={groupAdminId}
                                    styling={{ boxShadow: "0 0 0.5rem  rgba(0,0,0,0.2)", padding: "1rem 2rem", borderRadius: "1rem" }} handler={removeMemberHandler}
                                />
                            ))}
                        </Stack>
                        {ButtonGroup}
                    </Stack>
                )}
                {!groupName && <Typography variant="h5" color={"#737373"} textAlign={"center"} marginTop={"20%"}>Select Group To Modify Settings</Typography>}
            </Grid>

            {isAddMember && (
                <Suspense fallback={<Backdrop open />}>
                    <AddMemberDialog isAddMember={isAddMember} chatId={chatId} />
                </Suspense>
            )}
            {confirmDeleteDialog && (
                <Suspense fallback={<Backdrop open />}>
                    <ConfirmDeleteDialog open={confirmDeleteDialog} handleClose={closeConfirmDeleteHandler}
                        deleteHandler={deleteHandler} />
                </Suspense>
            )}
        </Grid>
    )
}

const GroupsList = ({ w = "100%", myGroups = [], chatId }) => (
    <Stack width={w}
        sx={{ backgroundImage: (theme) => (theme.palette.mode === 'dark' ? `${darkBgBackground}` : `${lightBgGradient}`), height: "100vh", overflow: "auto", padding: "1rem" }}>
        {myGroups.length > 0 ? (
            myGroups.map((group) => (
                <GroupListItem group={group} chatId={chatId} key={group._id} />
            ))
        ) : (
            <Typography textAlign={"center"} padding="1rem">No Groups</Typography>
        )}
    </Stack>
);

const GroupListItem = memo(({ group, chatId }) => {
    const { name, avatar, _id } = group;

    return (
        <GroupLink to={`?group=${_id}`} onClick={(e) => {
            if (chatId === _id) e.preventDefault();
        }}>
            <motion.div initial={{ opacity: 0, y: "-100%" }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * _id }}>
                <Stack direction={"row"} spacing={"1rem"} alignItems={"center"}>
                    <AvatarCard avatar={avatar} />
                    <Typography color={(theme) => (theme.palette.mode === 'dark') ? "white" : "black"} fontSize={"1.1rem"}>{name}</Typography>
                </Stack>
            </motion.div>
        </GroupLink>
    );
});

export default Group