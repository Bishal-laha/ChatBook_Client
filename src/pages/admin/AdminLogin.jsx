import { Button, Container, Paper, TextField, IconButton } from "@mui/material";
import { Home as HomeIcon } from "@mui/icons-material";
import { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useInputValidation } from "6pp";
import { pageBackgroundColor } from "../../constants/color";
import { GradientHeading } from "../../components/style/styledCustomComponents";
import { adminLogin, getAdmin } from "../../store/thunk/admin";

const AdminLogin = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isAdmin } = useSelector((state) => state.auth);
    const secretKey = useInputValidation("");

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(adminLogin(secretKey.value));
    };

    useEffect(() => {
        dispatch(getAdmin());
    }, []);

    if (isAdmin) return <Navigate to="/admin/dashboard" />;

    return (
        <div style={{ backgroundImage: pageBackgroundColor, position: "relative" }}>
            <Container component={"main"} maxWidth="xs"
                sx={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
                <Paper elevation={3} sx={{ padding: 4, display: "flex", flexDirection: "column", alignItems: "center", position: "relative" }}>
                    <IconButton sx={{ position: "absolute", top: "0.5rem", left: "1rem", padding: "0.4rem 0.4rem", bgcolor: "#1c1c1c", color: "white", ":hover": { bgcolor: "rgba(0,0,0,0.7)", } }} onClick={() => navigate("/signup-login")}><HomeIcon />
                    </IconButton>
                    <GradientHeading textAlign={"center"} variant="h4" fontWeight={"bold"}>Admin Login</GradientHeading>
                    <form style={{ width: "100%", marginTop: "1rem" }} onSubmit={submitHandler}>
                        <TextField required fullWidth label="Secret Key" type="password" margin="normal"
                            variant="outlined" value={secretKey.value} onChange={secretKey.changeHandler} />
                        <Button sx={{ marginTop: "1rem" }} variant="contained" color="primary" type="submit" fullWidth>
                            Login
                        </Button>
                    </form>
                </Paper>
            </Container>
        </div>
    );
};

export default AdminLogin;