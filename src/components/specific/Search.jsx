import { Search as SearchIcon } from "@mui/icons-material";
import { Dialog, InputAdornment, List, Stack, TextField, Typography } from "@mui/material";
import { SearchUserItem } from "../shared/Index";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useInputValidation } from "6pp";
import { setIsFriendTrue, setIsSearch } from "../../store/slice/misc";
import { useLazySearchUserQuery, useSendFriendRequestMutation } from "../../store/api/api";
import { useAsyncMutation } from "../../hooks/hooks";
import { GradientHeading } from "../style/styledCustomComponents";

const Search = () => {
    const dispatch = useDispatch();
    const search = useInputValidation("");
    const [searchUser] = useLazySearchUserQuery();
    const { isSearch, isFriend, isMobileView } = useSelector((state) => state.misc);
    const { userData } = useSelector((state) => state.auth);
    const [sendFriendReq, isLoadingSendFriendRequest] = useAsyncMutation(useSendFriendRequestMutation);
    const [users, setUsers] = useState([]);
    const [notFoundMessage, setNotFoundMessage] = useState("");

    const addFriendHandler = async (id) => {
        sendFriendReq("Sending Friend Req....", { receiverId: id });
        dispatch(setIsFriendTrue(id));
    };
    const closeHandler = () => {
        dispatch(setIsSearch(false));
    }

    useEffect(() => {
        const timeId = setTimeout(() => {
            searchUser(search.value)
                .then(({ data }) => {
                    if (data?.data?.length === 0)
                        setNotFoundMessage("Not Found People");
                    else {
                        const filteredUsers = data.data.filter(user => user._id !== userData._id);
                        setUsers(filteredUsers);
                    }
                })
                .catch((err) => console.log(err));
        }, 1000);

        return () => {
            clearTimeout(timeId);
        }
    }, [search.value]);

    return (
        <Dialog open={isSearch} onClose={closeHandler}>
            <Stack p={"2rem"} direction={"column"} width={isMobileView ? "20rem" : "25rem"}>
                <GradientHeading textAlign={"center"} variant="h4" fontWeight={"bold"} marginBottom={"0.8rem"}>Find People</GradientHeading>
                <TextField label="" value={search.value} onChange={search.changeHandler} variant="outlined" size="small"
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start"><SearchIcon /></InputAdornment>)
                    }}
                />
                <List>
                    {users.length === 0 ? (<Typography textAlign={"center"} variant="body2" color={"#737373"}>{notFoundMessage}</Typography>) : (users?.map((i) => (
                        <SearchUserItem user={i} key={i._id} handler={addFriendHandler} handlerIsLoading={isLoadingSendFriendRequest} isFriendArray={isFriend} />
                    )))}
                </List>
            </Stack>
        </Dialog>
    );
};

export default Search;