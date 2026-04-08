import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Image,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Text,
  VStack,
  IconButton
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { ArrowLeftIcon, ArrowRightIcon } from "@chakra-ui/icons";
const UserSlider = () => {
  const images = [
    "https://images.pexels.com/photos/5212653/pexels-photo-5212653.jpeg?cs=srgb&dl=pexels-max-fischer-5212653.jpg&fm=jpg",
    "https://www.mit.edu/files/images/201807/15656704711_00457bd2c9_b_1.jpg",
    "https://inup.iitkgp.ac.in/images/iit_kgp.jpg",
    "https://www.vedantu.com/seo/content-images/33e42c38-8332-4d51-9dcf-65a4f262b5da.png",
    "https://media.wired.com/photos/6365b7166776a0176c76e4de/master/w_2560%2Cc_limit/All-the-Free-Resources-You-Can-Find-at-Your-Library-Gear-GettyImages-1331816640.jpg",
    "https://images.seattleschild.com/wp-content/uploads/2021/09/Classy-Treehouse-w-logo-e1632341660272.png",
  ];

  const textOnImage = [
    "Group Studies",
    "Degree from Recognized Institutes",
    "Prestigious Institutions",
    "Online Classes",
    "Study Notes",
    "Successful Career",
  ];

  const indexDescription = [
    "LearnHub encourages collaborative group studies, creating a vibrant learning environment where students can connect and learn together.",
    "Secure your degree from renowned institutes with LearnHub's comprehensive education solutions.",
    "LearnHub unlocks access to prestigious educational institutions, elevating your academic journey to new heights.",
    "Experience dynamic online classes on LearnHub's intuitive platform, tailored to modern learners' needs.",
    "Access meticulously crafted study notes on LearnHub to enhance your understanding and retention of course materials.",
    "LearnHub is your gateway to a successful career, offering the knowledge and skills needed for professional excellence."
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Container maxW="container.xl" mt="40px" px={4}>
      <Box
        position="relative"
        height={{ base: "300px", md: "450px" }}
        borderRadius="32px"
        overflow="hidden"
        boxShadow="0 20px 40px rgba(0,0,0,0.3)"
      >
        <Image
          w="100%"
          h="100%"
          fit="cover"
          src={images[currentIndex]}
          transition="all 0.5s ease-in-out"
        />

        {/* Overlay */}
        <Box
          position="absolute"
          bottom="0"
          left="0"
          right="0"
          height="70%"
          bgGradient="linear(to-t, blackAlpha.800, transparent)"
          p={8}
          display="flex"
          flexDirection="column"
          justifyContent="flex-end"
        >
          <VStack align="flex-start" spacing={2}>
            <Heading
              size="2xl"
              fontWeight="900"
              color="white"
              letterSpacing="-1px"
            >
              {textOnImage[currentIndex]}
            </Heading>
            <Text
              fontSize="lg"
              fontWeight="500"
              color="whiteAlpha.800"
              maxW="container.md"
            >
              {indexDescription[currentIndex]}
            </Text>
          </VStack>
        </Box>

        {/* Navigation Buttons */}
        <Flex
          position="absolute"
          bottom={8}
          right={8}
          gap={3}
          zIndex={2}
        >
          <IconButton
            icon={<ArrowLeftIcon w={3} h={3} />}
            onClick={handlePrevious}
            variant="ghost"
            className="rc-glass"
            color="white"
            borderRadius="full"
            _hover={{ bg: "whiteAlpha.200" }}
          />
          <IconButton
            icon={<ArrowRightIcon w={3} h={3} />}
            onClick={handleNext}
            variant="ghost"
            className="rc-glass"
            color="white"
            borderRadius="full"
            _hover={{ bg: "whiteAlpha.200" }}
          />
        </Flex>
      </Box>
    </Container>
  );
};

export default UserSlider;
