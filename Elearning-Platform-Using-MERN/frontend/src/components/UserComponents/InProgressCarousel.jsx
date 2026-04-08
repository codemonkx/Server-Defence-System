import React, { useEffect, useState } from "react";
import { Box, Flex, Heading, Image, Text, SimpleGrid } from "@chakra-ui/react";
import Card from "../../Pages/LandingPageComponents/Card";
import { API_BASE_URL } from "../../config";
import LoadingComponent from "../../Pages/LoadingComponents/LoadingComponent";
import axios from "axios";

const InProgressCarousel = () => {
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState([]);
  const user = JSON.parse(localStorage.getItem("user")) || {};

  useEffect(() => {
    if (!user || !user.userId) {
      setLoading(false);
      return;
    }

    const url = `${API_BASE_URL}/users/userCourse/${user.userId}`;

    axios
      .get(url)
      .then((res) => {
        setLoading(false);
        setCourses(res.data.course || []);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  return (
    <Box width="100%">
      {courses?.length !== 0 ? (
        <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={6}>
          {!loading ? courses.map((el) => <Card {...el} key={el._id} />) : ""}
        </SimpleGrid>
      ) : (
        <Box
          display="flex"
          alignItems="center"
          flexDir="column"
          className="rc-glass"
          p={12}
          borderRadius="32px"
          textAlign="center"
        >
          <Box w={{ base: "100%", md: "50%", lg: "30%" }} mb={6}>
            <Image
              display="block"
              src="https://cdn.dribbble.com/users/1693462/screenshots/3504905/media/6d5a0df598037bf7a872f1f8aef118b8.gif"
              alt="Empty"
              borderRadius="20px"
              opacity={0.8}
            />
          </Box>
          <Text fontWeight="800" fontSize="xl" color="whiteAlpha.900" letterSpacing="-0.5px">
            You haven't subscribed to any courses yet
          </Text>
          <Text color="whiteAlpha.500" mt={2} fontWeight="500">
            Explore our Trending Courses to start learning today!
          </Text>
        </Box>
      )}
    </Box>
  );
};

export default InProgressCarousel;
