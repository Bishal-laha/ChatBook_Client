import { Button, Dialog, Skeleton, Stack, Typography } from "@mui/material";
import { GroupUserItem } from "../shared/Index";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useAddGroupMembersMutation, useGetAvailableFriendsQuery } from "../../store/api/api";
import { setIsAddMember } from "../../store/slice/misc";
import { useAsyncMutation, useErrors } from "../../hooks/hooks";
import { GradientHeading } from "../style/styledCustomComponents";

const AddMemberDialog = ({ isAddMember, chatId }) => {
    const dispatch = useDispatch();
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [addMemberGroup, isLoadingAddMemberGroup] = useAsyncMutation(useAddGroupMembersMutation);
    const { isLoading, data, isError, error } = useGetAvailableFriendsQuery(chatId);

    const selectMemberHandler = (id) => {
        setSelectedMembers((prev) =>
            prev.includes(id) ? prev.filter((currElement) => currElement !== id) : [...prev, id]
        );
    };
    const closeHandler = () => {
        dispatch(setIsAddMember(false));
    };
    const addMemberSubmitHandler = () => {
        addMemberGroup("Adding Member is in progress....", { members: selectedMembers, chatId });
        closeHandler();
    };

    useErrors([{ isError, error }]);

    return (
        <Dialog open={isAddMember} onClose={closeHandler}>
            <Stack p={"2rem"} width={"20rem"} spacing={"2rem"}>
                <GradientHeading textAlign={"center"} variant="h4" fontWeight={"bold"} marginBottom={"0.8rem"}>Add Friends</GradientHeading>
                <Stack spacing={"1rem"}>
                    {isLoading ? (<Skeleton />) : (data?.data?.length > 0 ? (data?.data?.map((i) => (
                        <GroupUserItem key={i._id} user={i} handler={selectMemberHandler} isAdded={selectedMembers.includes(i._id)} />))
                    ) : (
                        <Typography textAlign={"center"} variant="body2" color={"#737373"}>No Friends</Typography>
                    ))}
                </Stack>
                <Stack direction={"row"} alignItems={"center"} justifyContent={"space-evenly"}>
                    <Button color="error" onClick={closeHandler}>Cancel</Button>
                    <Button onClick={addMemberSubmitHandler} variant="contained" disabled={isLoadingAddMemberGroup}>
                        Submit Changes
                    </Button>
                </Stack>
            </Stack>
        </Dialog>
    );
};

export default AddMemberDialog;