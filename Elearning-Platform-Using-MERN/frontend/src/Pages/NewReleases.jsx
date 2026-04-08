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
} from "@chakra-ui/react";
import Card from "./LandingPageComponents/Card";
import LoadingComponent from "./LoadingComponents/LoadingComponent";
import { API_BASE_URL } from "../config";

const NewReleases = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const url = `${API_BASE_URL}/courses/all`;
        fetch(url)
            .then((res) => res.json())
            .then((data) => {
                const sorted = (data?.course || data || []).sort(
                    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                );
                setCourses(sorted);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    return (
        <Box pt="100px" pb={20}>
            <Container maxW="container.xl">
                <Breadcrumb color="whiteAlpha.600" mb={6} fontSize="sm">
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/">Home</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbItem isCurrentPage color="white">
                        <BreadcrumbLink href="#">New Releases</BreadcrumbLink>
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
                        CATALOG
                    </Text>
                    <Heading color="white" fontSize={{ base: "3xl", md: "5xl" }} mb={4}>
                        Newest Additions
                    </Heading>
                    <Text color="whiteAlpha.600" fontSize="lg" maxW="2xl">
                        Explore the latest courses added to our platform. Stay ahead with the freshest content from industry experts.
                    </Text>
                </Box>

                {loading ? (
                    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={8}>
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <LoadingComponent key={i} />
                        ))}
                    </SimpleGrid>
                ) : (
                    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={8}>
                        {courses.map((course) => (
                            <Card key={course._id} {...course} />
                        ))}
                    </SimpleGrid>
                )}
            </Container>
        </Box>
    );
};

export default NewReleases;
