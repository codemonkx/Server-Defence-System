import { Box, Text } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import "./adminRoute.css";

export const AdminRoute = ({ children }) => {
  const userStore = useSelector((store) => store.UserReducer);
  if (userStore?.role === "admin") {
    return (
      <>
        <Box>
          {children}
        </Box>
      </>
    );
  }
  return <Navigate to="/home" />;
};