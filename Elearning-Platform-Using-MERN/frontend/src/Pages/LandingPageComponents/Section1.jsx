import { Flex, Text, Button, Box, Container, Stack } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const Section1 = () => {
  const navigate = useNavigate();
  return (
    <Box pt={{ base: "40px", md: "40px" }} pb={{ base: "60px", md: "100px" }}>
      <Container maxW="container.lg">
        <Flex direction="column" align="center" textAlign="center" gap={10}>
          <Stack spacing={6} align="center" maxW="800px">
            <Text
              fontSize={{
                base: "48px",
                md: "64px",
                lg: "88px",
              }}
              lineHeight="1.1"
              fontWeight="800"
              fontFamily="Inter"
              className="rc-text-gradient"
              letterSpacing="-0.04em"
            >
              Learn without limits.
            </Text>
            <Text
              fontSize={{ base: "18px", md: "20px" }}
              fontWeight="500"
              color="whiteAlpha.600"
              lineHeight="1.6"
              maxW="600px"
              letterSpacing="-0.01em"
            >
              LearnHub is where educators and students connect seamlessly online.
              Empowering learners to explore and purchase courses tailored to their needs.
            </Text>
          </Stack>

          <Flex
            gap={6}
            direction={{ base: "column", sm: "row" }}
            w={{ base: "full", sm: "auto" }}
          >
            <Button
              bg="white"
              color="black"
              size="lg"
              px={10}
              h="60px"
              borderRadius="full"
              fontSize="md"
              fontWeight="600"
              _hover={{
                bg: "whiteAlpha.900",
                transform: "translateY(-2px)",
                boxShadow: "0 10px 20px rgba(255,255,255,0.1)"
              }}
              _active={{ transform: "translateY(0)" }}
              onClick={() => navigate("/signup")}
              transition="all 0.2s"
            >
              Get Started for Free
            </Button>
            <Button
              variant="outline"
              color="white"
              borderColor="whiteAlpha.300"
              size="lg"
              px={10}
              h="60px"
              borderRadius="full"
              fontSize="md"
              fontWeight="600"
              _hover={{
                bg: "whiteAlpha.100",
                borderColor: "whiteAlpha.500",
                transform: "translateY(-2px)"
              }}
              _active={{ transform: "translateY(0)" }}
              onClick={() => navigate("/login")}
              transition="all 0.2s"
            >
              Try LearnHub Business
            </Button>
          </Flex>

          {/* Abstract Raycast Glow Effect Background */}
          <Box
            position="absolute"
            top="-10%"
            left="50%"
            transform="translateX(-50%)"
            w="80%"
            h="40%"
            bgGradient="radial(rgba(255, 99, 99, 0.05), transparent 70%)"
            zIndex="-1"
            filter="blur(100px)"
          />
        </Flex>
      </Container>
    </Box>
  );
};

export default Section1;
