import { Paper, TextField, Button, Typography, Stack, Avatar, IconButton, Box } from "@mui/material";
import { CameraAlt as CameraIcon } from "@mui/icons-material";
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useMediaQuery } from 'react-responsive';
import { useNavigate } from "react-router-dom";
import { useFileHandler } from "6pp";
import axios from 'axios';
import toast from 'react-hot-toast';
import { userLogin } from '../store/slice/auth.js';
import { GradientHeading, LightGradientText, VisuallyHiddenInput } from '../components/style/styledCustomComponents';
import { validateForm } from '../utils/validationChecker.js';
import { pageBackgroundColor } from '../constants/color.js';

const Login = () => {
    const isMobileScreen = useMediaQuery({ maxWidth: 600 });
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const avatar = useFileHandler("single");
    const [isLogin, setIsLogin] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({ username: "", fullName: "", bio: "", password: "" });
    const [errors, setErrors] = useState({});
    const [showAvatarPreview, setShowAvatarPreview] = useState(false);

    const toggleLogin = () => setIsLogin(!isLogin);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    }

    const handleLogin = async (e) => {
        e.preventDefault();
        const toastId = toast.loading("Logging In....");
        setIsLoading(true);
        const config = { withCredentials: true, headers: { "Content-Type": "application/json" } }
        try {
            const responseData = await axios.post(`${import.meta.env.VITE_SERVER}/api/v1/user/login`,
                { username: formData.username, password: formData.password }, config);
            dispatch(userLogin(responseData.data.data.user));
            toast.success(responseData.data.message, { id: toastId });
        } catch (error) {
            toast.error(error?.response?.data?.message || "Something Went Wrong", { id: toastId });
        } finally {
            setIsLoading(false);
        }
    }

    const handleRegister = async (e) => {
        setErrors({});
        e.preventDefault();
        const toastId = toast.loading("Signing Up....");
        setIsLoading(true);
        const validationErrors = validateForm(formData);
        if (Object.keys(validationErrors).length === 0) {
            const sendData = {
                "avatar": avatar.file,
                "fullName": formData.fullName,
                "username": formData.username,
                "bio": formData.bio,
                "password": formData.password
            }

            try {
                const responseData = await axios.post(`${import.meta.env.VITE_SERVER}/api/v1/user/register`, sendData, { withCredentials: true, headers: { "Content-Type": "multipart/form-data" } });
                setFormData({ username: "", fullName: "", bio: "", password: "" });
                setShowAvatarPreview(false);
                if (responseData?.status === 200) {
                    toast.success(responseData.data.message, { id: toastId });
                    setIsLogin(true);
                }
            } catch (error) {
                toast.error(error?.response?.data?.message, { id: toastId });
            } finally {
                setIsLoading(false);
            }
        } else {
            toast.error("Something Went Wrong", { id: toastId });
            setErrors(validationErrors);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const timeout = setTimeout(() => {
            setErrors({});
        }, 5000);
        return () => {
            clearTimeout(timeout);
        }
    }, [errors]);

    return (
        <div style={{
            backgroundImage: pageBackgroundColor,
            display: 'flex', alignItems: "center", justifyContent: "center", height: "100vh"
        }}>
            {!isMobileScreen && <Stack><LightGradientText variant="h4" fontSize={"2.5rem"} fontWeight={"bold"} position={"absolute"}
                top={"2%"} left={"2%"}>ChatBook</LightGradientText>
            </Stack>}
            <Paper elevation={16} sx={{ paddingX: 4, paddingY: 2, display: 'flex', flexDirection: "column", alignItems: "center", justifyContent: "center", width: isMobileScreen ? "100%" : "30%" }}  >
                {isLogin ? (
                    //LOGIN PART
                    <>
                        <GradientHeading textAlign={"center"} variant="h4" fontWeight={"bold"} marginBottom={"0.8rem"}>Login Form</GradientHeading>
                        <form onSubmit={handleLogin} >
                            <TextField fullWidth required type='text' name='username' label="Enter Your Username" margin='dense' variant='outlined' value={formData.username} onChange={handleChange} />
                            <TextField fullWidth required type='password' name='password' label="Enter Your Password" margin='dense' variant='outlined' sx={{ marginTop: "1rem" }} value={formData.password} onChange={handleChange} />
                            <Button sx={{ marginTop: "1rem", padding: 1 }} fullWidth type='submit' variant='contained' disabled={isLoading}>Login</Button>
                            <Typography sx={{ marginTop: "1rem", fontSize: "0.79rem" }} variant='body1' textAlign={"center"} >
                                Or, New to here?
                                <Button type='text' variant='text' disabled={isLoading} onClick={toggleLogin}>Click Here</Button>to Register
                            </Typography>
                            <Typography sx={{ fontSize: "0.73rem" }} variant='body1' textAlign={"center"}>Or, If You Are Admin <Button type='text' variant='text' onClick={() => navigate("/admin")} >Click Here</Button>to Login
                            </Typography>
                        </form>
                    </>
                ) : (
                    //SIGN-UP PART
                    <>
                        <GradientHeading textAlign={"center"} variant="h4" fontWeight={"bold"} marginBottom={"0.8rem"}>Sign Up Form</GradientHeading>
                        <form onSubmit={handleRegister} >
                            <Stack position={'relative'} width={"8rem"} margin={"auto"} >
                                {showAvatarPreview ? (<Avatar sx={{ width: "7rem", height: "7rem", objectFit: "contain" }} src={avatar.preview} />) : (<Avatar sx={{ width: "7rem", height: "7rem", objectFit: "contain" }} src="" />)}
                                <IconButton sx={{ position: "absolute", bottom: "0", right: "10px", bgColor: "rgba(0,0,0,0.8)", ":hover": { bgcolor: "rgba(0,0,0,0.4)" } }} component="label" onClick={() => setShowAvatarPreview(true)}>
                                    <>
                                        <CameraIcon />
                                        <VisuallyHiddenInput type='file' onChange={avatar.changeHandler} />
                                    </>
                                </IconButton>
                            </Stack>
                            {avatar.error && (<Typography m={"1rem auto"} width={"fit-content"} display={"block"} color="error"
                                variant="caption"> {avatar.error}</Typography>)}
                            <TextField fullWidth required type='text' name="fullName" label="Enter Your Full Name" margin='dense' variant='outlined' value={formData.fullName} onChange={handleChange} />
                            {errors.fullName && (<Typography color="error" variant="caption">{errors.fullName}</Typography>)}
                            <TextField fullWidth required type='text' name="username" label="Enter Your Username" margin='dense' variant='outlined' sx={{ marginTop: "0.5rem" }} value={formData.username} onChange={handleChange} />
                            {errors.username && (<Typography color="error" variant="caption">{errors.username}</Typography>)}
                            <TextField fullWidth required type='text' name="bio" label="Enter Your Bio" margin='dense' variant='outlined' sx={{ marginTop: "0.5rem" }} value={formData.bio} onChange={handleChange} />
                            {errors.bio && (<Typography color="error" variant="caption">{errors.bio}</Typography>)}
                            <TextField fullWidth required type='password' name="password" label="Enter Your Password" margin='dense' variant='outlined' sx={{ marginTop: "0.5rem" }} value={formData.password} onChange={handleChange} />
                            {errors.password && (<Typography color="error" variant="caption">{errors.password}</Typography>)}
                            <Button sx={{ marginTop: "0.8rem", padding: 1 }} fullWidth type='submit' variant='contained' disabled={isLoading}>Sign Up</Button>
                            <Typography sx={{ marginTop: "0.8rem", fontSize: "0.8rem" }} variant='body1' textAlign={"center"} >
                                Or, Already Registered?
                                <Button type='text' variant='text' disabled={isLoading} onClick={toggleLogin}>Click Here</Button>to Login
                            </Typography>
                        </form>
                    </>)}
            </Paper>
        </div >
    )
}

export default Login