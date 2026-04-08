import React, { useState, useEffect } from "react";
import { Flex, Box, Text, Heading, Container } from "@chakra-ui/react";
import Slider from "react-slick";
import LoadingComponent from "../LoadingComponents/LoadingComponent";
import Card from "./Card";
import { API_BASE_URL } from "../../config";

const LandingPageCarousel = ({ isDashboard = false, category = "" }) => {
  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState([]);
  const arr = [1, 2, 3, 4];

  var settings = {
    swipe: true,
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: isDashboard ? 4 : 3,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: isDashboard ? 3 : 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  useEffect(() => {
    const url = `${API_BASE_URL}/courses/all`;
    setLoading(true);
    setCourse([]); // Clear previous data

    fetch(url)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Error: " + response.status);
        }
      })
      .then((data) => {
        let courses = data?.course || data || [];
        if (!Array.isArray(courses)) courses = [];

        // Filter by category if provided
        let filteredCourses = courses;
        if (category && category !== "All") {
          filteredCourses = courses.filter(c =>
            c.category?.toLowerCase() === category.toLowerCase() ||
            (category.toLowerCase() === "tech" && (c.category?.toLowerCase() === "tech" || c.category?.toLowerCase() === "devops"))
          );
        }

        // If no matching courses or very few, shuffle original list as fallback
        if (filteredCourses.length < 2) {
          setCourse(shuffleArray(courses));
        } else {
          setCourse(filteredCourses);
        }

        setLoading(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        setLoading(false);
      });
  }, [category]);

  const Content = (
    <Flex direction="column" gap={6}>
      <Box mb={isDashboard ? 0 : 4}>
        <Text
          fontSize="xs"
          fontWeight="800"
          color="var(--rc-accent)"
          letterSpacing="2px"
          mb={2}
        >
          EXPLORE
        </Text>
        <Heading color="white" fontSize={{ base: "xl", md: "2xl" }}>
          {category && category !== "All" ? `${category} Courses` : "Trending Courses"}
        </Heading>
      </Box>
      <Box className="rc-carousel-container">
        {loading ? (
          <Slider {...settings}>
            {arr.map((el, i) => <LoadingComponent key={i} />)}
          </Slider>
        ) : course.length === 0 ? (
          <Flex direction="column" align="center" py={10} className="rc-glass" borderRadius="24px">
            <Text color="whiteAlpha.600" fontWeight="600">No courses available at the moment.</Text>
            <Text color="whiteAlpha.400" fontSize="sm">Please ensure the server is running and the database is connected.</Text>
          </Flex>
        ) : (
          <Slider {...settings}>
            {course.map((el) => <Card {...el} key={el._id} />)}
          </Slider>
        )}
      </Box>
    </Flex>
  );

  return (
    <Box py={isDashboard ? 0 : 20} id={isDashboard ? "" : "trending-courses"} w="100%">
      {isDashboard ? (
        Content
      ) : (
        <Container maxW="container.lg">
          {Content}
        </Container>
      )}
    </Box>
  );
};

export default LandingPageCarousel;
