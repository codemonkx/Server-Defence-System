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
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzShY-HQBduoJukm8zwN-869tlTb7Dl2sxlw&usqp=CAU",
    desc: "50% Discount available",
    id: 1,
    status: true,
  },
  {
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzShY-HQBduoJukm8zwN-869tlTb7Dl2sxlw&usqp=CAU",
    desc: "50% Discount available",
    id: 2,
    status: true,
  },
  {
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzShY-HQBduoJukm8zwN-869tlTb7Dl2sxlw&usqp=CAU",
    desc: "50% Discount available",
    id: 3,
    status: true,
  },
  {
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzShY-HQBduoJukm8zwN-869tlTb7Dl2sxlw&usqp=CAU",
    desc: "50% Discount available",
    id: 4,
    status: true,
  },
  {
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzShY-HQBduoJukm8zwN-869tlTb7Dl2sxlw&usqp=CAU",
    desc: "50% Discount available",
    id: 5,
    status: true,
  },
  {
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzShY-HQBduoJukm8zwN-869tlTb7Dl2sxlw&usqp=CAU",
    desc: "50% Discount available",
    id: 6,
    status: true,
  },
  {
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzShY-HQBduoJukm8zwN-869tlTb7Dl2sxlw&usqp=CAU",
    desc: "50% Discount available",
    id: 7,
    status: true,
  },
  {
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzShY-HQBduoJukm8zwN-869tlTb7Dl2sxlw&usqp=CAU",
    desc: "50% Discount available",
    id: 8,
    status: true,
  },
  {
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzShY-HQBduoJukm8zwN-869tlTb7Dl2sxlw&usqp=CAU",
    desc: "50% Discount available",
    id: 9,
    status: true,
  },
  {
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzShY-HQBduoJukm8zwN-869tlTb7Dl2sxlw&usqp=CAU",
    desc: "50% Discount available",
    id: 10,
    status: true,
  },
];

const GiftCard = () => {
  const [discount, setDiscount] = useState(data);

  const handleDelete = (id) => {
    let data = discount.filter((el) => {
      return el.id !== id;
    });
    setDiscount(data);
  };
  const handleClick = (id) => {
    // console.log(id)
  };

  return (
    <Box minH="100vh" bg="var(--rc-bg)" color="var(--rc-fg)">
      <Grid w="100%">
        <Box pt="100px" px={8} pb={10} maxW="container.xl" mx="auto">
          <AdminNavTop />

          <Box mt={12}>
            <VStack align="start" spacing={1} mb={10}>
              <Heading size="xl" fontWeight="900" letterSpacing="-1.5px">Gift Cards</Heading>
              <Text color="whiteAlpha.500" fontWeight="600">Inventory of active and pending vouchers</Text>
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
                          onClick={() => handleDelete(el.id)}
                          _hover={{ bg: "red.400", color: "white" }}
                        >
                          Revoke
                        </Button>
                        <Button
                          flex={1}
                          bg="whiteAlpha.100"
                          borderRadius="14px"
                          fontWeight="800"
                          onClick={() => handleClick(el.id)}
                          _hover={{ bg: "white", color: "black" }}
                        >
                          {el.status ? "Disable" : "Enable"}
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

export default GiftCard;
