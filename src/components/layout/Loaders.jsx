import { Grid, Skeleton, Stack } from "@mui/material";
import { BouncingSkeleton } from "../style/styledCustomComponents";

const Loaders = () => {
    return (
        <>
            <Skeleton variant="rectangular" height={"4rem"} />
            <Grid container height={"calc(100vh - 4rem)"} spacing={"0.3rem"}>
                <Grid item sm={4} md={3} sx={{ display: { xs: "none", sm: "block" }, marginTop: "0.2rem", }} height={"100%"}>
                    <Stack spacing={"1rem"} sx={{ marginTop: "0.2rem" }}>
                        {Array.from({ length: 7 }).map((_, id) => (<Skeleton key={id} variant="rounded" height={"4.05rem"} />))}
                    </Stack>
                </Grid>
                <Grid item xs={12} sm={8} md={5} lg={6} sx={{ marginTop: "0.2rem", }} height={"100%"}>
                    <Skeleton variant="rounded" height={"100%"} />
                </Grid>
                <Grid item md={4} lg={3} sx={{ display: { xs: "none", md: "block" }, marginTop: "0.2rem", }} height={"100%"}>
                    <Skeleton variant="rounded" height={"100%"} />
                </Grid>
            </Grid >
        </>
    )
}

export const TypingLoader = () => {
    return (
        <Stack spacing={"0.5rem"} direction={"row"} padding={"0.5rem"} justifyContent={"center"}>
            <BouncingSkeleton variant="circular" width={10} height={10} style={{ animationDelay: "0.1s", backgroundColor: "#444444" }} />
            <BouncingSkeleton variant="circular" width={10} height={10} style={{ animationDelay: "0.2s", backgroundColor: "#444444" }} />
            <BouncingSkeleton variant="circular" width={10} height={10} style={{ animationDelay: "0.4s", backgroundColor: "#444444" }} />
            <BouncingSkeleton variant="circular" width={10} height={10} style={{ animationDelay: "0.6s", backgroundColor: "#444444" }} />
        </Stack>
    );
};
export default Loaders