import React, { useRef, useState } from "react";
import Navbar from "../Pages/Navbar";
import {
  Box,
  Button,
  Flex,
  Heading,
  Input,
  Spinner,
  Text,
  Toast,
  keyframes,
  useToast,
  VStack
} from "@chakra-ui/react";

import { AiOutlineEyeInvisible, AiFillEye } from "react-icons/ai";

import { useDispatch, useSelector } from "react-redux";

import { Link, useNavigate } from "react-router-dom";
import { signUpFetch } from "../Redux/UserReducer/action";
import { actionsingUpError } from "../Redux/UserReducer/actionType";

// Sucess Toast
export const showToast = ({ toast, message, color }) => {
  toast({
    position: "top-right",
    top: "100px",
    duration: 3000,
    render: () => (
      <Box color="white" p={3} bg={color}>
        {message || 'Something Went Wrong Please Refresh'}
      </Box>
    ),
  });
};

const SignUp = () => {
  const emailInput = useRef(null);
  const backgroundRef = useRef(null);
  const passwordInput = useRef(null);
  const nameInput = useRef(null);
  const confirmPasswordInput = useRef(null);
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    isPromotion: false,
  });

  const navigate = useNavigate();
  const userStore = useSelector((store) => store.UserReducer);
  const dispatch = useDispatch();
  const [isChecked, setIsChecked] = useState(false);
  const [eyeclose, seteyeMoment] = useState(false);
  const toast = useToast();

  function showInput(e) {
    const ele = e.currentTarget.id;
    if (ele === "email") {
      emailInput.current.focus();
    } else if (ele === "password") {
      passwordInput.current.focus();
    } else if (ele === "name") {
      nameInput.current.focus();
    } else if (ele === "confirmPassword") {
      confirmPasswordInput.current.focus();
    }
  }

  function handleInput(e) {
    const { value, name } = e.target;
    setForm({ ...form, [name]: value });
  }

  function showPassword() {
    seteyeMoment(!eyeclose);
    passwordInput.current.type === "password"
      ? (passwordInput.current.type = "text")
      : (passwordInput.current.type = "password");
  }

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
    setForm({ ...form, isPromotion: !isChecked });
  };

  async function handleSignUp() {
    const { email, password, confirmPassword, name } = form;
    if (!email || !password || !confirmPassword || !name) {
      showToast({ toast, message: "All fields are required", color: "red" });
      return;
    }

    if (confirmPassword !== password) {
      showToast({ toast, message: "Passwords do not match", color: "red" });
      return;
    }

    if (password.length < 8) {
      showToast({ toast, message: "Password should be at least 8 characters", color: "red" });
      return;
    }

    dispatch(signUpFetch(form)).then((res) => {
      if (!userStore?.isError) {
        setForm({ email: "", password: "", confirmPassword: "", name: "" });
        showToast({ toast, message: 'SignUp Successful', color: 'green' });
        navigate('/login')
      } else {
        showToast({ toast, message: userStore?.isError, color: 'red' });
      }
    });
  }

  return (
    <Box minH="100vh" bg="var(--rc-bg)" color="var(--rc-fg)">
      <Navbar />
      <Flex
        justifyContent="center"
        alignItems="center"
        pt="120px"
        pb="60px"
        px={4}
      >
        <Box
          className="rc-glass"
          w={{ base: "100%", sm: "450px" }}
          p={8}
          borderRadius="24px"
          boxShadow="0 20px 40px rgba(0,0,0,0.4)"
        >
          <VStack spacing={8} align="stretch">
            <Box textAlign="center">
              <Heading size="lg" fontWeight="800" letterSpacing="-1px">
                Create Account
              </Heading>
              <Text color="whiteAlpha.600" mt={2} fontWeight="500">
                Join LearnHub and start learning
              </Text>
            </Box>

            <VStack spacing={4}>
              <Box
                w="100%"
                p={4}
                bg="whiteAlpha.50"
                border="1px solid"
                borderColor="whiteAlpha.100"
                borderRadius="16px"
                id="name"
                onClick={showInput}
                cursor="text"
                _hover={{ borderColor: "whiteAlpha.300", bg: "whiteAlpha.100" }}
              >
                <Text fontSize="xs" fontWeight="700" color="whiteAlpha.500" mb={1}>
                  FULL NAME
                </Text>
                <Input
                  ref={nameInput}
                  variant="unstyled"
                  placeholder="John Doe"
                  name="name"
                  value={form.name}
                  onChange={handleInput}
                  _placeholder={{ color: "whiteAlpha.300" }}
                  fontWeight="600"
                />
              </Box>

              <Box
                w="100%"
                p={4}
                bg="whiteAlpha.50"
                border="1px solid"
                borderColor="whiteAlpha.100"
                borderRadius="16px"
                id="email"
                onClick={showInput}
                cursor="text"
                _hover={{ borderColor: "whiteAlpha.300", bg: "whiteAlpha.100" }}
              >
                <Text fontSize="xs" fontWeight="700" color="whiteAlpha.500" mb={1}>
                  EMAIL
                </Text>
                <Input
                  ref={emailInput}
                  variant="unstyled"
                  placeholder="name@example.com"
                  name="email"
                  value={form.email}
                  onChange={handleInput}
                  _placeholder={{ color: "whiteAlpha.300" }}
                  fontWeight="600"
                />
              </Box>

              <Box
                w="100%"
                p={4}
                bg="whiteAlpha.50"
                border="1px solid"
                borderColor="whiteAlpha.100"
                borderRadius="16px"
                id="password"
                onClick={showInput}
                cursor="text"
                _hover={{ borderColor: "whiteAlpha.300", bg: "whiteAlpha.100" }}
                position="relative"
              >
                <Text fontSize="xs" fontWeight="700" color="whiteAlpha.500" mb={1}>
                  PASSWORD
                </Text>
                <Input
                  ref={passwordInput}
                  type="password"
                  variant="unstyled"
                  placeholder="••••••••"
                  name="password"
                  value={form.password}
                  onChange={handleInput}
                  _placeholder={{ color: "whiteAlpha.300" }}
                  fontWeight="600"
                />
                <Box position="absolute" right={4} top="50%" transform="translateY(-50%)" onClick={showPassword} cursor="pointer" opacity={0.5}>
                  {eyeclose ? <AiFillEye size="20px" /> : <AiOutlineEyeInvisible size="20px" />}
                </Box>
              </Box>

              <Box
                w="100%"
                p={4}
                bg="whiteAlpha.50"
                border="1px solid"
                borderColor="whiteAlpha.100"
                borderRadius="16px"
                id="confirmPassword"
                onClick={showInput}
                cursor="text"
                _hover={{ borderColor: "whiteAlpha.300", bg: "whiteAlpha.100" }}
              >
                <Text fontSize="xs" fontWeight="700" color="whiteAlpha.500" mb={1}>
                  CONFIRM PASSWORD
                </Text>
                <Input
                  ref={confirmPasswordInput}
                  type="password"
                  variant="unstyled"
                  placeholder="••••••••"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleInput}
                  _placeholder={{ color: "whiteAlpha.300" }}
                  fontWeight="600"
                />
              </Box>
            </VStack>

            <Flex align="center">
              <input
                type="checkbox"
                checked={isChecked}
                onChange={handleCheckboxChange}
                style={{ width: "18px", height: "18px", accentColor: "var(--rc-accent)" }}
              />
              <Text ml={3} fontSize="sm" color="whiteAlpha.600" fontWeight="500">
                Send me special offers and learning tips.
              </Text>
            </Flex>

            <Button
              w="100%"
              h="56px"
              bg="white"
              color="black"
              borderRadius="16px"
              fontWeight="700"
              fontSize="md"
              _hover={{ bg: "whiteAlpha.900", transform: "translateY(-1px)" }}
              _active={{ transform: "translateY(0)" }}
              onClick={handleSignUp}
              isLoading={userStore.loading}
            >
              Sign up
            </Button>

            <Flex justify="center" fontSize="sm" fontWeight="600">
              <Text color="whiteAlpha.600">Already have an account?</Text>
              <Link to="/login">
                <Text ml={2} color="var(--rc-accent)" _hover={{ textDecoration: "underline" }}>
                  Login
                </Text>
              </Link>
            </Flex>
          </VStack>
        </Box>
      </Flex>
    </Box>
  );
};

export default SignUp;
