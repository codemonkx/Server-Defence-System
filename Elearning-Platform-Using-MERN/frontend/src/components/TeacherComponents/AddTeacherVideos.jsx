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
import TeacherNavTop from "./TeacherNavTop";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { addVideo } from "../../Redux/TeacherReducer/action";


const AddTeacherVideos = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { id, title } = location.state || { id: "", title: "" };

  let obj = {
    title: title,
    description: "",
    link: "",
    views: "",
    img: "",
    courseId: id,
  };

  const [detail, setDetail] = useState(obj);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDetail((prev) => {
      return { ...prev, [name]: value };
    });
  };
  const handleSubmit = () => {
    dispatch(addVideo(detail, detail.courseId));
    alert("Video Added Successfully");
    navigate("/Teacher/add");
  };

  return (
    <Box minH="100vh" bg="var(--rc-bg)" color="var(--rc-fg)">
      <Grid w="100%">
        <Box pt="100px" px={8} pb={10} maxW="container.md" mx="auto">
          <TeacherNavTop />

          <Box mt={12}>
            <VStack align="start" spacing={1} mb={10}>
              <Heading size="xl" fontWeight="900" letterSpacing="-1.5px">Publish Lesson</Heading>
              <Text color="whiteAlpha.500" fontWeight="600">Upload a new tutorial video to "{title || 'the course'}"</Text>
            </VStack>

            <Box className="rc-glass" p={10} borderRadius="32px">
              <VStack spacing={6} align="stretch">
                <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={6}>
                  <FormControl>
                    <FormLabel fontSize="sm" fontWeight="800" color="whiteAlpha.400" mb={3}>VIDEO TITLE</FormLabel>
                    <Input
                      placeholder="e.g. Master React State"
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
                    <FormLabel fontSize="sm" fontWeight="800" color="whiteAlpha.400" mb={3}>COURSE ID</FormLabel>
                    <Input
                      placeholder="Course Unique Identifier"
                      name="courseId"
                      value={detail.courseId}
                      onChange={handleChange}
                      bg="blackAlpha.300"
                      border="1px solid"
                      borderColor="whiteAlpha.100"
                      borderRadius="14px"
                      h="56px"
                      isDisabled
                      _focus={{ borderColor: "var(--rc-accent)", bg: "blackAlpha.500" }}
                    />
                  </FormControl>
                </Grid>

                <FormControl>
                  <FormLabel fontSize="sm" fontWeight="800" color="whiteAlpha.400" mb={3}>DESCRIPTION</FormLabel>
                  <Textarea
                    placeholder="Provide a brief summary of this lesson..."
                    name="description"
                    value={detail.description}
                    onChange={handleChange}
                    bg="blackAlpha.300"
                    border="1px solid"
                    borderColor="whiteAlpha.100"
                    borderRadius="14px"
                    minH="120px"
                    py={4}
                    _focus={{ borderColor: "var(--rc-accent)", bg: "blackAlpha.500" }}
                  />
                </FormControl>

                <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={6}>
                  <FormControl>
                    <FormLabel fontSize="sm" fontWeight="800" color="whiteAlpha.400" mb={3}>VIDEO URL</FormLabel>
                    <Input
                      placeholder="YouTube/Vimeo Link"
                      name="link"
                      value={detail.link}
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
                    <FormLabel fontSize="sm" fontWeight="800" color="whiteAlpha.400" mb={3}>VIEWS</FormLabel>
                    <Input
                      type="number"
                      placeholder="Initial count"
                      name="views"
                      value={detail.views}
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
                  <FormLabel fontSize="sm" fontWeight="800" color="whiteAlpha.400" mb={3}>VIDEO THUMBNAIL</FormLabel>
                  <Input
                    placeholder="https://..."
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
                  Publish Video
                </Button>

                <Button
                  variant="ghost"
                  color="whiteAlpha.400"
                  onClick={() => navigate("/Teacher/add")}
                  _hover={{ bg: "transparent", color: "white" }}
                >
                  Cancel
                </Button>
              </VStack>
            </Box>
          </Box>
        </Box>
      </Grid>
    </Box>
  );
};


export default AddTeacherVideos;
