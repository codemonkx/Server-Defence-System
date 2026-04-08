import React from "react";
import { FaCheck } from "react-icons/fa";
import { Box, Heading, Grid, Flex, Text, Icon } from "@chakra-ui/react";

const SingleList = () => {
  const list = [
    "Build enterprise level Node applications and deploy to the cloud (AWS)",
    "Lead NodeJS projects by making good architecture decisions",
    "Work with real life data and SpaceX API to build systems",
    "Build a MERN (MongoDb, Express, React, Node) fullstack app",
    "Become the top 10% Node Developer. Learn advanced topics!",
    "Master the latest ecosystem of a Backend NodeJS Developer",
    "Learn to build secure and performant, large scale applications",
    "Using NodeJS, build production grade apps including REST APIs",
    "Authentication, File I/O, Databases (SQL, MongoDB), Express",
    "Load balancing, Monitoring, CI/CD, and Zero Downtime",
    "Focus on security best practices throughout the course",
  ];

  return (
    <Box>
      <Heading size="md" fontWeight="800" mb={8} letterSpacing="-1px">
        What you'll learn
      </Heading>

      <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={4}>
        {list.map((item, index) => (
          <Flex key={index} align="start" gap={3}>
            <Icon
              as={FaCheck}
              color="var(--rc-accent)"
              mt={1}
              fontSize="xs"
              flexShrink={0}
            />
            <Text fontSize="sm" color="whiteAlpha.700" fontWeight="500" lineHeight="1.5">
              {item}
            </Text>
          </Flex>
        ))}
      </Grid>
    </Box>
  );
};

export default SingleList;

