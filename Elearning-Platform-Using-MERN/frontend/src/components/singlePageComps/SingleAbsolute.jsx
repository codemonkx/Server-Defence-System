import { Box, Image, Text, VStack, Heading, Button, Flex, Center, Divider } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const SingleAbsolute = ({ props }) => {
  const [page, setPage] = useState("left");
  const [random, setRandom] = useState(0);

  const { onOpen, price, img } = props;

  function handlePayment() {
    onOpen();
  }

  useEffect(() => {
    setRandom((Math.random() * 20).toFixed());
  }, []);

  return (
    <Box
      className="rc-glass"
      borderRadius="32px"
      overflow="hidden"
      maxW="380px"
      boxShadow="0 20px 40px rgba(0,0,0,0.4)"
      transition="transform 0.3s"
      _hover={{ transform: "translateY(-4px)" }}
    >
      <Box position="relative">
        <Image src={img} w="100%" h="200px" objectFit="cover" />
        <Center
          position="absolute"
          inset={0}
          bg="blackAlpha.400"
          backdropFilter="blur(2px)"
          opacity={0}
          _hover={{ opacity: 1 }}
          transition="opacity 0.2s"
        >
          <Text fontWeight="800" fontSize="lg">Preview Course</Text>
        </Center>
      </Box>

      <VStack p={8} spacing={6} align="stretch">
        <Flex gap={4} p={1} bg="whiteAlpha.100" borderRadius="16px">
          <Button
            flex="1"
            variant="ghost"
            borderRadius="12px"
            h="40px"
            fontSize="sm"
            fontWeight="700"
            bg={page === "left" ? "whiteAlpha.200" : "transparent"}
            color={page === "left" ? "white" : "whiteAlpha.500"}
            onClick={() => setPage("left")}
            _hover={{ bg: "whiteAlpha.100" }}
          >
            Personal
          </Button>
          <Button
            flex="1"
            variant="ghost"
            borderRadius="12px"
            h="40px"
            fontSize="sm"
            fontWeight="700"
            bg={page === "right" ? "whiteAlpha.200" : "transparent"}
            color={page === "right" ? "white" : "whiteAlpha.500"}
            onClick={() => setPage("right")}
            _hover={{ bg: "whiteAlpha.100" }}
          >
            Teams
          </Button>
        </Flex>

        <Box>
          <Heading size="sm" fontWeight="800" mb={2}>Subscribe to Top Courses</Heading>
          <Text fontSize="xs" color="whiteAlpha.600" lineHeight="1.6">
            Get this course, plus 8,000+ top-rated courses with Personal Plan.
            <Link to="#" style={{ color: "var(--rc-accent)", fontWeight: "700", marginLeft: "4px" }}>
              Learn more
            </Link>
          </Text>
        </Box>

        <Button
          bg="white"
          color="black"
          h="56px"
          borderRadius="16px"
          fontWeight="800"
          onClick={handlePayment}
          _hover={{ bg: "whiteAlpha.900", transform: "translateY(-1px)" }}
          _active={{ transform: "translateY(0)" }}
        >
          Start Subscription
        </Button>

        <VStack spacing={0}>
          <Text fontSize="10px" fontWeight="700" color="whiteAlpha.400">STARTING AT ₹750/MO</Text>
          <Text fontSize="10px" color="whiteAlpha.300">Cancel anytime</Text>
        </VStack>

        <Flex align="center" gap={4}>
          <Divider borderColor="whiteAlpha.100" />
          <Text fontSize="xs" fontWeight="800" color="whiteAlpha.400">OR</Text>
          <Divider borderColor="whiteAlpha.100" />
        </Flex>

        <Box>
          <Flex align="baseline" gap={2} mb={1}>
            <Heading size="md" fontWeight="800">₹{price}</Heading>
            <Text fontSize="sm" color="whiteAlpha.400" textDecoration="line-through">
              ₹{((price * (+random + 100)) / 100).toFixed()}
            </Text>
            <Text fontSize="xs" fontWeight="800" color="green.300">{random}% OFF</Text>
          </Flex>
          <Text fontSize="xs" fontWeight="700" color="red.400">⏰ 52 minutes left at this price!</Text>
        </Box>

        <Button
          variant="outline"
          borderColor="whiteAlpha.300"
          color="white"
          h="56px"
          borderRadius="16px"
          fontWeight="800"
          onClick={handlePayment}
          _hover={{ bg: "whiteAlpha.100", borderColor: "white" }}
        >
          Buy This Course
        </Button>

        <Flex justify="center" gap={6} pt={2}>
          <Link to="#" style={{ fontSize: "11px", fontWeight: "700", color: "whiteAlpha.500" }}>Share</Link>
          <Link to="#" style={{ fontSize: "11px", fontWeight: "700", color: "whiteAlpha.500" }}>Gift Course</Link>
          <Link to="#" style={{ fontSize: "11px", fontWeight: "700", color: "whiteAlpha.500" }}>Apply Coupon</Link>
        </Flex>
      </VStack>
    </Box>
  );
};

export default SingleAbsolute;
