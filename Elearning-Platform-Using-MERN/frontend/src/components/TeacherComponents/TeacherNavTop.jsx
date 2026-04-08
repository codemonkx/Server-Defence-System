import { Box, Flex, Input, IconButton, Text, Icon, Avatar } from "@chakra-ui/react";
import React from "react";
import { Link } from "react-router-dom";
import { IoSearchCircleOutline } from "react-icons/io5";
import { AiOutlineQuestionCircle, AiOutlineBell } from "react-icons/ai";
import { useSelector } from "react-redux";

const TeacherNavTop = ({ handleSearch }) => {
  const userStore = useSelector((store) => store.UserReducer);

  return (
    <Flex
      h="80px"
      justifyContent="space-between"
      alignItems="center"
      className="rc-glass"
      borderRadius="20px"
      px={6}
      mb={10}
    >
      <Flex w="60%" align="center">
        <Icon as={IoSearchCircleOutline} boxSize={8} color="whiteAlpha.400" />
        <Box w="80%" ml={2}>
          <Input
            placeholder="Search your courses..."
            variant="unstyled"
            fontSize="sm"
            color="white"
            fontWeight="600"
            _placeholder={{ color: "whiteAlpha.300" }}
            onChange={handleSearch}
          />
        </Box>
      </Flex>
      <Flex
        gap={6}
        align="center"
        display={{ base: "none", md: "flex" }}
      >
        <IconButton
          icon={<AiOutlineQuestionCircle size={24} />}
          variant="ghost"
          color="whiteAlpha.600"
          _hover={{ color: "white", bg: "whiteAlpha.100" }}
          aria-label="Help"
        />
        <IconButton
          icon={<AiOutlineBell size={24} />}
          variant="ghost"
          color="whiteAlpha.600"
          _hover={{ color: "white", bg: "whiteAlpha.100" }}
          aria-label="Notifications"
        />
        <Avatar
          size="sm"
          name={userStore?.name}
          bg="var(--rc-accent)"
          color="white"
          fontWeight="800"
          cursor="pointer"
        />
      </Flex>
    </Flex>
  );
};

export default TeacherNavTop;
