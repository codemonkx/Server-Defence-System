import UserSlider from "../components/UserComponents/UserSlider";
import Footer from "./Footer";
import CourseComponent from "../components/UserComponents/CourseComponent";

import { Box, Container, Flex, Text } from "@chakra-ui/react";
import { useSelector } from "react-redux";
const UserDashboard = () => {
  const userStore = useSelector((store) => store.UserReducer);
  return (
    <Box minH="100vh" bg="var(--rc-bg)" color="var(--rc-fg)">
      <Box pt={4}>
        <UserSlider />
        <Box py={10}>
          <CourseComponent />
        </Box>

        <Box px={4} my={20}>
          <Flex
            className="rc-glass"
            maxW="container.lg"
            mx="auto"
            p={12}
            borderRadius="32px"
            direction="column"
            align="center"
            textAlign="center"
            position="relative"
            overflow="hidden"
            _before={{
              content: '""',
              position: "absolute",
              top: "-50%",
              left: "-50%",
              width: "200%",
              height: "200%",
              background: "radial-gradient(circle, rgba(255,99,99,0.05) 0%, transparent 70%)",
              zIndex: 0
            }}
          >
            <Text
              fontSize={{ base: "xl", md: "3xl" }}
              fontWeight="800"
              lineHeight="1.4"
              color="white"
              zIndex={1}
              fontStyle="italic"
              letterSpacing="-0.5px"
            >
              "Education is the most powerful weapon which you can use to change the world."
            </Text>
            <Text
              mt={4}
              fontSize="sm"
              fontWeight="700"
              color="whiteAlpha.500"
              letterSpacing="2px"
              zIndex={1}
            >
              NELSON MANDELA
            </Text>
          </Flex>
        </Box>

        <Footer />
      </Box>
    </Box>
  );
};

export default UserDashboard;
