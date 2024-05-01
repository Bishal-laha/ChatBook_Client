import { Dialog, Stack, Typography, Button, TextField, Skeleton } from "@mui/material";
import { GroupUserItem } from "../shared/Index";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useInputValidation } from "6pp";
import { useCreateNewGroupMutation, useGetAvailableFriendsQuery } from "../../store/api/api";
import { setIsNewGroup } from "../../store/slice/misc";
import { useAsyncMutation, useErrors } from "../../hooks/hooks";
import { GradientHeading } from "../style/styledCustomComponents";

const NewGroup = () => {
    const groupName = useInputValidation("");
    const dispatch = useDispatch();
    const [selectedMembers, setSelectedMembers] = useState([]);
    const { isNewGroup, isMobileView } = useSelector((state) => state.misc);
    const { isLoading, data, isError, error } = useGetAvailableFriendsQuery();
    const [newGroup, isLoadingNewGroup] = useAsyncMutation(useCreateNewGroupMutation);

    const errors = [{ isError, error }];
    useErrors(errors);

    const selectMemberHandler = (id) => {
        setSelectedMembers((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
    }
    const submitHandler = () => {
        if (!groupName.value) return toast.error("Group name is required");
        if (selectedMembers.length < 2) return toast.error("You have to select at least 2 Members");
        newGroup("Creating New Group....", { name: groupName.value, members: selectedMembers });
        closeHandler();
    }
    const closeHandler = () => {
        dispatch(setIsNewGroup(false));
    }

    return (
        <Dialog open={isNewGroup} onClose={closeHandler}>
            <Stack width={isMobileView ? "18rem" : "25rem"} >
                <GradientHeading textAlign={"center"} fontSize={"1.8rem"} fontWeight={"bold"} marginTop={"1rem"}>Create New Group</GradientHeading>
            </Stack>
            <Stack paddingX={{ xs: "1rem", sm: "2rem" }} paddingY={"1rem"} >
                <TextField label="Enter Group Name" value={groupName.value} onChange={groupName.changeHandler} />
                <Typography marginTop={"1rem"} variant="body1" color={"#737373"}>Members</Typography>
                <Stack>
                    {isLoading ? (<Skeleton />) : (
                        data?.data?.map((i, id) => (
                            <GroupUserItem user={i} key={i._id || id} handler={selectMemberHandler} isAdded={selectedMembers.includes(i._id)} />
                        )))}
                </Stack>
                <Stack direction={"row"} marginTop={"1.5rem"} gap={"2rem"}>
                    <Button color="error" variant="contained" onClick={closeHandler}>Cancel</Button>
                    <Button variant="contained" onClick={submitHandler} disabled={isLoadingNewGroup}>Create</Button>
                </Stack>
            </Stack>
        </Dialog>
    )
}

export default NewGroup