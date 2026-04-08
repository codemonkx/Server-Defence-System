import { Button, Heading, Icon, Text, Box, VStack } from "@chakra-ui/react";
import { FaExclamationTriangle } from "react-icons/fa";
import { Link } from "react-router-dom";

const PageNotFound = () => {
  return (
    <Box
      minH="100vh"
      bg="var(--rc-bg)"
      color="var(--rc-fg)"
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
      px={4}
    >
      <Box
        className="rc-glass"
        p={12}
        borderRadius="32px"
        textAlign="center"
        maxW="500px"
        position="relative"
        _before={{
          content: '""',
          position: "absolute",
          top: "-20%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "140%",
          height: "140%",
          background: "radial-gradient(circle, rgba(255,99,99,0.08) 0%, transparent 70%)",
          zIndex: 0
        }}
      >
        <Box position="relative" zIndex={1}>
          <Icon as={FaExclamationTriangle} color="var(--rc-accent)" boxSize={16} mb={6} />
          <Heading
            fontSize={{ base: "32px", md: "48px" }}
            fontWeight="800"
            fontFamily="Inter"
            letterSpacing="-0.04em"
            mb={4}
            className="rc-text-gradient"
          >
            404 Not Found
          </Heading>
          <Text fontSize="lg" mb={10} color="whiteAlpha.600" fontWeight="500">
            Oops! The page you're looking for has drifted into deep space.
          </Text>
          <Link to="/">
            <Button
              bg="white"
              color="black"
              size="lg"
              px={10}
              h="60px"
              borderRadius="full"
              fontWeight="700"
              _hover={{
                bg: "whiteAlpha.900",
                transform: "translateY(-2px)"
              }}
              _active={{ transform: "translateY(0)" }}
            >
              Go back home
            </Button>
          </Link>
        </Box>
      </Box>
    </Box>
  );
};

export default PageNotFound;
