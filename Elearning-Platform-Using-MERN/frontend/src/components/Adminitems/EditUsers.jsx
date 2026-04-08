import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  Input,
  Textarea,
  VStack,
  Heading,
  Text,
} from "@chakra-ui/react";
import React, { useState } from "react";
import "./edit.css";
import AdminNavTop from "../AdminNavTop";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { patchProduct, patchUser } from "../../Redux/AdminReducer/action";

const EditUser = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const store = useSelector((store) => store.AdminReducer.users);
  const existedUser = store?.filter((el) => el._id == id) || [];
  const navigate = useNavigate();

  let obj = {
    name: existedUser[0]?.name || "",
    email: existedUser[0]?.email || "",
    password: existedUser[0]?.password || "",
    city: existedUser[0]?.city || "",
    age: existedUser[0]?.age || "",
  };
  const [detail, setDetail] = useState(obj);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDetail((prev) => {
      return { ...prev, [name]: value };
    });
  };
  const handleSubmit = () => {
    dispatch(patchUser(id, detail));
    alert("Data Updated Successfully");
    navigate("/admin/users");
  };

  return (
    <Box minH="100vh" bg="var(--rc-bg)" color="var(--rc-fg)">
      <Grid w="100%">
        <Box pt="100px" px={8} pb={10} maxW="container.md" mx="auto">
          <AdminNavTop />

          <Box mt={12}>
            <VStack align="start" spacing={1} mb={10}>
              <Heading size="xl" fontWeight="900" letterSpacing="-1.5px">Edit User</Heading>
              <Text color="whiteAlpha.500" fontWeight="600">Update account information for this platform member</Text>
            </VStack>

            <Box className="rc-glass" p={10} borderRadius="32px">
              <VStack spacing={6} align="stretch">
                <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={6}>
                  <FormControl>
                    <FormLabel fontSize="sm" fontWeight="800" color="whiteAlpha.400" mb={3}>FULL NAME</FormLabel>
                    <Input
                      placeholder="Enter Full Name"
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
                      placeholder="Enter Email"
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
                    placeholder="Enter Password"
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

                <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={6}>
                  <FormControl>
                    <FormLabel fontSize="sm" fontWeight="800" color="whiteAlpha.400" mb={3}>CITY</FormLabel>
                    <Input
                      placeholder="Enter City"
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
                      placeholder="Enter Age"
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
                </Grid>

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
                  Save Changes
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

export default EditUser;
