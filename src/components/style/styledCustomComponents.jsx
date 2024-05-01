import { Skeleton, Typography, keyframes, styled } from '@mui/material';
import { Link as LinkRouter } from "react-router-dom";
import { chatListHoverColor, grayColor, matBlack } from '../../constants/color';

export const LightGradientText = styled(Typography)(() => ({
  background: "linear-gradient(56deg, rgba(188,204,17,1) 20%, rgba(176,191,41,1) 27%, rgba(204,92,92,1) 81%)",
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
}));

export const DarkGradientText = styled(Typography)(() => ({
  background: "linear-gradient(352deg, rgba(153,56,230,1) 38%, rgba(63,59,174,1) 73%)",
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
}));

export const GradientHeading = styled(Typography)(() => ({
  background: "linear-gradient(56deg, rgba(31,156,185,1) 44%, rgba(69,97,179,1) 73%)",
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
}));

export const VisuallyHiddenInput = styled("input")({
  border: 0,
  height: 1,
  margin: -1,
  overflow: "hidden",
  padding: 0,
  position: "absolute",
  width: 1,
  whiteSpace: "nowrap",
  clip: "rect(0 0 0 0)"
});

export const Link = styled(LinkRouter)`
    text-decoration:none;
    border-radius:10px;
    margin:0.5rem;
    transition-duration:300ms;
    &:hover{
        background-color:${chatListHoverColor};
        transition-duration:300ms;
    }
`;

export const GroupLink = styled(LinkRouter)`
    text-decoration:none;
    border-radius:10px;
    margin:0.5rem;
    padding:1rem;
    transition-duration:300ms;
    &:hover{
        background-color:${chatListHoverColor};
        transition-duration:300ms;
    }
`;

export const ChatInputBox = styled("input")`
    width: 100%;
    height: 100%;
    border: none;
    outline : none;
    padding: 1.4rem 3rem;
    border-radius : 1.5rem;
    margin:0 0 0 8px;
    background-color: rgba(247,247,247,1);
`;

export const AdminLink = styled(LinkRouter)`
  text-decoration: none;
  border-radius: 2rem;
  padding: 1rem 2rem;
  color: black;
  &:hover {
    color: rgba(0, 0, 0, 0.54);
  }
`;

export const SearchField = styled("input")`
  padding: 1rem 2rem;
  width: 20vmax;
  border: none;
  outline: none;
  border-radius: 1.5rem;
  background-color: ${grayColor};
  font-size: 1.1rem;
`;

export const CurveButton = styled("button")`
  border-radius: 1.5rem;
  padding: 1rem 2rem;
  border: none;
  outline: none;
  cursor: pointer;
  background-color: ${matBlack};
  color: white;
  font-size: 1.1rem;
  &:hover {
    background-color: rgba(0, 0, 0, 0.8);
  }
`;

export const bounceAnimation = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.5); }
  100% { transform: scale(1); }
`;

export const BouncingSkeleton = styled(Skeleton)(() => ({
  animation: `${bounceAnimation} 1s infinite`,
}));