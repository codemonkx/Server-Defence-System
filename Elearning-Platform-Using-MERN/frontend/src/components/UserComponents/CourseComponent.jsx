import React from "react";
import { Box, Heading, Stack, Wrap, WrapItem, VStack } from "@chakra-ui/react";
import LandingPageCarousel from "../../Pages/LandingPageComponents/LandingPageCarousel";
import InProgressCarousel from "./InProgressCarousel";
// import LandingPageCarousel from '../'
const CourseComponent = () => {
  return (
    <Box p={8}>
      <VStack spacing={10} align="stretch" px={4}>
        <Stack spacing={4}>
          <Heading as="h2" size="xl" fontWeight="800" letterSpacing="-1px" color="white">
            All Courses
          </Heading>
          <LandingPageCarousel isDashboard={true} />
        </Stack>

        <Stack spacing={4}>
          <Heading as="h2" size="xl" fontWeight="800" letterSpacing="-1px" color="white">
            In Progress
          </Heading>
          <InProgressCarousel />
        </Stack>

        <Stack spacing={4}>
          <Heading as="h2" size="xl" fontWeight="800" letterSpacing="-1px" color="white">
            Top in Business
          </Heading>
          <LandingPageCarousel isDashboard={true} category="Business" />
        </Stack>

        <Stack spacing={4}>
          <Heading as="h2" size="xl" fontWeight="800" letterSpacing="-1px" color="white">
            IT & Software
          </Heading>
          <LandingPageCarousel isDashboard={true} category="Tech" />
        </Stack>

        <Stack spacing={4}>
          <Heading as="h2" size="xl" fontWeight="800" letterSpacing="-1px" color="white">
            Personal Development
          </Heading>
          <LandingPageCarousel isDashboard={true} category="Personal Development" />
        </Stack>
      </VStack>
    </Box>
  );
};

export default CourseComponent;
