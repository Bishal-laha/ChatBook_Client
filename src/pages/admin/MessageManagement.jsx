import { Avatar, Box, Skeleton, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import moment from "moment";
import { useFetchData } from "6pp";
import AdminLayout from "../../components/layout/AdminLayout";
import { RenderAttachment, Table } from "../../components/shared/Index";
import { checkFileExtension, transformImage } from "../../libs/Features";
import { useErrors } from "../../hooks/hooks";

const columns = [
    {
        field: "id",
        headerName: "ID",
        headerClassName: "table-header",
        width: 200,
    },
    {
        field: "attachments",
        headerName: "Attachments",
        headerClassName: "table-header",
        width: 200,
        renderCell: (params) => {
            const { attachments } = params.row;

            return attachments?.length > 0
                ? attachments.map((i, id) => {
                    const url = i.url;
                    const file = checkFileExtension(url);
                    // console.log(file);

                    return (
                        <Box key={id}>
                            <a
                                href={url}
                                download
                                target="_blank"
                                style={{
                                    color: "black",
                                }}
                            >
                                {RenderAttachment({ file, url })}
                            </a>
                        </Box>
                    );
                })
                : "No Attachments";
        },
    },

    {
        field: "content",
        headerName: "Content",
        headerClassName: "table-header",
        width: 400,
    },
    {
        field: "sender",
        headerName: "Sent By",
        headerClassName: "table-header",
        width: 200,
        renderCell: (params) => (
            <Stack direction={"row"} spacing={"1rem"} alignItems={"center"}>
                <Avatar alt={params.row.sender.fullName} src={params.row.sender.avatar} />
                <span>{params.row.sender.fullName}</span>
            </Stack>
        ),
    },
    {
        field: "chat",
        headerName: "Chat",
        headerClassName: "table-header",
        width: 220,
    },
    {
        field: "isGroupChat",
        headerName: "Group Chat",
        headerClassName: "table-header",
        width: 100,
    },
    {
        field: "createdAt",
        headerName: "Time",
        headerClassName: "table-header",
        width: 250,
    },
];

const MessageManagement = () => {
    const { loading, data, error } = useFetchData(`${import.meta.env.VITE_SERVER}/api/v1/admin/messages`, "dashboard-messages");
    useErrors([{ isError: error, error: error }]);
    const [rows, setRows] = useState([]);

    useEffect(() => {
        if (data) {
            setRows(
                data?.data?.map((i) => ({
                    ...i,
                    id: i._id,
                    sender: {
                        name: i.sender.fullName,
                        avatar: transformImage(i.sender.avatar, 50),
                    },
                    createdAt: moment(i.createdAt).format("MMMM Do YYYY, h:mm:ss a"),
                }))
            );
        }
    }, [data]);

    return (
        <AdminLayout>
            {loading ? (<Skeleton height={"100vh"} />) : (
                <Table heading={"All Chats"} columns={columns} rows={rows} rowHeight={150} />
            )}
        </AdminLayout>
    );
};

export default MessageManagement;