import {
  Box,
  Button,
  Flex,
  Grid,
  Image,
  Text,
  Textarea,
  VStack,
  Heading,
  SimpleGrid,
  HStack
} from "@chakra-ui/react";
import React, { useState } from "react";
import AdminNavTop from "../AdminNavTop";

const data = [
  {
    image:
      "https://images.unsplash.com/photo-1607082349566-187342175e2f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZGlzY291bnR8ZW58MHx8MHx8fDA%3D&w=1000&q=80",
    desc: "50% Discount available",
  },
  {
    image:
      "https://images.unsplash.com/photo-1607082349566-187342175e2f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZGlzY291bnR8ZW58MHx8MHx8fDA%3D&w=1000&q=80",
    desc: "50% Discount available",
  },
  {
    image:
      "https://images.unsplash.com/photo-1607082349566-187342175e2f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZGlzY291bnR8ZW58MHx8MHx8fDA%3D&w=1000&q=80",
    desc: "50% Discount available",
  },
  {
    image:
      "https://images.unsplash.com/photo-1607082349566-187342175e2f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZGlzY291bnR8ZW58MHx8MHx8fDA%3D&w=1000&q=80",
    desc: "50% Discount available",
  },
  {
    image:
      "https://images.unsplash.com/photo-1607082349566-187342175e2f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZGlzY291bnR8ZW58MHx8MHx8fDA%3D&w=1000&q=80",
    desc: "50% Discount available",
  },
  {
    image:
      "https://images.unsplash.com/photo-1607082349566-187342175e2f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZGlzY291bnR8ZW58MHx8MHx8fDA%3D&w=1000&q=80",
    desc: "50% Discount available",
  },
  {
    image:
      "https://images.unsplash.com/photo-1607082349566-187342175e2f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZGlzY291bnR8ZW58MHx8MHx8fDA%3D&w=1000&q=80",
    desc: "50% Discount available",
  },
  {
    image:
      "https://images.unsplash.com/photo-1607082349566-187342175e2f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZGlzY291bnR8ZW58MHx8MHx8fDA%3D&w=1000&q=80",
    desc: "50% Discount available",
  },
  {
    image:
      "https://images.unsplash.com/photo-1607082349566-187342175e2f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZGlzY291bnR8ZW58MHx8MHx8fDA%3D&w=1000&q=80",
    desc: "50% Discount available",
  },
  {
    image:
      "https://images.unsplash.com/photo-1607082349566-187342175e2f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZGlzY291bnR8ZW58MHx8MHx8fDA%3D&w=1000&q=80",
    desc: "50% Discount available",
  },
];

const Discount = () => {
  const [discount, setDiscount] = useState(data);
  return (
    <Box minH="100vh" bg="var(--rc-bg)" color="var(--rc-fg)">
      <Grid w="100%">
        <Box pt="100px" px={8} pb={10} maxW="container.xl" mx="auto">
          <AdminNavTop />

          <Box mt={12}>
            <VStack align="start" spacing={1} mb={10}>
              <Heading size="xl" fontWeight="900" letterSpacing="-1.5px">Active Discounts</Heading>
              <Text color="whiteAlpha.500" fontWeight="600">Promotional campaigns and seasonal offers</Text>
            </VStack>

            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={8}>
              {discount.map((el, i) => {
                return (
                  <Box
                    key={i}
                    className="rc-glass"
                    p={6}
                    borderRadius="24px"
                    transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                    _hover={{ transform: "translateY(-4px)", borderColor: "whiteAlpha.200" }}
                  >
                    <Box
                      borderRadius="16px"
                      overflow="hidden"
                      mb={6}
                      aspectRatio={16 / 9}
                      bg="blackAlpha.400"
                    >
                      <Image
                        src={el.image}
                        w="100%"
                        h="100%"
                        objectFit="cover"
                        transition="transform 0.5s ease"
                        _hover={{ transform: "scale(1.05)" }}
                      />
                    </Box>
                    <VStack align="start" spacing={4}>
                      <Text fontWeight="800" fontSize="lg" className="rc-text-gradient">{el.desc}</Text>
                      <HStack w="100%" spacing={4}>
                        <Button
                          flex={1}
                          variant="ghost"
                          color="red.400"
                          borderRadius="14px"
                          fontWeight="800"
                          _hover={{ bg: "red.400", color: "white" }}
                        >
                          Delete
                        </Button>
                        <Button
                          flex={1}
                          bg="whiteAlpha.100"
                          borderRadius="14px"
                          fontWeight="800"
                          _hover={{ bg: "white", color: "black" }}
                        >
                          Toggle Status
                        </Button>
                      </HStack>
                    </VStack>
                  </Box>
                );
              })}
            </SimpleGrid>
          </Box>
        </Box>
      </Grid>
    </Box>
  );
};

export default Discount;
