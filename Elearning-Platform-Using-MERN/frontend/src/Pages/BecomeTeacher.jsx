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
    VStack,
} from "@chakra-ui/react";
import { FaGlobe, FaMoneyBillWave, FaChalkboardTeacher, FaLightbulb } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Benefit = ({ title, text, icon }) => (
    <HStack spacing={4} align="start" p={6} className="rc-glass" borderRadius="2xl">
        <Flex
            w={12}
            h={12}
            align={"center"}
            justify={"center"}
            color={"white"}
            rounded={"full"}
            bg={"var(--rc-accent)"}
            flexShrink={0}
        >
            <Icon as={icon} w={6} h={6} />
        </Flex>
        <Box>
            <Text fontWeight={700} color="white" fontSize="lg" mb={1}>{title}</Text>
            <Text color={"whiteAlpha.600"}>{text}</Text>
        </Box>
    </HStack>
);

// Helper for horizontal stack since HStack might not be imported from chakra-ui/react in this scope
const HStack = ({ children, spacing, ...props }) => (
    <Flex direction="row" gap={spacing} {...props}>
        {children}
    </Flex>
);

const BecomeTeacher = () => {
    const navigate = useNavigate();

    return (
        <Box pt="100px" pb={20}>
            <Container maxW="container.lg">
                {/* Header Section */}
                <VStack spacing={6} textAlign="center" mb={20}>
                    <Text
                        fontSize="sm"
                        fontWeight="800"
                        color="var(--rc-accent)"
                        letterSpacing="2px"
                        textTransform="uppercase"
                    >
                        Teach with LearnHub
                    </Text>
                    <Heading
                        color="white"
                        fontSize={{ base: "4xl", md: "6xl" }}
                        lineHeight="1.1"
                        maxW="3xl"
                    >
                        Inspire students <br />
                        <Text as="span" className="rc-text-gradient">
                            Around the Globe
                        </Text>
                    </Heading>
                    <Text color="whiteAlpha.700" fontSize="xl" maxW="2xl">
                        Join our community of world-class instructors. Share your expertise,
                        build your brand, and earn money while making an impact.
                    </Text>
                    <Button
                        size="xl"
                        bg="var(--rc-accent)"
                        color="white"
                        borderRadius="full"
                        px={12}
                        h="70px"
                        fontSize="lg"
                        fontWeight="800"
                        onClick={() => navigate('/signup')}
                        _hover={{ transform: "scale(1.05)", bg: "red.500" }}
                    >
                        Start Teaching Today
                    </Button>
                </VStack>

                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8} mb={24}>
                    <Benefit
                        icon={FaGlobe}
                        title="Unlimited Reach"
                        text="Teach students from over 190 countries. Your knowledge knows no borders."
                    />
                    <Benefit
                        icon={FaMoneyBillWave}
                        title="Earn Revenue"
                        text="Get paid for every student who enrolls. The more you teach, the more you earn."
                    />
                    <Benefit
                        icon={FaChalkboardTeacher}
                        title="Expert Support"
                        text="Our team helps you create high-quality content with state-of-the-art tools."
                    />
                    <Benefit
                        icon={FaLightbulb}
                        title="Build Your Authority"
                        text="Become a recognized expert in your field and grow your professional network."
                    />
                </SimpleGrid>

                {/* Vision Section */}
                <Stack
                    direction={{ base: "column", md: "row" }}
                    spacing={12}
                    align="center"
                    p={10}
                    className="rc-glass"
                    borderRadius="3xl"
                >
                    <Box flex={1}>
                        <Image
                            src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=2070"
                            alt="Teacher at work"
                            borderRadius="2xl"
                        />
                    </Box>
                    <VStack flex={1} align="start" spacing={6}>
                        <Heading color="white" fontSize="3xl">Our Vision for Instructors</Heading>
                        <Text color="whiteAlpha.700" fontSize="lg">
                            We believe that everyone has something valuable to teach.
                            Our platform is designed to lower the barrier to entry for
                            experts to become educators, providing you with everything
                            you need to succeed.
                        </Text>
                        <VStack align="start" spacing={4}>
                            <Text color="white" fontWeight="600">✓ No upfront costs to join</Text>
                            <Text color="white" fontWeight="600">✓ Flexible schedule</Text>
                            <Text color="white" fontWeight="600">✓ Professional production guidance</Text>
                        </VStack>
                    </VStack>
                </Stack>
            </Container>
        </Box>
    );
};

export default BecomeTeacher;
