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
  Heading
} from "@chakra-ui/react";
import React, { useState } from "react";

import TeacherNavTop from "./TeacherNavTop";
import { useDispatch, useSelector } from "react-redux";
import { addProduct } from "../../Redux/TeacherReducer/action";
import { useNavigate } from "react-router-dom";

const AddTeacherCourse = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  let obj = {
    title: "",
    description: "",
    category: "",
    price: "",
    img: ""
  };

  const [detail, setDetail] = useState(obj);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDetail((prev) => {
      return { ...prev, [name]: value };
    });
  };
  const handleSubmit = () => {
    dispatch(addProduct(detail));
    alert("Course Added Successfully");
    navigate("/Teacher/courses");
  };

  return (
    <Box minH="100vh" bg="var(--rc-bg)" color="var(--rc-fg)">
      <Grid w="100%">
        <Box pt="100px" px={8} pb={10} maxW="container.md" mx="auto">
          <TeacherNavTop />

          <Box mt={12}>
            <VStack align="start" spacing={1} mb={10}>
              <Heading size="xl" fontWeight="900" letterSpacing="-1.5px">Create New Course</Heading>
              <Text color="whiteAlpha.500" fontWeight="600">Design and launch a new learning experience</Text>
            </VStack>

            <Box className="rc-glass" p={10} borderRadius="32px">
              <VStack spacing={6} align="stretch">
                <FormControl>
                  <FormLabel fontSize="sm" fontWeight="800" color="whiteAlpha.400" mb={3}>COURSE TITLE</FormLabel>
                  <Input
                    placeholder="e.g. Advanced Machine Learning"
                    name="title"
                    value={detail.title}
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
                    placeholder="Detailed overview of the course curriculum..."
                    name="description"
                    value={detail.description}
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
                      placeholder="e.g. Computer Science"
                      name="category"
                      value={detail.category}
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
                    <FormLabel fontSize="sm" fontWeight="800" color="whiteAlpha.400" mb={3}>PRICE (USD)</FormLabel>
                    <Input
                      type="number"
                      placeholder="99"
                      name="price"
                      value={detail.price}
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
                  <FormLabel fontSize="sm" fontWeight="800" color="whiteAlpha.400" mb={3}>THUMBNAIL IMAGE URL</FormLabel>
                  <Input
                    placeholder="https://images.unsplash.com/..."
                    name="img"
                    value={detail.img}
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
                  Confirm and Create
                </Button>

                <Button
                  variant="ghost"
                  color="whiteAlpha.400"
                  onClick={() => navigate("/Teacher/courses")}
                  _hover={{ bg: "transparent", color: "white" }}
                >
                  Discard Draft
                </Button>
              </VStack>
            </Box>
          </Box>
        </Box>
      </Grid>
    </Box>
  );
};

export default AddTeacherCourse;
