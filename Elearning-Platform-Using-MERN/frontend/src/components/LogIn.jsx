import React, { useEffect, useRef, useState } from "react";
import Navbar from "../Pages/Navbar";
import {
  Box,
  Button,
  Flex,
  Heading,
  Input,
  Spinner,
  Text,
  keyframes,
  useToast,
  VStack
} from "@chakra-ui/react";

import { useDispatch, useSelector, useStore } from "react-redux";
import { loginFetch } from "../Redux/UserReducer/action";
import { Link, useNavigate } from "react-router-dom";
import { showToast } from "./SignUp";

const Login = () => {
  const emailInput = useRef(null);
  const backgroundRef = useRef(null);
  const emailbox = useRef(null);
  const passwordInput = useRef(null);
  const passwordbox = useRef(null);
  const [form, setForm] = useState({ email: "", password: "" });

  const userStore = useSelector((store) => store.UserReducer);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();

  function showInput(e) {
    const ele = e.currentTarget.id;
    if (ele === "email") {
      emailInput.current.style.display = "block";
      emailInput.current.focus();
    } else if (ele === "password") {
      passwordInput.current.style.display = "block";
      passwordInput.current.focus();
    }
  }

  function handleInput(e) {
    const { value, name } = e.target;
    setForm({ ...form, [name]: value });
  }

  function handleLogin() {
    dispatch(loginFetch(form)).then((res) => {
      const user = JSON.parse(localStorage.getItem('user'))
      if (user?.message) {
        showToast({ toast, message: 'Login Successful', color: 'green' })
        setForm({ email: "", password: "" });
      } else {
        showToast({ toast, message: userStore?.isError || 'Login Failed', color: 'red' })
      }
    });
  }

  useEffect(() => {
    if (userStore.isAuth) {
      if (userStore?.role === 'user') {
        navigate("/home");
      } else if (userStore?.role === "admin") {
        navigate("/admin/dashboard");
      }
      else if (userStore?.role === 'teacher') {
        navigate("/TeacherDashboard");
      }
    }
  }, [userStore?.isAuth, userStore?.role])

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
          w={{ base: "100%", sm: "400px" }}
          p={8}
          borderRadius="24px"
          boxShadow="0 20px 40px rgba(0,0,0,0.4)"
        >
          <VStack spacing={8} align="stretch">
            <Box textAlign="center">
              <Heading size="lg" fontWeight="800" letterSpacing="-1px">
                Welcome back
              </Heading>
              <Text color="whiteAlpha.600" mt={2} fontWeight="500">
                Log in to your account
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
                id="email"
                onClick={showInput}
                cursor="text"
                transition="all 0.2s"
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
                transition="all 0.2s"
                _hover={{ borderColor: "whiteAlpha.300", bg: "whiteAlpha.100" }}
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
              </Box>
            </VStack>

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
              onClick={handleLogin}
              isLoading={userStore.loading}
            >
              Log in
            </Button>

            <Flex justify="center" fontSize="sm" fontWeight="600">
              <Text color="whiteAlpha.600">Don't have an account?</Text>
              <Link to='/signup'>
                <Text ml={2} color="var(--rc-accent)" _hover={{ textDecoration: "underline" }}>
                  Sign up
                </Text>
              </Link>
            </Flex>
          </VStack>
        </Box>
      </Flex>
    </Box>
  );
};

export default Login;
