import React from "react";
import {
  Box,
  Container,
  Stack,
  Text,
  Link,
  SimpleGrid,
  Flex,
  Icon,
} from "@chakra-ui/react";
import { FaTwitter, FaYoutube, FaLinkedin, FaGithub } from "react-icons/fa";

const ListHeader = ({ children }) => {
  return (
    <Text fontWeight={'700'} fontSize={'sm'} mb={4} color="white" letterSpacing="1px" textTransform="uppercase">
      {children}
    </Text>
  );
};

const Footer = () => {
  return (
    <Box
      bg="var(--rc-bg)"
      color="whiteAlpha.600"
      borderTop="1px solid"
      borderColor="whiteAlpha.100"
      py={20}
    >
      <Container maxW={'container.lg'}>
        <SimpleGrid templateColumns={{ sm: '1fr 1fr', md: '2fr 1fr 1fr 1fr' }} spacing={12}>
          <Stack spacing={6}>
            <Box>
              <Text
                fontFamily={'Inter'}
                fontWeight="800"
                color={'white'}
                fontSize="2xl"
                letterSpacing="-0.02em"
                className="rc-text-gradient"
              >
                LearnHub
              </Text>
            </Box>
            <Text fontSize={'sm'} maxW="300px">
              Where Educators and Students Connect Seamlessly Online. Empowering learners worldwide.
            </Text>
            <Stack direction={'row'} spacing={6}>
              <Link href={'#'} color="whiteAlpha.600" _hover={{ color: 'white' }}>
                <Icon as={FaTwitter} w={5} h={5} />
              </Link>
              <Link href={'#'} color="whiteAlpha.600" _hover={{ color: 'white' }}>
                <Icon as={FaYoutube} w={5} h={5} />
              </Link>
              <Link href={'#'} color="whiteAlpha.600" _hover={{ color: 'white' }}>
                <Icon as={FaLinkedin} w={5} h={5} />
              </Link>
              <Link href={'#'} color="whiteAlpha.600" _hover={{ color: 'white' }}>
                <Icon as={FaGithub} w={5} h={5} />
              </Link>
            </Stack>
          </Stack>
          <Stack align={'start'}>
            <ListHeader>Platform</ListHeader>
            <Link href={'#'} fontSize="sm" _hover={{ color: 'white', textDecoration: 'none' }}>Explore</Link>
            <Link href={'#'} fontSize="sm" _hover={{ color: 'white', textDecoration: 'none' }}>Courses</Link>
            <Link href={'#'} fontSize="sm" _hover={{ color: 'white', textDecoration: 'none' }}>Degrees</Link>
            <Link href={'#'} fontSize="sm" _hover={{ color: 'white', textDecoration: 'none' }}>For Business</Link>
          </Stack>
          <Stack align={'start'}>
            <ListHeader>Company</ListHeader>
            <Link href={'#'} fontSize="sm" _hover={{ color: 'white', textDecoration: 'none' }}>About Us</Link>
            <Link href={'#'} fontSize="sm" _hover={{ color: 'white', textDecoration: 'none' }}>Careers</Link>
            <Link href={'#'} fontSize="sm" _hover={{ color: 'white', textDecoration: 'none' }}>Contact</Link>
            <Link href={'#'} fontSize="sm" _hover={{ color: 'white', textDecoration: 'none' }}>Blog</Link>
          </Stack>
          <Stack align={'start'}>
            <ListHeader>Legal</ListHeader>
            <Link href={'#'} fontSize="sm" _hover={{ color: 'white', textDecoration: 'none' }}>Terms of Service</Link>
            <Link href={'#'} fontSize="sm" _hover={{ color: 'white', textDecoration: 'none' }}>Privacy Policy</Link>
            <Link href={'#'} fontSize="sm" _hover={{ color: 'white', textDecoration: 'none' }}>Accessibility</Link>
          </Stack>
        </SimpleGrid>
        <Flex
          pt={10}
          mt={10}
          borderTop="1px solid"
          borderColor="whiteAlpha.100"
          justifyContent="space-between"
          alignItems="center"
          direction={{ base: 'column', md: 'row' }}
          gap={4}
        >
          <Text fontSize={'xs'}>© 2024 LearnHub Inc. All rights reserved.</Text>
          <Text fontSize={'xs'}>Made with ❤️ for Educators & Students</Text>
        </Flex>
      </Container>
    </Box>
  );
};

export default Footer;
