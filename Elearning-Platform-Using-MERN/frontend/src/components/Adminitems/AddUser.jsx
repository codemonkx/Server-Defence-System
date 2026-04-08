import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Grid,
  Input,
  Text,
  Textarea,
  VStack,
  Heading,
} from "@chakra-ui/react";
import React, { useState } from "react";

import AdminNavTop from "../AdminNavTop";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../../Redux/AdminReducer/action";
import { useNavigate } from "react-router-dom";

const AddUser = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  let obj = {
    name: "",
    email: "",
    password: "",
    city: "",
    age: "",
    job: "",
    image: "",
  };

  const [detail, setDetail] = useState(obj);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDetail((prev) => {
      return { ...prev, [name]: value };
    });
  };
  const handleSubmit = () => {
    dispatch(addUser(detail));
    alert("User Added Successfully");
    navigate("/admin/users");
  };

  return (
    <Box minH="100vh" bg="var(--rc-bg)" color="var(--rc-fg)">
      <Grid w="100%">
        <Box pt="100px" px={8} pb={10} maxW="container.md" mx="auto">
          <AdminNavTop />

          <Box mt={12}>
            <VStack align="start" spacing={1} mb={10}>
              <Heading size="xl" fontWeight="900" letterSpacing="-1.5px">Add New User</Heading>
              <Text color="whiteAlpha.500" fontWeight="600">Enter member details to create a new platform account</Text>
            </VStack>

            <Box className="rc-glass" p={10} borderRadius="32px">
              <VStack spacing={6} align="stretch">
                <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={6}>
                  <FormControl>
                    <FormLabel fontSize="sm" fontWeight="800" color="whiteAlpha.400" mb={3}>FULL NAME</FormLabel>
                    <Input
                      placeholder="e.g. John Doe"
                      name="name"
                      value={detail.name}
                      onChange={handleChange}
                      bg="blackAlpha.300"
                      border="1px solid"
                      borderColor="whiteAlpha.100"
                      borderRadius="14px"
                      h="56px"
                      _focus={{ borderColor: "var(--rc-accent)", bg: "blackAlpha.500" }}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel fontSize="sm" fontWeight="800" color="whiteAlpha.400" mb={3}>EMAIL ADDRESS</FormLabel>
                    <Input
                      type="email"
                      placeholder="john@example.com"
                      name="email"
                      value={detail.email}
                      onChange={handleChange}
                      bg="blackAlpha.300"
                      border="1px solid"
                      borderColor="whiteAlpha.100"
                      borderRadius="14px"
                      h="56px"
                      _focus={{ borderColor: "var(--rc-accent)", bg: "blackAlpha.500" }}
                    />
                  </FormControl>
                </Grid>

                <FormControl>
                  <FormLabel fontSize="sm" fontWeight="800" color="whiteAlpha.400" mb={3}>PASSWORD</FormLabel>
                  <Input
                    type="password"
                    placeholder="Create a strong password"
                    name="password"
                    value={detail.password}
                    onChange={handleChange}
                    bg="blackAlpha.300"
                    border="1px solid"
                    borderColor="whiteAlpha.100"
                    borderRadius="14px"
                    h="56px"
                    _focus={{ borderColor: "var(--rc-accent)", bg: "blackAlpha.500" }}
                  />
                </FormControl>

                <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={6}>
                  <FormControl>
                    <FormLabel fontSize="sm" fontWeight="800" color="whiteAlpha.400" mb={3}>CITY</FormLabel>
                    <Input
                      placeholder="City"
                      name="city"
                      value={detail.city}
                      onChange={handleChange}
                      bg="blackAlpha.300"
                      border="1px solid"
                      borderColor="whiteAlpha.100"
                      borderRadius="14px"
                      h="56px"
                      _focus={{ borderColor: "var(--rc-accent)", bg: "blackAlpha.500" }}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel fontSize="sm" fontWeight="800" color="whiteAlpha.400" mb={3}>AGE</FormLabel>
                    <Input
                      type="number"
                      placeholder="Age"
                      name="age"
                      value={detail.age}
                      onChange={handleChange}
                      bg="blackAlpha.300"
                      border="1px solid"
                      borderColor="whiteAlpha.100"
                      borderRadius="14px"
                      h="56px"
                      _focus={{ borderColor: "var(--rc-accent)", bg: "blackAlpha.500" }}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel fontSize="sm" fontWeight="800" color="whiteAlpha.400" mb={3}>JOB TITLE</FormLabel>
                    <Input
                      placeholder="e.g. Designer"
                      name="job"
                      value={detail.job}
                      onChange={handleChange}
                      bg="blackAlpha.300"
                      border="1px solid"
                      borderColor="whiteAlpha.100"
                      borderRadius="14px"
                      h="56px"
                      _focus={{ borderColor: "var(--rc-accent)", bg: "blackAlpha.500" }}
                    />
                  </FormControl>
                </Grid>

                <FormControl>
                  <FormLabel fontSize="sm" fontWeight="800" color="whiteAlpha.400" mb={3}>AVATAR URL</FormLabel>
                  <Input
                    placeholder="https://ui-avatars.com/..."
                    name="image"
                    value={detail.image}
                    onChange={handleChange}
                    bg="blackAlpha.300"
                    border="1px solid"
                    borderColor="whiteAlpha.100"
                    borderRadius="14px"
                    h="56px"
                    _focus={{ borderColor: "var(--rc-accent)", bg: "blackAlpha.500" }}
                  />
                </FormControl>

                <Button
                  onClick={handleSubmit}
                  bg="white"
                  color="black"
                  h="60px"
                  borderRadius="18px"
                  fontWeight="900"
                  fontSize="lg"
                  mt={4}
                  _hover={{ bg: "whiteAlpha.900", transform: "translateY(-2px)" }}
                  _active={{ transform: "translateY(0)" }}
                  boxShadow="0 10px 20px rgba(255,255,255,0.1)"
                >
                  Create User Account
                </Button>

                <Button
                  variant="ghost"
                  color="whiteAlpha.400"
                  onClick={() => navigate("/admin/users")}
                  _hover={{ bg: "transparent", color: "white" }}
                >
                  Cancel and Go Back
                </Button>
              </VStack>
            </Box>
          </Box>
        </Box>
      </Grid>
    </Box>
  );
};

export default AddUser;
