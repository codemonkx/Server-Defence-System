import React, { useEffect, useState } from "react";
import { Box, SimpleGrid, Text, Image, Container, VStack, Heading } from "@chakra-ui/react";
import Card from "../../Pages/LandingPageComponents/Card";
import LoadingComponent from "../../Pages/LoadingComponents/LoadingComponent";
import { API_BASE_URL } from "../../config";
import axios from "axios";

const InProgressGrid = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
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
                console.log("Error fetching subscribed courses:", err);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
                {[1, 2, 3].map((i) => <LoadingComponent key={i} />)}
            </SimpleGrid>
        );
    }

    if (courses.length === 0) {
        return (
            <Box
                display="flex"
                alignItems="center"
                flexDir="column"
                className="rc-glass"
                p={12}
                borderRadius="32px"
                textAlign="center"
                w="100%"
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
        );
    }

    return (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 4 }} spacing={{ base: 4, md: 6 }}>
            {courses.map((course) => (
                <Card {...course} key={course._id} />
            ))}
        </SimpleGrid>
    );
};

export default InProgressGrid;
