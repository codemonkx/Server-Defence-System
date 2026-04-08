import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  Box,
  Heading,
  Text,
  Checkbox,
  FormControl,
  FormLabel,
  Button,
  UnorderedList,
  ListItem,
  VStack
} from '@chakra-ui/react';

import { useNavigate } from "react-router-dom";
import { changeRole } from '../../Redux/TeacherReducer/action';


const TeachVerify = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = JSON.parse(localStorage.getItem('user'))

  function teacher() {
    dispatch(changeRole('teacher', user.userId));
    navigate("/Teacher/dashboard");
  }

  return (
    <Box minH="100vh" bg="var(--rc-bg)" color="var(--rc-fg)" py={20}>
      <Box maxW="container.md" mx="auto" px={6}>
        <Box className="rc-glass" p={12} borderRadius="40px">
          <VStack textAlign="center" mb={12} spacing={4}>
            <Heading size="2xl" fontWeight="900" letterSpacing="-2px">Verification</Heading>
            <Text color="whiteAlpha.500" fontSize="lg" fontWeight="600">Review our terms to unlock teaching capabilities</Text>
          </VStack>

          <VStack align="stretch" spacing={8} mb={12}>
            <Box bg="whiteAlpha.50" p={6} borderRadius="24px" border="1px solid" borderColor="whiteAlpha.100">
              <Heading size="sm" color="whiteAlpha.400" mb={6} fontWeight="800" letterSpacing="1px">TEACHING AGREEMENT</Heading>
              <UnorderedList spacing={4} color="whiteAlpha.800" fontWeight="600">
                <ListItem>Minimum age requirement of 18 years for legal instruction status.</ListItem>
                <ListItem>Commitment to academic integrity and possession of subject matter expertise.</ListItem>
                <ListItem>Strict adherence to platform guidelines regarding student interaction and privacy.</ListItem>
                <ListItem>Provision of accurate, non-misleading profile and credential information.</ListItem>
              </UnorderedList>
            </Box>

            <FormControl>
              <Checkbox
                colorScheme="indigo"
                defaultChecked
                size="lg"
                sx={{
                  'span.chakra-checkbox__control': {
                    borderRadius: '8px',
                    bg: 'whiteAlpha.100',
                    borderColor: 'whiteAlpha.200'
                  }
                }}
              >
                <Text ml={3} fontSize="md" fontWeight="700">I have read and agree to all terms of service</Text>
              </Checkbox>
            </FormControl>
          </VStack>

          <Button
            w="100%"
            bg="white"
            color="black"
            h="64px"
            borderRadius="20px"
            fontWeight="900"
            fontSize="lg"
            onClick={teacher}
            _hover={{ bg: "whiteAlpha.900", transform: "translateY(-2px)" }}
            _active={{ transform: "translateY(0)" }}
            boxShadow="0 15px 30px rgba(255,255,255,0.05)"
          >
            Authorize Account
          </Button>

          <Text textAlign="center" mt={6} color="whiteAlpha.400" fontSize="xs" fontWeight="700">
            PROCEEDING WILL UPGRADE YOUR ACCOUNT PRIVILEGES
          </Text>
        </Box>
      </Box>
    </Box>
  );
};

export default TeachVerify;
