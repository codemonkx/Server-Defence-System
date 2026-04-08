import React from "react";
import {
  Box,
  Button,
  Flex,
  Heading,
  Image,
  Stack,
  Text,
  useDisclosure,
  VStack,
  Grid,
  Center,
  Container
} from "@chakra-ui/react";

import { FaAngleRight } from "react-icons/fa";
// import theme from './Font';
import SingleAbsolute from "./SingleAbsolute";
import SingleList from "./SingleList";
import { useParams } from "react-router-dom";
// import axios from "axios";
import { useState, useEffect } from "react";
import Payment from "../../Pages/Payment/Payment";
import convertDateFormat from "../../Redux/AdminReducer/action";
import { capitalizeFirstLetter } from "../../Redux/UserReducer/action";
import { AiOutlineLock } from "react-icons/ai";
import Footer from "../../Pages/Footer";
import { useSelector } from "react-redux";
import { API_BASE_URL } from "../../config";

export default function SinglePage() {
  const [res, setRes] = useState({});
  const { id } = useParams();
  const userStore = useSelector((store) => store.UserReducer);

  const { isOpen, onOpen, onClose } = useDisclosure();

  let vdo_url = `${API_BASE_URL}/videos/courseVideos/${id}`;

  const getSinglePageData = (id) => {
    const token = userStore?.token;

    fetch(vdo_url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        setRes(res);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getSinglePageData(id);
  }, [id]);

  const handleClickPrevent = (event) => {
    event.preventDefault();
  };

  return (
    <Box minH="100vh" bg="var(--rc-bg)" color="var(--rc-fg)">

      {/* Hero Section */}
      <Box
        pt="120px"
        pb="60px"
        bgGradient="linear(to-b, blackAlpha.500, transparent)"
        borderBottom="1px solid"
        borderColor="whiteAlpha.100"
      >
        <Container maxW="container.xl">
          <Flex direction={{ base: "column", xl: "row" }} gap={12} align="start">
            <VStack align="start" spacing={6} flex="1">
              <Box>
                <Heading size="2xl" fontWeight="900" letterSpacing="-2px" mb={4}>
                  {res?.course?.title || "Course Name"}
                </Heading>
                <Text fontSize="lg" color="whiteAlpha.700" fontWeight="500" maxW="800px">
                  {res?.course?.description}
                </Text>
              </Box>

              <Flex gap={6} align="center" flexWrap="wrap">
                <Flex align="center" gap={2}>
                  <Text color="yellow.400" fontWeight="800">4.8</Text>
                  <Text>⭐⭐⭐⭐</Text>
                  <Text color="whiteAlpha.500" fontSize="sm">(12,866 ratings)</Text>
                </Flex>
                <Box h="20px" w="1px" bg="whiteAlpha.200" />
                <Text fontWeight="600" color="whiteAlpha.700">69,107 students</Text>
              </Flex>

              <Flex gap={4} align="center" fontSize="sm" color="whiteAlpha.600">
                <Flex align="center" gap={2}>
                  <Text fontWeight="700">CREATED BY</Text>
                  <Text color="var(--rc-accent)" fontWeight="800">{res?.course?.teacher}</Text>
                </Flex>
                <Box h="4px" w="4px" borderRadius="full" bg="whiteAlpha.400" />
                <Text>Last updated 5/2023</Text>
                <Box h="4px" w="4px" borderRadius="full" bg="whiteAlpha.400" />
                <Text>🌐 English</Text>
              </Flex>
            </VStack>

            <Box w={{ base: "100%", xl: "380px" }} mt={{ base: 8, xl: 0 }}>
              <SingleAbsolute props={{ ...res?.course, onOpen, onClose }} />
            </Box>
          </Flex>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxW="container.xl" py={12}>
        <Flex direction={{ base: "column", lg: "row" }} gap={12}>
          <Box flex="1">
            <VStack align="stretch" spacing={12}>
              <Box className="rc-glass" p={8} borderRadius="32px">
                <Heading size="lg" fontWeight="800" mb={6} letterSpacing="-1px">
                  Course Content
                </Heading>
                <SingleList />
              </Box>

              <Box>
                <Heading size="lg" fontWeight="800" mb={8} letterSpacing="-1px">
                  Curriculum Statistics
                </Heading>
                <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={6}>
                  <Box className="rc-glass" p={6} borderRadius="24px">
                    <Text fontSize="xs" fontWeight="700" color="whiteAlpha.400" mb={2}>TEACHER</Text>
                    <Text fontWeight="800" fontSize="lg">{res?.course?.teacher || "N/A"}</Text>
                  </Box>
                  <Box className="rc-glass" p={6} borderRadius="24px">
                    <Text fontSize="xs" fontWeight="700" color="whiteAlpha.400" mb={2}>CREATED AT</Text>
                    <Text fontWeight="800" fontSize="lg">{convertDateFormat(res?.course?.createdAt)}</Text>
                  </Box>
                  <Box className="rc-glass" p={6} borderRadius="24px">
                    <Text fontSize="xs" fontWeight="700" color="whiteAlpha.400" mb={2}>TOTAL VIDEOS</Text>
                    <Text fontWeight="800" fontSize="lg">{res?.course?.videos?.length || 0}</Text>
                  </Box>
                </Grid>
              </Box>

              <Box>
                <Heading size="lg" fontWeight="800" mb={6} letterSpacing="-1px">
                  Lessons
                </Heading>
                {res?.course?.videos?.length ? (
                  <VStack spacing={4} align="stretch">
                    {res?.course?.videos?.map((video, index) => (
                      <Box
                        key={index}
                        className="rc-glass"
                        p={4}
                        borderRadius="24px"
                        transition="all 0.2s"
                        _hover={{ transform: "translateX(8px)", borderColor: "whiteAlpha.300" }}
                      >
                        <Flex gap={{ base: 4, md: 6 }} align="center" direction={{ base: "column", sm: "row" }}>
                          <Box position="relative" w={{ base: "100%", sm: "180px" }} borderRadius="16px" overflow="hidden" flexShrink={0}>
                            <Image src={video?.img || ''} alt={video?.title} w="100%" h={{ base: "160px", sm: "auto" }} objectFit="cover" />
                            <Center position="absolute" inset={0} bg="blackAlpha.600">
                              <AiOutlineLock color="#FF6363" size="32px" />
                            </Center>
                          </Box>
                          <VStack align="start" spacing={1}>
                            <Heading size="sm" fontWeight="800">{video?.title}</Heading>
                            <Text fontSize="sm" color="whiteAlpha.600" noOfLines={2}>
                              {video.description}
                            </Text>
                            <Flex gap={4} mt={2} fontSize="xs" fontWeight="700" color="whiteAlpha.400">
                              <Text>{video?.views || 0} VIEWS</Text>
                              <Text>{convertDateFormat(video?.createdAt).toUpperCase()}</Text>
                            </Flex>
                          </VStack>
                        </Flex>
                      </Box>
                    ))}
                  </VStack>
                ) : (
                  <Box className="rc-glass" p={10} borderRadius="32px" textAlign="center">
                    <Text fontSize="lg" fontWeight="700" color="whiteAlpha.500">
                      We are currently preparing the content for this course. Check back soon!
                    </Text>
                  </Box>
                )}
              </Box>
            </VStack>
          </Box>

          <Box w={{ base: "100%", lg: "300px" }} display={{ base: "none", xl: "block" }}>
            {/* Sidebar content if any */}
          </Box>
        </Flex>
      </Container>

      <Payment isOpen={isOpen} onOpen={onOpen} onClose={onClose} />
      <Footer />
    </Box>
  );
}
