import React, { useState, useEffect } from "react";
import {
  ChakraProvider,
  Box,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  Flex,
  Text,
  Heading,
} from "@chakra-ui/react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { actionUserLogout } from "../../Redux/UserReducer/actionType";
import { BiUserCircle } from "react-icons/bi";
import { FaUserShield } from "react-icons/fa";
import { FiMoreVertical } from "react-icons/fi";
import { capitalizeFirstLetter } from "../../Redux/UserReducer/action";
import { API_BASE_URL } from "../../config";
const Dropdown = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userStore = useSelector((store) => store.UserReducer);

  const handleProfileClick = () => {
    // Handle profile click logic
    navigate("/profile");
  };

  const handleLogoutClick = () => {
    const token = userStore?.token;
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    axios
      .post(
        `${API_BASE_URL}/users/logout`,
        {},
        { headers }
      )
      .then((res) => {
        localStorage.setItem(
          "user",
          JSON.stringify({
            email: "",
            name: "",
            role: "",
            token: "",
            isAuth: "",
            isError: "",
            loading: false,
            success: false,
            isUser: false,
            userId: "",
            place: "",
            age: "",
          })
        );
        dispatch(actionUserLogout());
        navigate("/");
      })
      .catch((err) => console.log(err));
  };

  return (
    <ChakraProvider>
      <Box>
        <Menu>
          <MenuButton
            as={Button}
            bg="whiteAlpha.100"
            color="white"
            variant="outline"
            borderColor="whiteAlpha.200"
            borderRadius="xl"
            _hover={{
              bg: "whiteAlpha.200",
              borderColor: "var(--rc-accent)",
              cursor: "pointer",
            }}
            _active={{
              bg: "whiteAlpha.300",
            }}
          >
            <Flex alignItems="center">
              <Text fontWeight="600">Profile</Text>
              <Box ml="0.5rem">
                <FiMoreVertical />
              </Box>
            </Flex>
          </MenuButton>
          <MenuList
            p={0}
            w='300px'
            overflow={userStore?.role === 'admin' ? 'scroll' : ''}
            h={userStore?.role === 'admin' ? '90vh' : ''}
            className="rc-glass"
            border="1px solid"
            borderColor="whiteAlpha.100"
            boxShadow="0 20px 50px rgba(0, 0, 0, 0.5)"
            backdropFilter="blur(20px)"
            bg="rgba(15, 15, 15, 0.7)"
          >
            {/* user options  */}
            {/* User Profile Summary */}
            <Box p={5} borderBottom="1px solid" borderColor="whiteAlpha.100">
              <Flex direction="column" gap={4}>
                <Flex align="center" gap={3}>
                  <Box p={2} borderRadius="full" bg="whiteAlpha.100">
                    {userStore?.role === "admin" || userStore?.role === 'teacher' ? (
                      <FaUserShield size="20px" color="var(--rc-accent)" />
                    ) : (
                      <BiUserCircle size="20px" color="var(--rc-accent)" />
                    )}
                  </Box>
                  <Box>
                    <Heading size="xs" color="white" fontWeight="700">
                      {capitalizeFirstLetter(userStore?.name)}
                    </Heading>
                    <Text fontSize="10px" fontWeight="800" color="whiteAlpha.500" letterSpacing="1px" textTransform="uppercase">
                      {userStore?.role}
                    </Text>
                  </Box>
                </Flex>
                <Button
                  size="sm"
                  w="full"
                  bg="var(--rc-accent)"
                  color="white"
                  borderRadius="full"
                  fontSize="xs"
                  fontWeight="700"
                  onClick={handleLogoutClick}
                  _hover={{ opacity: 0.9, transform: "translateY(-1px)" }}
                  _active={{ transform: "translateY(0)" }}
                  transition="all 0.2s"
                >
                  Logout
                </Button>
              </Flex>
            </Box>
            {/* users options  */}
            {userStore?.role === "user" && (
              <Box>
                <Link to="/profile">
                  <MenuItem
                    px={5}
                    py={3}
                    fontSize="sm"
                    fontWeight="500"
                    bg="transparent"
                    color="whiteAlpha.700"
                    _hover={{ bg: "whiteAlpha.100", color: "white" }}
                    _active={{ bg: "whiteAlpha.200" }}
                    transition="all 0.2s"
                  >
                    Your Account
                  </MenuItem>
                </Link>

                <Link to="/my-courses">
                  <MenuItem
                    px={5}
                    py={3}
                    fontSize="sm"
                    fontWeight="500"
                    bg="transparent"
                    color="whiteAlpha.700"
                    _hover={{ bg: "whiteAlpha.100", color: "white" }}
                    _active={{ bg: "whiteAlpha.200" }}
                    transition="all 0.2s"
                  >
                    DashBoard
                  </MenuItem>
                </Link>
              </Box>
            )}
            {/* admin options */}

            {userStore?.role === "admin" && (
              <Box >
                <Link to="/profile">
                  <MenuItem
                    px={5}
                    py={3}
                    fontSize="sm"
                    fontWeight="500"
                    bg="transparent"
                    color="whiteAlpha.700"
                    _hover={{ bg: "whiteAlpha.100", color: "white" }}
                    _active={{ bg: "whiteAlpha.200" }}
                    transition="all 0.2s"
                  >
                    Your Account
                  </MenuItem>
                </Link>
                <Link to="/home">
                  <MenuItem
                    px={5}
                    py={3}
                    fontSize="sm"
                    fontWeight="500"
                    bg="transparent"
                    color="whiteAlpha.700"
                    _hover={{ bg: "whiteAlpha.100", color: "white" }}
                    _active={{ bg: "whiteAlpha.200" }}
                    transition="all 0.2s"
                  >
                    User Dashboard
                  </MenuItem>
                </Link>
                <Link to="/admin/dashboard">
                  <MenuItem
                    px={5}
                    py={3}
                    fontSize="sm"
                    fontWeight="500"
                    bg="transparent"
                    color="whiteAlpha.700"
                    _hover={{ bg: "whiteAlpha.100", color: "white" }}
                    _active={{ bg: "whiteAlpha.200" }}
                    transition="all 0.2s"
                  >
                    Admin Dashboard
                  </MenuItem>
                </Link>
                <Link to="/admin/courses">
                  <MenuItem
                    px={5}
                    py={3}
                    fontSize="sm"
                    fontWeight="500"
                    bg="transparent"
                    color="whiteAlpha.700"
                    _hover={{ bg: "whiteAlpha.100", color: "white" }}
                    _active={{ bg: "whiteAlpha.200" }}
                    transition="all 0.2s"
                  >
                    Courses
                  </MenuItem>
                </Link>
                <Link to="/admin/users">
                  <MenuItem
                    px={5}
                    py={3}
                    fontSize="sm"
                    fontWeight="500"
                    bg="transparent"
                    color="whiteAlpha.700"
                    _hover={{ bg: "whiteAlpha.100", color: "white" }}
                    _active={{ bg: "whiteAlpha.200" }}
                    transition="all 0.2s"
                  >
                    Users
                  </MenuItem>
                </Link>
                <Link to="/admin/Add">
                  <MenuItem
                    px={5}
                    py={3}
                    fontSize="sm"
                    fontWeight="500"
                    bg="transparent"
                    color="whiteAlpha.700"
                    _hover={{ bg: "whiteAlpha.100", color: "white" }}
                    _active={{ bg: "whiteAlpha.200" }}
                    transition="all 0.2s"
                  >
                    Add videos
                  </MenuItem>
                </Link>
                <Link to="/admin/videos">
                  <MenuItem
                    px={5}
                    py={3}
                    fontSize="sm"
                    fontWeight="500"
                    bg="transparent"
                    color="whiteAlpha.700"
                    _hover={{ bg: "whiteAlpha.100", color: "white" }}
                    _active={{ bg: "whiteAlpha.200" }}
                    transition="all 0.2s"
                  >
                    AllVideos
                  </MenuItem>
                </Link>
                <Link to="/admin/discount">
                  <MenuItem
                    px={5}
                    py={3}
                    fontSize="sm"
                    fontWeight="500"
                    bg="transparent"
                    color="whiteAlpha.700"
                    _hover={{ bg: "whiteAlpha.100", color: "white" }}
                    _active={{ bg: "whiteAlpha.200" }}
                    transition="all 0.2s"
                  >
                    Discount
                  </MenuItem>
                </Link>
                <Link to="/admin/giftcard">
                  <MenuItem
                    px={5}
                    py={3}
                    fontSize="sm"
                    fontWeight="500"
                    bg="transparent"
                    color="whiteAlpha.700"
                    _hover={{ bg: "whiteAlpha.100", color: "white" }}
                    _active={{ bg: "whiteAlpha.200" }}
                    transition="all 0.2s"
                  >
                    GiftCards
                  </MenuItem>
                </Link>
                <Link to="/admin/statistic">
                  <MenuItem
                    px={5}
                    py={3}
                    fontSize="sm"
                    fontWeight="500"
                    bg="transparent"
                    color="whiteAlpha.700"
                    _hover={{ bg: "whiteAlpha.100", color: "white" }}
                    _active={{ bg: "whiteAlpha.200" }}
                    transition="all 0.2s"
                  >
                    Statistics
                  </MenuItem>
                </Link>
                <Link to="/admin/logs">
                  <MenuItem
                    px={5}
                    py={3}
                    fontSize="sm"
                    fontWeight="500"
                    bg="transparent"
                    color="whiteAlpha.700"
                    _hover={{ bg: "whiteAlpha.100", color: "white" }}
                    _active={{ bg: "whiteAlpha.200" }}
                    transition="all 0.2s"
                  >
                    Server Logs
                  </MenuItem>
                </Link>
                <Link to="/admin/setting">
                  <MenuItem
                    px={5}
                    py={3}
                    fontSize="sm"
                    fontWeight="500"
                    bg="transparent"
                    color="whiteAlpha.700"
                    _hover={{ bg: "whiteAlpha.100", color: "white" }}
                    _active={{ bg: "whiteAlpha.200" }}
                    transition="all 0.2s"
                  >
                    Settings
                  </MenuItem>
                </Link>
              </Box>
            )}

            {/* Teacher options */}

            {userStore?.role === 'teacher' && (
              <Box >
                <Link to="/profile">
                  <MenuItem
                    px={5}
                    py={3}
                    fontSize="sm"
                    fontWeight="500"
                    bg="transparent"
                    color="whiteAlpha.700"
                    _hover={{ bg: "whiteAlpha.100", color: "white" }}
                    _active={{ bg: "whiteAlpha.200" }}
                    transition="all 0.2s"
                  >
                    Your Account
                  </MenuItem>
                </Link>
                <Link to="/home">
                  <MenuItem
                    px={5}
                    py={3}
                    fontSize="sm"
                    fontWeight="500"
                    bg="transparent"
                    color="whiteAlpha.700"
                    _hover={{ bg: "whiteAlpha.100", color: "white" }}
                    _active={{ bg: "whiteAlpha.200" }}
                    transition="all 0.2s"
                  >
                    User Dashboard
                  </MenuItem>
                </Link>
                <Link to="/TeacherDashboard">
                  <MenuItem
                    px={5}
                    py={3}
                    fontSize="sm"
                    fontWeight="500"
                    bg="transparent"
                    color="whiteAlpha.700"
                    _hover={{ bg: "whiteAlpha.100", color: "white" }}
                    _active={{ bg: "whiteAlpha.200" }}
                    transition="all 0.2s"
                  >
                    Teacher Dashboard
                  </MenuItem>
                </Link>
                <Link to="/Teacher/courses">
                  <MenuItem
                    px={5}
                    py={3}
                    fontSize="sm"
                    fontWeight="500"
                    bg="transparent"
                    color="whiteAlpha.700"
                    _hover={{ bg: "whiteAlpha.100", color: "white" }}
                    _active={{ bg: "whiteAlpha.200" }}
                    transition="all 0.2s"
                  >
                    Courses
                  </MenuItem>
                </Link>
                {/* <Link to="/Teacher/users">
                  <MenuItem
                    px={5}
                    py={3}
                    fontSize="sm"
                    fontWeight="500"
                    bg="transparent"
                    color="whiteAlpha.700"
                    _hover={{ bg: "whiteAlpha.100", color: "white" }}
                    _active={{ bg: "whiteAlpha.200" }}
                    transition="all 0.2s"
                  >
                    Users
                  </MenuItem>
                </Link> */}
                {/* <Link to="/Teacher/videos">
                  <MenuItem
                    px={5}
                    py={3}
                    fontSize="sm"
                    fontWeight="500"
                    bg="transparent"
                    color="whiteAlpha.700"
                    _hover={{ bg: "whiteAlpha.100", color: "white" }}
                    _active={{ bg: "whiteAlpha.200" }}
                    transition="all 0.2s"
                  >
                    All Videos
                  </MenuItem>
                </Link> */}
                <Link to="/Teacher/add">
                  <MenuItem
                    px={5}
                    py={3}
                    fontSize="sm"
                    fontWeight="500"
                    bg="transparent"
                    color="whiteAlpha.700"
                    _hover={{ bg: "whiteAlpha.100", color: "white" }}
                    _active={{ bg: "whiteAlpha.200" }}
                    transition="all 0.2s"
                  >
                    Add Videos
                  </MenuItem>
                </Link>
                {/* <Link to="/admin/discount">
                  <MenuItem
                    px={5}
                    py={3}
                    fontSize="sm"
                    fontWeight="500"
                    bg="transparent"
                    color="whiteAlpha.700"
                    _hover={{ bg: "whiteAlpha.100", color: "white" }}
                    _active={{ bg: "whiteAlpha.200" }}
                    transition="all 0.2s"
                  >
                    Discount
                  </MenuItem>
                </Link>
                <Link to="/admin/giftcard">
                  <MenuItem
                    px={5}
                    py={3}
                    fontSize="sm"
                    fontWeight="500"
                    bg="transparent"
                    color="whiteAlpha.700"
                    _hover={{ bg: "whiteAlpha.100", color: "white" }}
                    _active={{ bg: "whiteAlpha.200" }}
                    transition="all 0.2s"
                  >
                    GiftCards
                  </MenuItem>
                </Link>
                <Link to="/admin/statistic">
                  <MenuItem
                    px={5}
                    py={3}
                    fontSize="sm"
                    fontWeight="500"
                    bg="transparent"
                    color="whiteAlpha.700"
                    _hover={{ bg: "whiteAlpha.100", color: "white" }}
                    _active={{ bg: "whiteAlpha.200" }}
                    transition="all 0.2s"
                  >
                    Statistics
                  </MenuItem>
                </Link> */}
                <Link to="/admin/setting">
                  <MenuItem
                    px={5}
                    py={3}
                    fontSize="sm"
                    fontWeight="500"
                    bg="transparent"
                    color="whiteAlpha.700"
                    _hover={{ bg: "whiteAlpha.100", color: "white" }}
                    _active={{ bg: "whiteAlpha.200" }}
                    transition="all 0.2s"
                  >
                    Settings
                  </MenuItem>
                </Link>
              </Box>
            )}
          </MenuList>
        </Menu>
      </Box>
    </ChakraProvider>
  );
};

export default Dropdown;
