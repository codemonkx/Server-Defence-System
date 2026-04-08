import {
  Box,
  Button,
  Flex,
  FormLabel,
  Grid,
  Heading,
  Input,
  Text,
  VStack,
  FormControl
} from "@chakra-ui/react";
import React from "react";
import AdminNavTop from "../AdminNavTop";
import { useSelector } from "react-redux";
import { capitalizeFirstLetter } from "../../Redux/UserReducer/action";

const Setting = () => {
  const store = useSelector((store) => store.AdminReducer.data);
  const userStore = useSelector((store) => store.UserReducer);
  const name = capitalizeFirstLetter(userStore.name);
  const password = "Hello_Password";

  return (
    <Box minH="100vh" bg="var(--rc-bg)" color="var(--rc-fg)">
      <Grid w="100%">
        <Box pt="100px" px={8} pb={10} maxW="container.lg" mx="auto">
          <AdminNavTop />

          <Box mt={12}>
            <VStack align="start" spacing={1} mb={10}>
              <Heading size="xl" fontWeight="900" letterSpacing="-1.5px">Settings</Heading>
              <Text color="whiteAlpha.500" fontWeight="600">Personalize your administrative profile and security</Text>
            </VStack>

            <VStack spacing={10} align="stretch">
              <Box className="rc-glass" p={10} borderRadius="32px">
                <Grid templateColumns={{ base: "1fr", lg: "300px 1fr" }} gap={10}>
                  <Box>
                    <Heading size="md" fontWeight="800" mb={2}>Profile Information</Heading>
                    <Text color="whiteAlpha.500" fontSize="sm" fontWeight="600">Update your public identity on the platform</Text>
                  </Box>
                  <VStack align="stretch" spacing={6}>
                    <FormControl>
                      <FormLabel fontSize="sm" fontWeight="800" color="whiteAlpha.400" mb={3}>NAME</FormLabel>
                      <Input
                        placeholder="Enter Name"
                        value={name}
                        bg="blackAlpha.300"
                        border="1px solid"
                        borderColor="whiteAlpha.100"
                        borderRadius="14px"
                        h="56px"
                        _focus={{ borderColor: "var(--rc-accent)" }}
                      />
                    </FormControl>
                    <Button
                      bg="white"
                      color="black"
                      h="56px"
                      borderRadius="14px"
                      fontWeight="800"
                      isDisabled={true}
                      _disabled={{ opacity: 0.5, cursor: "not-allowed" }}
                    >
                      Save Profile
                    </Button>
                  </VStack>
                </Grid>
              </Box>

              <Box className="rc-glass" p={10} borderRadius="32px">
                <Grid templateColumns={{ base: "1fr", lg: "300px 1fr" }} gap={10}>
                  <Box>
                    <Heading size="md" fontWeight="800" mb={2}>Update Password</Heading>
                    <Text color="whiteAlpha.500" fontSize="sm" fontWeight="600">Ensure your account remains secure with a strong password</Text>
                  </Box>
                  <VStack align="stretch" spacing={6}>
                    <FormControl>
                      <FormLabel fontSize="sm" fontWeight="800" color="whiteAlpha.400" mb={3}>CURRENT PASSWORD</FormLabel>
                      <Input
                        placeholder="Enter Current Password"
                        type="password"
                        value={password}
                        bg="blackAlpha.300"
                        border="1px solid"
                        borderColor="whiteAlpha.100"
                        borderRadius="14px"
                        h="56px"
                        _focus={{ borderColor: "var(--rc-accent)" }}
                      />
                    </FormControl>
                    <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={6}>
                      <FormControl>
                        <FormLabel fontSize="sm" fontWeight="800" color="whiteAlpha.400" mb={3}>NEW PASSWORD</FormLabel>
                        <Input
                          placeholder="8+ characters"
                          type="password"
                          bg="blackAlpha.300"
                          border="1px solid"
                          borderColor="whiteAlpha.100"
                          borderRadius="14px"
                          h="56px"
                          _focus={{ borderColor: "var(--rc-accent)" }}
                        />
                      </FormControl>
                      <FormControl>
                        <FormLabel fontSize="sm" fontWeight="800" color="whiteAlpha.400" mb={3}>CONFIRM PASSWORD</FormLabel>
                        <Input
                          placeholder="Repeat new password"
                          type="password"
                          bg="blackAlpha.300"
                          border="1px solid"
                          borderColor="whiteAlpha.100"
                          borderRadius="14px"
                          h="56px"
                          _focus={{ borderColor: "var(--rc-accent)" }}
                        />
                      </FormControl>
                    </Grid>
                    <Button
                      bg="white"
                      color="black"
                      h="56px"
                      borderRadius="14px"
                      fontWeight="800"
                      _hover={{ bg: "whiteAlpha.900", transform: "translateY(-2px)" }}
                      _active={{ transform: "translateY(0)" }}
                    >
                      Update Password
                    </Button>
                  </VStack>
                </Grid>
              </Box>
            </VStack>
          </Box>
        </Box>
      </Grid>
    </Box>
  );
};

export default Setting;
