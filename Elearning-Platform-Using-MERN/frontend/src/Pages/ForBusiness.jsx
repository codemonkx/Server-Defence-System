import React from "react";
import {
    Box,
    Container,
    Heading,
    Text,
    Stack,
    SimpleGrid,
    Icon,
    Button,
    Image,
    Flex,
} from "@chakra-ui/react";
import { FaChartLine, FaUsers, FaLaptopCode, FaRocket } from "react-icons/fa";

const Feature = ({ title, text, icon }) => {
    return (
        <Stack
            className="rc-glass"
            p={8}
            borderRadius="2xl"
            align="start"
            transition="all 0.3s"
            _hover={{ transform: "translateY(-5px)", boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.8)" }}
        >
            <Flex
                w={12}
                h={12}
                align={"center"}
                justify={"center"}
                color={"white"}
                rounded={"full"}
                bg={"var(--rc-accent)"}
                mb={1}
            >
                <Icon as={icon} w={6} h={6} />
            </Flex>
            <Text fontWeight={700} color="white" fontSize="xl">{title}</Text>
            <Text color={"whiteAlpha.600"}>{text}</Text>
        </Stack>
    );
};

const ForBusiness = () => {
    return (
        <Box pt="100px" pb={20}>
            <Container maxW="container.xl">
                {/* Hero Section */}
                <Stack
                    direction={{ base: "column", lg: "row" }}
                    spacing={{ base: 10, lg: 24 }}
                    align="center"
                    mb={24}
                >
                    <Stack flex={1} spacing={6}>
                        <Text
                            fontSize="sm"
                            fontWeight="800"
                            color="var(--rc-accent)"
                            letterSpacing="2px"
                            textTransform="uppercase"
                        >
                            For Teams & Enterprises
                        </Text>
                        <Heading
                            color="white"
                            fontSize={{ base: "4xl", md: "6xl" }}
                            lineHeight="1.1"
                        >
                            Scale your team's <br />
                            <Text as="span" className="rc-text-gradient">
                                Potential
                            </Text>
                        </Heading>
                        <Text color="whiteAlpha.700" fontSize="xl" maxW="xl">
                            Empower your employees with the world's most comprehensive learning platform.
                            Built for modern teams to learn, grow, and lead together.
                        </Text>
                        <Stack direction={{ base: "column", sm: "row" }} spacing={4}>
                            <Button
                                size="lg"
                                bg="var(--rc-accent)"
                                color="white"
                                borderRadius="full"
                                px={8}
                                _hover={{ opacity: 0.9, transform: "translateY(-1px)" }}
                            >
                                Get Started
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                color="white"
                                borderColor="whiteAlpha.300"
                                borderRadius="full"
                                px={8}
                                _hover={{ bg: "whiteAlpha.100" }}
                            >
                                Contact Sales
                            </Button>
                        </Stack>
                    </Stack>
                    <Box flex={1} position="relative">
                        <Box
                            position="absolute"
                            top="-10%"
                            right="-10%"
                            w="120%"
                            h="120%"
                            bgGradient="radial(var(--rc-accent) 0%, transparent 70%)"
                            opacity="0.1"
                            zIndex="-1"
                        />
                        <Image
                            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=2070"
                            alt="Business Training"
                            borderRadius="3xl"
                            className="rc-glass"
                            p={2}
                        />
                    </Box>
                </Stack>

                {/* Features Grid */}
                <Box mb={24}>
                    <Heading color="white" textAlign="center" mb={16}>
                        Why Top Companies Choose Us
                    </Heading>
                    <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={8}>
                        <Feature
                            icon={FaChartLine}
                            title={"Custom Analytics"}
                            text={"Track your team's progress with detailed engagement and completion reports."}
                        />
                        <Feature
                            icon={FaUsers}
                            title={"Team Management"}
                            text={"Easily manage licenses and learning paths for different departments."}
                        />
                        <Feature
                            icon={FaLaptopCode}
                            title={"Hands-on Learning"}
                            text={"Interactive coding environments let your devs practice what they learn."}
                        />
                        <Feature
                            icon={FaRocket}
                            title={"LMS Integration"}
                            text={"Seamlessly connect with your existing HR and learning infrastructure."}
                        />
                    </SimpleGrid>
                </Box>

                {/* Closing CTA */}
                <Box
                    className="rc-glass"
                    p={{ base: 10, md: 20 }}
                    borderRadius="3xl"
                    textAlign="center"
                    position="relative"
                    overflow="hidden"
                >
                    <Box
                        position="absolute"
                        top="50%"
                        left="50%"
                        transform="translate(-50%, -50%)"
                        w="100%"
                        h="100%"
                        bgGradient="radial(var(--rc-accent) 0%, transparent 60%)"
                        opacity="0.1"
                        zIndex="-1"
                    />
                    <Heading color="white" mb={6} fontSize={{ base: "3xl", md: "4xl" }}>
                        Ready to transform your workforce?
                    </Heading>
                    <Text color="whiteAlpha.700" fontSize="lg" mb={10} maxW="2xl" mx="auto">
                        Join 3,000+ companies that use our platform to stay competitive in the digital age.
                    </Text>
                    <Button
                        size="lg"
                        bg="white"
                        color="black"
                        borderRadius="full"
                        px={10}
                        _hover={{ transform: "scale(1.05)" }}
                        fontWeight="700"
                    >
                        Request a Demo
                    </Button>
                </Box>
            </Container>
        </Box>
    );
};

export default ForBusiness;
