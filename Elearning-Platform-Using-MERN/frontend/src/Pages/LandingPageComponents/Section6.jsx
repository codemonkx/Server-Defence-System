import { Button, Flex, Image, Text, Box, Container, Stack, Heading } from "@chakra-ui/react";
import React from "react";
import sectionImage from "../../asset/sectionImage.png";
import { useNavigate } from "react-router-dom";

const Section6 = () => {
  const navigate = useNavigate();
  return (
    <Box py={24}>
      <Container maxW="container.lg">
        <Flex
          direction={{ base: "column", lg: "row" }}
          align="center"
          gap={16}
        >
          <Flex flex={1} justify="center">
            <Box
              position="relative"
              _before={{
                content: '""',
                position: "absolute",
                top: "-10%",
                left: "-10%",
                right: "-10%",
                bottom: "-10%",
                bgRadial: "rgba(255, 99, 99, 0.1), transparent 70%",
                zIndex: "0",
                filter: "blur(40px)",
              }}
            >
              <Image
                src={sectionImage}
                alt="Learner outcomes"
                maxH="400px"
                objectFit="contain"
                position="relative"
                zIndex="1"
              />
            </Box>
          </Flex>

          <Stack flex={1} spacing={8}>
            <Box>
              <Text
                fontSize="xs"
                fontWeight="800"
                color="var(--rc-accent)"
                letterSpacing="2px"
                mb={2}
              >
                OUTCOMES
              </Text>
              <Heading color="white" fontSize={{ base: "3xl", md: "4xl" }} lineHeight="1.2">
                Learner outcomes on <Text as="span" color="var(--rc-accent)">LearnHub</Text>
              </Heading>
            </Box>

            <Text
              fontSize="md"
              color="whiteAlpha.700"
              lineHeight="1.8"
              fontWeight="500"
            >
              According to the latest findings from LearnHub's 2023 report,{" "}
              <Text as="span" color="white" fontWeight="700">
                an impressive 87% of learners have reported tangible career benefits.
              </Text>{" "}
              These include promotions, enhanced job performance, successful job transitions, and skill development.
              Our industry-recognized certifications have played a pivotal role in facilitating the professional growth of learners worldwide.
            </Text>

            <Flex pt={4}>
              <Button
                bg="white"
                color="black"
                size="lg"
                px={10}
                h="60px"
                borderRadius="full"
                fontSize="md"
                fontWeight="600"
                _hover={{
                  bg: "whiteAlpha.900",
                  transform: "translateY(-2px)",
                  boxShadow: "0 10px 20px rgba(255,255,255,0.1)"
                }}
                _active={{ transform: "translateY(0)" }}
                onClick={() => navigate("/signup")}
                transition="all 0.2s"
              >
                Join for Free
              </Button>
            </Flex>
          </Stack>
        </Flex>
      </Container>
    </Box>
  );
};

export default Section6;
