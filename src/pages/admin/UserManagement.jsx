import { Avatar, Skeleton } from "@mui/material";
import { useEffect, useState } from "react";
import { useFetchData } from "6pp";
import AdminLayout from "../../components/layout/AdminLayout";
import { Table } from "../../components/shared/Index";
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
        renderCell: (params) => (
            <Avatar alt={params.row.name} src={params.row.avatar} />
        ),
    },

    {
        field: "fullName",
        headerName: "Name",
        headerClassName: "table-header",
        width: 200,
    },
    {
        field: "username",
        headerName: "Username",
        headerClassName: "table-header",
        width: 200,
    },
    {
        field: "friendsCount",
        headerName: "Friends",
        headerClassName: "table-header",
        width: 150,
    },
    {
        field: "groupCount",
        headerName: "Groups",
        headerClassName: "table-header",
        width: 200,
    },
];

const UserManagement = () => {
    const { loading, data, error } = useFetchData(`${import.meta.env.VITE_SERVER}/api/v1/admin/users`, "dashboard-users");
    useErrors([{ isError: error, error: error }]);
    const [rows, setRows] = useState([]);

    useEffect(() => {
        if (data) {
            setRows(
                data?.data?.map((i) => ({
                    ...i,
                    id: i._id,
                    avatar: transformImage(i.avatar, 50),
                }))
            );
        }
    }, [data]);

    return (
        <AdminLayout>
            {loading ? (<Skeleton height={"100vh"} />) : (
                <Table heading={"All Users"} columns={columns} rows={rows} />
            )}
        </AdminLayout>
    );
};

export default UserManagement;