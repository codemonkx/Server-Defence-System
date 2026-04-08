import {
  Flex,
  Text,
  Link,
  Grid,
  Image,
  useBreakpointValue,
  Container,
  Box,
} from "@chakra-ui/react";

const Section2 = () => {
  const logos = [
    { src: "https://upload.wikimedia.org/wikipedia/en/thumb/a/af/University_of_Illinois_at_Urbana%E2%80%93Champaign_logo.svg/1200px-University_of_Illinois_at_Urbana%E2%80%93Champaign_logo.svg.png", alt: "Illinois" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Duke_University_logo.svg/1280px-Duke_University_logo.svg.png", alt: "Duke" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/1200px-Google_2015_logo.svg.png", alt: "Google", h: "24px" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/University_of_Michigan_logo.svg/1200px-University_of_Michigan_logo.svg.png", alt: "UMich" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/IBM_logo.svg/1000px-IBM_logo.svg.png", alt: "IBM", h: "24px" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Imperial_College_London_logo.svg/1200px-Imperial_College_London_logo.svg.png", alt: "Imperial" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Stanford_University_logo.svg/1200px-Stanford_University_logo.svg.png", alt: "Stanford" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/UPenn_logo.svg/1200px-UPenn_logo.svg.png", alt: "Penn" },
  ];

  return (
    <Box py={20} borderY="1px solid" borderColor="whiteAlpha.100" overflow="hidden">
      <Container maxW="full" px={0}>
        <Flex
          direction="column"
          gap={12}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <Text
            fontSize={{
              lg: "xl",
              base: "md",
            }}
            color="whiteAlpha.600"
            fontWeight="500"
            textAlign="center"
            letterSpacing="wide"
            px={6}
          >
            COLLABORATING WITH{" "}
            <Text as="span" color="white" fontWeight="600">
              300+ LEADING UNIVERSITIES AND COMPANIES
            </Text>
          </Text>

          <Box className="marquee-container">
            {/* Gradient Overlays for smooth Transition */}
            <Box
              position="absolute"
              left={0}
              top={0}
              bottom={0}
              w="150px"
              bgGradient="linear(to-r, var(--rc-bg), transparent)"
              zIndex={2}
              pointerEvents="none"
            />
            <Box
              position="absolute"
              right={0}
              top={0}
              bottom={0}
              w="150px"
              bgGradient="linear(to-l, var(--rc-bg), transparent)"
              zIndex={2}
              pointerEvents="none"
            />

            <Box className="marquee-content">
              {[...logos, ...logos, ...logos, ...logos].map((logo, index) => (
                <Box key={index} className="logo-item">
                  <Image
                    src={logo.src}
                    alt={logo.alt}
                    h={logo.h || "36px"}
                    objectFit="contain"
                    transition="all 0.3s ease"
                    _hover={{ transform: "scale(1.15)" }}
                  />
                </Box>
              ))}
            </Box>
          </Box>
        </Flex>
      </Container>
    </Box>
  );
};

export default Section2;
