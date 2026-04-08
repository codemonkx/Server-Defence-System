import React from "react";
import { Box, Container, Heading, Text, VStack, Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@chakra-ui/react";
import Footer from "./Footer";
import InProgressGrid from "../components/UserComponents/InProgressGrid";
import { ChevronRightIcon } from "@chakra-ui/icons";
import { Link as RouterLink } from "react-router-dom";

const MyCourses = () => {
    return (
        <Box minH="100vh" bg="var(--rc-bg)" color="var(--rc-fg)">
            <Box h={{ base: "80px", md: "110px" }} />

            <Container maxW="container.xl" py={{ base: 6, md: 12 }} px={{ base: 4, md: 6 }}>
                <VStack spacing={8} align="stretch">
                    <Box>
                        <Breadcrumb spacing="8px" separator={<ChevronRightIcon color="whiteAlpha.400" />}>
                            <BreadcrumbItem>
                                <BreadcrumbLink as={RouterLink} to="/home" color="whiteAlpha.500" _hover={{ color: "white" }}>
                                    Home
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbItem isCurrentPage>
                                <BreadcrumbLink color="var(--rc-accent)" fontWeight="700">
                                    Dashboard
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                        </Breadcrumb>

                        <Heading as="h1" size="2xl" fontWeight="900" mt={4} letterSpacing="-1px">
                            My Learning Journey
                        </Heading>
                        <Text color="whiteAlpha.600" mt={2} fontSize="lg" fontWeight="500">
                            Pick up right where you left off.
                        </Text>
                    </Box>

                    <Box mt={4}>
                        <InProgressGrid />
                    </Box>
                </VStack>
            </Container>

            <Footer />
        </Box>
    );
};

export default MyCourses;
