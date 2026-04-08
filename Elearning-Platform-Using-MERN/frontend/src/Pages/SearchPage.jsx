import React, { useEffect, useState } from "react";
import {
    Box,
    Container,
    Heading,
    Text,
    SimpleGrid,
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    Flex,
    VStack,
} from "@chakra-ui/react";
import { useLocation } from "react-router-dom";
import Card from "./LandingPageComponents/Card";
import LoadingComponent from "./LoadingComponents/LoadingComponent";
import Footer from "./Footer";
import { API_BASE_URL } from "../config";

const SearchPage = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const query = new URLSearchParams(location.search).get("q") || "";

    useEffect(() => {
        const fetchSearchResults = async () => {
            setLoading(true);
            try {
                // The backend supports regex search via 'q' parameter in /courses
                const url = `${API_BASE_URL}/courses?q=${encodeURIComponent(query)}`;
                const res = await fetch(url);
                const data = await res.json();
                setCourses(data?.course || data || []);
            } catch (err) {
                console.error("Search error:", err);
            } finally {
                setLoading(false);
            }
        };

        if (query) {
            fetchSearchResults();
        } else {
            setLoading(false);
        }
    }, [query]);

    return (
        <Box minH="100vh" bg="var(--rc-bg)" color="var(--rc-fg)">
            <Box pt="120px" pb={20}>
                <Container maxW="container.xl">
                    <Breadcrumb color="whiteAlpha.600" mb={6} fontSize="sm">
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/">Home</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbItem isCurrentPage color="white">
                            <BreadcrumbLink href="#">Search Results</BreadcrumbLink>
                        </BreadcrumbItem>
                    </Breadcrumb>

                    <Box mb={12}>
                        <Text
                            fontSize="xs"
                            fontWeight="800"
                            color="var(--rc-accent)"
                            letterSpacing="2px"
                            mb={2}
                        >
                            SEARCH RESULTS
                        </Text>
                        <Heading color="white" fontSize={{ base: "3xl", md: "5xl" }} mb={4}>
                            {query ? `Results for "${query}"` : "Search Our Courses"}
                        </Heading>
                        <Text color="whiteAlpha.600" fontSize="lg" maxW="2xl">
                            {courses.length > 0
                                ? `Found ${courses.length} courses matching your search.`
                                : loading ? "Searching..." : "No courses found matching your criteria."}
                        </Text>
                    </Box>

                    {loading ? (
                        <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 4 }} gap={8}>
                            {[1, 2, 3, 4].map((i) => (
                                <LoadingComponent key={i} />
                            ))}
                        </SimpleGrid>
                    ) : courses.length > 0 ? (
                        <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 4 }} gap={8}>
                            {courses.map((course) => (
                                <Card key={course._id} {...course} />
                            ))}
                        </SimpleGrid>
                    ) : (
                        <VStack py={20} spacing={4}>
                            <Box className="rc-glass" p={10} borderRadius="32px" textAlign="center">
                                <Heading size="md" color="white" mb={2}>No Results Found</Heading>
                                <Text color="whiteAlpha.500">Try searching with different keywords like "React", "Python", or "Docker".</Text>
                            </Box>
                        </VStack>
                    )}
                </Container>
            </Box>
            <Footer />
        </Box>
    );
};

export default SearchPage;
