import React, { useState } from "react";
import {
  ChakraProvider,
  Box,
  Heading,
  VStack,
  HStack,
  FormControl,
  FormLabel,
  Input,
  Button,
  Avatar,
  Center,
  AbsoluteCenter,
  useToast,
  Container,
  Text,
  Flex
} from "@chakra-ui/react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { actionLoginSuccess } from "../Redux/UserReducer/actionType";
import { showToast } from "../components/SignUp";
import { useNavigate } from 'react-router-dom';

import { API_BASE_URL } from "../config";

const ProfilePage = () => {
  const userStore = useSelector((store) => store.UserReducer);
  const [name, setName] = useState(userStore?.name || "");
  const [email, setEmail] = useState(userStore?.email || "");
  const [password, setPassword] = useState("");
  const [age, setAge] = useState(userStore?.age || "");
  const [city, setCity] = useState(userStore?.place || "");
  const [job, setJob] = useState((userStore?.job !== "null" && userStore?.job) || "");

  const dispatch = useDispatch();
  const toast = useToast();
  const navigate = useNavigate();

  const handleSave = () => {
    const obj = { name, email, password, age, city, job };
    const id = userStore?.userId;

    axios
      .patch(`${API_BASE_URL}/users/update/${id}`, obj)
      .then((res) => {
        dispatch(actionLoginSuccess(res?.data));
        localStorage.setItem(
          "user",
          JSON.stringify({
            email: res.data.user.email,
            name: res.data.user.name,
            role: res.data.user.role,
            token: res.data.token,
            isAuth: true,
            userId: res.data.user._id,
            age: res.data.user.age,
            job: res.data.user.job,
            place: res.data.user.city,
          })
        );
        navigate(-1);
        showToast({ toast, message: 'Profile Updated', color: 'green' });
      })
      .catch((err) => {
        showToast({ toast, message: 'Error occur', color: 'red' });
        console.log(err)
      });
  };

  return (
    <Box minH="100vh" bg="var(--rc-bg)" color="var(--rc-fg)">
      <Container maxW="container.sm" pt="120px" pb="60px">
        <Box
          className="rc-glass"
          p={10}
          borderRadius="32px"
          boxShadow="0 20px 40px rgba(0,0,0,0.4)"
        >
          <VStack spacing={8} align="stretch">
            <Center flexDirection="column">
              <Avatar
                size="2xl"
                name={name}
                border="4px solid"
                borderColor="var(--rc-accent)"
                p={1}
                bg="whiteAlpha.100"
              />
              <Heading mt={6} size="lg" fontWeight="800" letterSpacing="-1px">
                Edit Profile
              </Heading>
              <Text color="whiteAlpha.500" fontWeight="500">
                Update your personal information
              </Text>
            </Center>

            <VStack spacing={4}>
              <FormControl>
                <FormLabel fontSize="xs" fontWeight="700" color="whiteAlpha.400" ml={1}>NAME</FormLabel>
                <Input
                  bg="whiteAlpha.50"
                  border="1px solid"
                  borderColor="whiteAlpha.100"
                  borderRadius="12px"
                  _hover={{ borderColor: "whiteAlpha.300" }}
                  _focus={{ borderColor: "var(--rc-accent)", bg: "whiteAlpha.100" }}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </FormControl>

              <FormControl>
                <FormLabel fontSize="xs" fontWeight="700" color="whiteAlpha.400" ml={1}>EMAIL</FormLabel>
                <Input
                  type="email"
                  bg="whiteAlpha.50"
                  border="1px solid"
                  borderColor="whiteAlpha.100"
                  borderRadius="12px"
                  _hover={{ borderColor: "whiteAlpha.300" }}
                  _focus={{ borderColor: "var(--rc-accent)", bg: "whiteAlpha.100" }}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </FormControl>

              <FormControl>
                <FormLabel fontSize="xs" fontWeight="700" color="whiteAlpha.400" ml={1}>PASSWORD</FormLabel>
                <Input
                  type="password"
                  placeholder="••••••••"
                  bg="whiteAlpha.50"
                  border="1px solid"
                  borderColor="whiteAlpha.100"
                  borderRadius="12px"
                  _hover={{ borderColor: "whiteAlpha.300" }}
                  _focus={{ borderColor: "var(--rc-accent)", bg: "whiteAlpha.100" }}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </FormControl>

              <Flex gap={4} w="100%">
                <FormControl>
                  <FormLabel fontSize="xs" fontWeight="700" color="whiteAlpha.400" ml={1}>AGE</FormLabel>
                  <Input
                    type="number"
                    bg="whiteAlpha.50"
                    border="1px solid"
                    borderColor="whiteAlpha.100"
                    borderRadius="12px"
                    _hover={{ borderColor: "whiteAlpha.300" }}
                    _focus={{ borderColor: "var(--rc-accent)", bg: "whiteAlpha.100" }}
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel fontSize="xs" fontWeight="700" color="whiteAlpha.400" ml={1}>CITY</FormLabel>
                  <Input
                    bg="whiteAlpha.50"
                    border="1px solid"
                    borderColor="whiteAlpha.100"
                    borderRadius="12px"
                    _hover={{ borderColor: "whiteAlpha.300" }}
                    _focus={{ borderColor: "var(--rc-accent)", bg: "whiteAlpha.100" }}
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </FormControl>
              </Flex>

              <FormControl>
                <FormLabel fontSize="xs" fontWeight="700" color="whiteAlpha.400" ml={1}>JOB</FormLabel>
                <Input
                  bg="whiteAlpha.50"
                  border="1px solid"
                  borderColor="whiteAlpha.100"
                  borderRadius="12px"
                  _hover={{ borderColor: "whiteAlpha.300" }}
                  _focus={{ borderColor: "var(--rc-accent)", bg: "whiteAlpha.100" }}
                  value={job}
                  onChange={(e) => setJob(e.target.value)}
                />
              </FormControl>
            </VStack>

            <Button
              mt={4}
              h="56px"
              bg="white"
              color="black"
              borderRadius="16px"
              fontWeight="700"
              _hover={{ bg: "whiteAlpha.900", transform: "translateY(-1px)" }}
              _active={{ transform: "translateY(0)" }}
              isDisabled={!name || !email || !age || !city || !job}
              onClick={handleSave}
            >
              Save Changes
            </Button>
          </VStack>
        </Box>
      </Container>
    </Box>
  );
};

export default ProfilePage;
