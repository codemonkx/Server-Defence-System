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
import { patchProduct } from "../../Redux/AdminReducer/action";

const EditPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const store = useSelector((store) => store.AdminReducer.data);
  const existedUser = store?.filter((el) => el._id == id) || [];
  const navigate = useNavigate();

  let obj = {
    title: existedUser[0]?.title || "",
    description: existedUser[0]?.description || "",
    category: existedUser[0]?.category || "",
    price: existedUser[0]?.price || "",
    teacher: existedUser[0]?.teacher || "",
    img: existedUser[0]?.img || "",
  };

  const [detail, setDetail] = useState(obj);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDetail((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const handleSubmit = () => {
    dispatch(patchProduct(id, detail));
    alert("Data Updated Successfully");
    navigate("/admin/courses");
  };

  return (
    <Box minH="100vh" bg="var(--rc-bg)" color="var(--rc-fg)">
      <Grid w="100%">
        <Box pt="100px" px={8} pb={10} maxW="container.md" mx="auto">
          <AdminNavTop />

          <Box mt={12}>
            <VStack align="start" spacing={1} mb={10}>
              <Heading size="xl" fontWeight="900" letterSpacing="-1.5px">Edit Course</Heading>
              <Text color="whiteAlpha.500" fontWeight="600">Update the information for this learning module</Text>
            </VStack>

            <Box className="rc-glass" p={10} borderRadius="32px">
              <VStack spacing={6} align="stretch">
                <FormControl>
                  <FormLabel fontSize="sm" fontWeight="800" color="whiteAlpha.400" mb={3}>COURSE TITLE</FormLabel>
                  <Input
                    placeholder="Enter Course Title"
                    name="title"
                    value={detail?.title}
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
                  <FormLabel fontSize="sm" fontWeight="800" color="whiteAlpha.400" mb={3}>DESCRIPTION</FormLabel>
                  <Textarea
                    placeholder="Enter Course description"
                    name="description"
                    value={detail?.description}
                    onChange={handleChange}
                    bg="blackAlpha.300"
                    border="1px solid"
                    borderColor="whiteAlpha.100"
                    borderRadius="14px"
                    minH="150px"
                    py={4}
                    _focus={{ borderColor: "var(--rc-accent)", bg: "blackAlpha.500" }}
                  />
                </FormControl>

                <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={6}>
                  <FormControl>
                    <FormLabel fontSize="sm" fontWeight="800" color="whiteAlpha.400" mb={3}>CATEGORY</FormLabel>
                    <Input
                      placeholder="Enter Course Category"
                      name="category"
                      value={detail?.category}
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
                    <FormLabel fontSize="sm" fontWeight="800" color="whiteAlpha.400" mb={3}>PRICE (₹)</FormLabel>
                    <Input
                      type="number"
                      placeholder="Enter Course price"
                      name="price"
                      value={detail?.price}
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
                  <FormLabel fontSize="sm" fontWeight="800" color="whiteAlpha.400" mb={3}>INSTRUCTOR</FormLabel>
                  <Input
                    placeholder="Enter Instructor Name"
                    name="teacher"
                    value={detail?.teacher}
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
                  <FormLabel fontSize="sm" fontWeight="800" color="whiteAlpha.400" mb={3}>IMAGE URL</FormLabel>
                  <Input
                    name="img"
                    value={detail?.img}
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
                  Update Course
                </Button>

                <Button
                  variant="ghost"
                  color="whiteAlpha.400"
                  onClick={() => navigate("/admin/courses")}
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

export default EditPage;
