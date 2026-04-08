import {
  Flex,
  Grid,
  Text,
  Container,
  Heading,
  Box,
  Icon,
} from "@chakra-ui/react";
import React from "react";
import {
  FaDatabase,
  FaBriefcase,
  FaCode,
  FaHeartbeat,
  FaUsers,
  FaUserCog,
  FaPaintBrush,
  FaFlask,
  FaLanguage,
  FaMicrochip,
  FaCalculator
} from "react-icons/fa";

const CategoryCard = ({ title, count, icon: IconComponent }) => (
  <Flex
    className="rc-glass"
    p={6}
    borderRadius="20px"
    gap={4}
    align="center"
    transition="all 0.3s ease"
    _hover={{
      transform: "translateY(-4px)",
      borderColor: "whiteAlpha.300",
      bg: "whiteAlpha.100"
    }}
    cursor="pointer"
  >
    <Box
      p={4}
      borderRadius="12px"
      bg="whiteAlpha.100"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Icon as={IconComponent} w="36px" h="36px" color="var(--rc-accent)" />
    </Box>
    <Flex direction="column">
      <Text fontSize="md" fontWeight="700" color="white" lineHeight="1.2">
        {title}
      </Text>
      <Text fontSize="xs" color="whiteAlpha.500" fontWeight="600" mt={1}>
        {count} COURSES
      </Text>
    </Flex>
  </Flex>
);

const Section5 = () => {
  const categories = [
    { title: "Data Science", count: 425, icon: FaDatabase },
    { title: "Business", count: 1395, icon: FaBriefcase },
    { title: "Computer Science", count: 668, icon: FaCode },
    { title: "Health", count: 471, icon: FaHeartbeat },
    { title: "Social Sciences", count: 300, icon: FaUsers },
    { title: "Personal Development", count: 666, icon: FaUserCog },
    { title: "Arts and Humanities", count: 338, icon: FaPaintBrush },
    { title: "Physical Science", count: 413, icon: FaFlask },
    { title: "Language Learning", count: 150, icon: FaLanguage },
    { title: "Information Tech", count: 145, icon: FaMicrochip },
    { title: "Math and Logic", count: 70, icon: FaCalculator },
  ];

  return (
    <Box py={20}>
      <Container maxW="container.lg">
        <Flex direction="column" gap={10}>
          <Box mb={4}>
            <Text
              fontSize="xs"
              fontWeight="800"
              color="var(--rc-accent)"
              letterSpacing="2px"
              mb={2}
            >
              CATEGORIES
            </Text>
            <Heading color="white" fontSize={{ base: "3xl", md: "4xl" }}>
              Explore your interests
            </Heading>
          </Box>
          <Grid
            templateColumns={{
              base: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
            }}
            gap={6}
          >
            {categories.map((cat, idx) => (
              <CategoryCard key={idx} {...cat} />
            ))}
          </Grid>
        </Flex>
      </Container>
    </Box>
  );
};

export default Section5;
