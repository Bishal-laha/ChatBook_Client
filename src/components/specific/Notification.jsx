import { Dialog, ListItem, Typography, Stack, Button, Avatar, Skeleton } from "@mui/material";
import { memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAcceptFriendRequestMutation, useGetNotificationsQuery } from '../../store/api/api';
import { setIsNotification } from "../../store/slice/misc";
import { useAsyncMutation, useErrors } from '../../hooks/hooks';
import { transformImage } from "../../libs/Features";
import { GradientHeading } from '../style/styledCustomComponents';

const Notification = () => {
    const dispatch = useDispatch();
    const { isNotification } = useSelector((state) => state.misc);
    const { isLoading, data, error, isError } = useGetNotificationsQuery();
    const [acceptReq] = useAsyncMutation(useAcceptFriendRequestMutation);

    const friendRequestHandler = async ({ _id, accept }) => {
        dispatch(setIsNotification(false));
        await acceptReq("Accepting...", { requestId: _id, accept });
    }
    const closeHandler = () => {
        dispatch(setIsNotification(false));
    }

    useErrors([{ error, isError }]);

    return (
        <Dialog open={isNotification} onClose={closeHandler}>
            <Stack p={{ xs: "1rem", sm: "2rem" }} maxWidth={"25rem"}>
                <GradientHeading textAlign={"center"} variant="h5" fontWeight={"bold"} marginBottom={"0.8rem"}>Friend Requests</GradientHeading>
                {isLoading ? (<Skeleton />) : (
                    <>
                        <Typography textAlign={"center"} variant="body2" color={"#737373"}>{`${data?.data?.length} New Friend Requests`}</Typography>
                        {data?.data.map((i) => (<NotificationItem sender={i.sender} _id={i._id} handler={friendRequestHandler} key={i._id} />))}
                    </>
                )}
            </Stack>
        </Dialog >
    )
}


const NotificationItem = memo(({ sender, _id, handler }) => {
    const { name, avatar } = sender;

    return (
        <ListItem>
            <Stack direction={"row"} alignItems={"center"} spacing={"1rem"} width={"100%"}>
                <Avatar src={transformImage(avatar)} />
                <Typography variant="body1"
                    sx={{
                        flexGlow: 1, display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical", overflow: "hidden",
                        textOverflow: "ellipsis", width: "100%"
                    }}>{name}</Typography>
                <Stack direction={{ xs: "row" }}>
                    <Button onClick={() => handler({ _id, accept: true })} >Accept</Button>
                    <Button color="error" onClick={() => handler({ _id, accept: false })}>Reject</Button>
                </Stack>
            </Stack>
        </ListItem>
    );
});

export default Notification;