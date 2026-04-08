import React from 'react';
import { Box, Flex, Grid, Heading, Text, VStack, Icon } from "@chakra-ui/react";
import TeacherNavTop from "./TeacherNavTop";

const TeacherDashboard = () => {
  // Dummy data for courses and enrolled users
  const courses = [
    { id: 1, title: "Course A", enrolledUsers: 20 },
    { id: 2, title: "Course B", enrolledUsers: 15 },
    { id: 3, title: "Course C", enrolledUsers: 30 },
  ];

  return (
    <Box minH="100vh" bg="var(--rc-bg)" color="var(--rc-fg)">
      <Grid className="Nav" w="100%">
        <Box pt="100px" px={8} pb={10} maxW="container.xl" mx="auto">
          <TeacherNavTop />
          <Box mt={6}>
            <Heading size="lg" fontWeight="800" mb={8} letterSpacing="-1px">
              My Overview
            </Heading>
            <Grid
              templateColumns={{
                base: "1fr",
                md: "repeat(2, 1fr)",
                xl: "repeat(3, 1fr)",
              }}
              gap={6}
            >
              {courses.map(course => (
                <Box
                  key={course.id}
                  className="rc-glass"
                  p={6}
                  borderRadius="24px"
                  boxShadow="0 10px 20px rgba(0,0,0,0.2)"
                  transition="transform 0.2s"
                  _hover={{ transform: "translateY(-4px)" }}
                >
                  <VStack align="start" spacing={1}>
                    <Text fontSize="xs" fontWeight="700" color="whiteAlpha.500" letterSpacing="1px">
                      COURSE PERFORMANCE
                    </Text>
                    <Heading size="md" fontWeight="800">
                      {course.title}
                    </Heading>
                    <Flex mt={4} align="center" w="100%" justify="space-between">
                      <Text fontSize="sm" fontWeight="600" color="whiteAlpha.700">
                        Enrolled Users
                      </Text>
                      <Text fontSize="lg" fontWeight="900" color="var(--rc-accent)">
                        {course.enrolledUsers}
                      </Text>
                    </Flex>
                  </VStack>
                </Box>
              ))}
            </Grid>
          </Box>
        </Box>
      </Grid>
    </Box>
  );
}

export default TeacherDashboard;
