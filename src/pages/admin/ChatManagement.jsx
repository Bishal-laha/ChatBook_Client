import { Avatar, Skeleton, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import { useFetchData } from "6pp";
import AdminLayout from "../../components/layout/AdminLayout";
import { Table, AvatarCard } from "../../components/shared/Index";
import { transformImage } from "../../libs/Features";
import { useErrors } from "../../hooks/hooks";

const columns = [
    {
        field: "id",
        headerName: "ID",
        headerClassName: "table-header",
        width: 200,
    },
    {
        field: "avatar",
        headerName: "Avatar",
        headerClassName: "table-header",
        width: 150,
        renderCell: (params) => <AvatarCard avatar={params.row.avatar} />,
    },

    {
        field: "name",
        headerName: "Name",
        headerClassName: "table-header",
        width: 300,
    },

    {
        field: "isGroupChat",
        headerName: "Group",
        headerClassName: "table-header",
        width: 100,
    },
    {
        field: "totalMembers",
        headerName: "Total Members",
        headerClassName: "table-header",
        width: 120,
    },
    {
        field: "members",
        headerName: "Members",
        headerClassName: "table-header",
        width: 400,
        renderCell: (params) => (
            <AvatarCard max={100} avatar={params.row.members} />
        ),
    },
    {
        field: "totalMessages",
        headerName: "Total Messages",
        headerClassName: "table-header",
        width: 120,
    },
    {
        field: "creator",
        headerName: "Created By",
        headerClassName: "table-header",
        width: 250,
        renderCell: (params) => (
            <Stack direction="row" alignItems="center" spacing={"1rem"}>
                <Avatar alt={params.row.creator.fullName} src={params.row.creator.avatar} />
                <span>{params.row.creator.fullName}</span>
            </Stack>
        ),
    },
];

const ChatManagement = () => {
    const { loading, data, error } = useFetchData(`${import.meta.env.VITE_SERVER}/api/v1/admin/chats`, "dashboard-chats");
    useErrors([{ isError: error, error: error }]);
    const [rows, setRows] = useState([]);

    useEffect(() => {
        if (data) {
            setRows(
                data.data.map((i) => ({
                    ...i,
                    id: i._id,
                    avatar: i.avatar.map((i) => transformImage(i, 50)),
                    members: i.members.map((i) => transformImage(i.avatar, 50)),
                    creator: {
                        name: i.creator.fullName,
                        avatar: transformImage(i.creator.avatar, 50),
                    },
                }))
            );
        }
    }, [data]);

    return (
        <AdminLayout>
            {loading ? (<Skeleton height={"100vh"} />) : (
                <Table heading={"All Chats"} columns={columns} rows={rows} />
            )}
        </AdminLayout>
    );
};

export default ChatManagement;