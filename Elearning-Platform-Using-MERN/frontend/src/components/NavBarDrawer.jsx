import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Heading,
  Text,
  useToast,
  IconButton,
  VStack,
} from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import { RxCross2 } from "react-icons/rx";
import { useDispatch, useSelector, useStore } from "react-redux";
import { BiUserCircle } from "react-icons/bi";
import { capitalizeFirstLetter } from "../Redux/UserReducer/action";
import { FaUserShield } from "react-icons/fa";
import { IoIosArrowForward } from "react-icons/io";
import axios from "axios";
import { actionUserLogout } from "../Redux/UserReducer/actionType";
import { showToast } from "./SignUp";
import { API_BASE_URL } from "../config";

export function NavBarDrawer({ isOpen, onClose }) {
  const userStore = useSelector((store) => store.UserReducer);
  const navigate = useNavigate();
  const toast = useToast();
  const dispatch = useDispatch();

  const handleLogoutClick = () => {
    const token = userStore?.token;
    const headers = { Authorization: `Bearer ${token}` };
    axios
      .post(`${API_BASE_URL}/users/logout`, {}, { headers })
      .then((res) => {
        localStorage.setItem("user", JSON.stringify({ isAuth: false, role: "", name: "" }));
        dispatch(actionUserLogout());
        showToast({ toast, message: "Logged out successfully", color: "green" });
        onClose();
        navigate("/");
      })
      .catch((err) => console.log(err));
  };

  const navLinks = [
    { label: "Trending Courses", href: "/#trending-courses" },
    { label: "New Releases", href: "/new-releases" },
    { label: "For Business", href: "/for-business" },
    { label: "Become a Teacher", href: "/become-a-teacher" },
  ];

  return (
    <Drawer placement="top" onClose={onClose} isOpen={isOpen}>
      <DrawerOverlay backdropFilter="blur(8px)" bg="blackAlpha.700" />
      <DrawerContent bg="transparent" borderBottomRadius="32px" overflow="hidden">
        <Box
          className="rc-glass"
          backdropFilter="blur(20px)"
          bg="rgba(15, 15, 15, 0.9)"
          w="100%"
          p={6}
          borderBottomRadius="32px"
          borderBottom="1px solid"
          borderColor="whiteAlpha.100"
        >
          <Flex direction="column" gap={8}>
            {/* Header */}
            <Flex justify="space-between" align="center">
              <Text
                fontSize="2xl"
                fontWeight="900"
                color="var(--rc-accent)"
                onClick={() => { navigate("/"); onClose(); }}
                cursor="pointer"
                letterSpacing="-1px"
              >
                LearnHub
              </Text>
              <IconButton
                icon={<RxCross2 size="24px" />}
                onClick={onClose}
                variant="ghost"
                color="whiteAlpha.600"
                _hover={{ color: "white", bg: "whiteAlpha.100" }}
                borderRadius="full"
              />
            </Flex>

            {/* Profile Section */}
            {userStore?.isAuth ? (
              <Box className="rc-glass" p={5} borderRadius="24px" bg="whiteAlpha.50">
                <Flex justify="space-between" align="center">
                  <Flex gap={4} align="center">
                    <Box
                      p={3}
                      bg="var(--rc-accent)"
                      borderRadius="full"
                      color="white"
                    >
                      {userStore?.role === "admin" ? <FaUserShield size="20px" /> : <BiUserCircle size="20px" />}
                    </Box>
                    <Box>
                      <Text color="white" fontWeight="800" fontSize="md">
                        {capitalizeFirstLetter(userStore?.name)}
                      </Text>
                      <Text color="whiteAlpha.500" fontSize="xs" fontWeight="700" textTransform="uppercase">
                        {userStore?.role}
                      </Text>
                    </Box>
                  </Flex>
                  <Button
                    size="sm"
                    variant="outline"
                    borderColor="whiteAlpha.300"
                    color="white"
                    borderRadius="full"
                    px={5}
                    fontSize="xs"
                    fontWeight="700"
                    onClick={handleLogoutClick}
                    _hover={{ bg: "whiteAlpha.100", borderColor: "whiteAlpha.500" }}
                  >
                    LOGOUT
                  </Button>
                </Flex>
              </Box>
            ) : (
              <Flex gap={4}>
                <Button
                  flex={1}
                  bg="white"
                  color="black"
                  borderRadius="full"
                  fontWeight="700"
                  h="48px"
                  onClick={() => { navigate("/login"); onClose(); }}
                >
                  Log In
                </Button>
                <Button
                  flex={1}
                  bg="var(--rc-accent)"
                  color="white"
                  borderRadius="full"
                  fontWeight="700"
                  h="48px"
                  onClick={() => { navigate("/signup"); onClose(); }}
                  _hover={{ bg: "red.400" }}
                >
                  Join Free
                </Button>
              </Flex>
            )}

            {/* Navigation Links */}
            <VStack align="stretch" spacing={2}>
              {navLinks.map((link) => (
                <Flex
                  key={link.label}
                  py={4}
                  px={4}
                  borderRadius="16px"
                  align="center"
                  justify="space-between"
                  cursor="pointer"
                  transition="all 0.2s"
                  _hover={{ bg: "whiteAlpha.100" }}
                  onClick={() => {
                    if (link.href.startsWith("/#")) {
                      navigate("/");
                      setTimeout(() => {
                        document.getElementById(link.href.substring(2))?.scrollIntoView({ behavior: 'smooth' });
                      }, 100);
                    } else {
                      navigate(link.href);
                    }
                    onClose();
                  }}
                >
                  <Text color="whiteAlpha.800" fontWeight="600" fontSize="md">
                    {link.label}
                  </Text>
                  <IoIosArrowForward color="var(--rc-accent)" />
                </Flex>
              ))}

              {userStore?.isAuth && (
                <Flex
                  py={4}
                  px={4}
                  borderRadius="16px"
                  align="center"
                  justify="space-between"
                  cursor="pointer"
                  transition="all 0.2s"
                  _hover={{ bg: "whiteAlpha.100" }}
                  onClick={() => { navigate("/my-courses"); onClose(); }}
                >
                  <Text color="whiteAlpha.800" fontWeight="600" fontSize="md">
                    Dashboard
                  </Text>
                  <IoIosArrowForward color="var(--rc-accent)" />
                </Flex>
              )}
            </VStack>
          </Flex>
        </Box>
      </DrawerContent>
    </Drawer>
  );
}
