import React, { useState } from "react";
import { Box, Flex, Image, Text, Icon, Badge } from "@chakra-ui/react";
import { FaGraduationCap, FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import dockerImg from "../../asset/docker.png";

const Card = ({ course, title, category, description, _id, img }) => {
  const [imgError, setImgError] = useState(false);

  const defaultImages = [
    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop",
  ];

  const getMappedImage = (searchString) => {
    // Curated high-quality technical and academic images
    const keywordMapping = {
      "docker": dockerImg,
      "kubernet": "https://images.unsplash.com/photo-1667372393453-4886bca7f369?q=80&w=800&auto=format&fit=crop",
      "python": "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=800&auto=format&fit=crop",
      "react": "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=800&auto=format&fit=crop",
      "node": "https://images.unsplash.com/photo-1547658719-da2b51169166?q=80&w=800&auto=format&fit=crop",
      "javascript": "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?q=80&w=800&auto=format&fit=crop",
      "java": "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800&auto=format&fit=crop",
      "c++": "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800&auto=format&fit=crop",
      "sql": "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?q=80&w=800&auto=format&fit=crop",
      "aws": "https://images.unsplash.com/photo-1558494949-ef010cbdcc48?q=80&w=800&auto=format&fit=crop",
      "devops": "https://images.unsplash.com/photo-1558494949-ef010cbdcc48?q=80&w=800&auto=format&fit=crop",
      "azure": "https://images.unsplash.com/photo-1558494949-ef010cbdcc48?q=80&w=800&auto=format&fit=crop",
      "cloud": "https://images.unsplash.com/photo-1558494949-ef010cbdcc48?q=80&w=800&auto=format&fit=crop",
      "data science": "https://images.unsplash.com/photo-1551288049-bbbda536639a?q=80&w=800&auto=format&fit=crop",
      "business": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop",
      "computer science": "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800&auto=format&fit=crop",
      "health": "https://images.unsplash.com/photo-1505751172107-179831518b36?q=80&w=800&auto=format&fit=crop",
      "personal development": "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800&auto=format&fit=crop",
    };

    const matchedKeyword = Object.keys(keywordMapping).find(
      key => searchString.includes(key)
    );

    return matchedKeyword ? keywordMapping[matchedKeyword] : defaultImages[0];
  };

  const getDisplayImage = (forceFallback = false) => {
    const courseTitle = title || course || "";
    const searchString = `${courseTitle} ${category || ""}`.toLowerCase();

    // If we're forced to fallback or the image is a known problematic source
    if (forceFallback || (img && (img.includes('placeholder') || img.includes('bing.com')))) {
      return getMappedImage(searchString);
    }

    if (img && img.startsWith('http')) {
      return img;
    }

    return getMappedImage(searchString);
  };

  const displayImg = getDisplayImage(imgError);

  return (
    <Link to={`/course/${_id}`} target="_blank">
      <Flex
        direction={"column"}
        className="rc-glass"
        borderRadius="24px"
        overflow="hidden"
        m={3}
        h={{
          base: "auto",
          md: "460px",
        }}
        transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
        _hover={{
          transform: "translateY(-8px) scale(1.02)",
          borderColor: "rgba(255, 255, 255, 0.2)",
          boxShadow: "0 20px 40px rgba(0, 0, 0, 0.4)"
        }}
        role="group"
      >
        <Box h="200px" overflow="hidden" position="relative">
          <Image
            src={displayImg}
            alt={title}
            objectFit="cover"
            w="100%"
            h="100%"
            transition="transform 0.5s ease"
            _groupHover={{ transform: "scale(1.1)" }}
            onError={() => setImgError(true)}
          />
          <Box
            position="absolute"
            top="0"
            left="0"
            right="0"
            bottom="0"
            bgGradient="linear(to-t, var(--rc-bg), transparent)"
          />
          <Badge
            position="absolute"
            top={4}
            left={4}
            bg="var(--rc-accent)"
            color="white"
            borderRadius="full"
            px={3}
            py={1}
            fontSize="xs"
            fontWeight="700"
            letterSpacing="wider"
            textTransform="uppercase"
          >
            {category}
          </Badge>
        </Box>

        <Flex direction="column" p={6} flex={1} justify="space-between" gap={4}>
          <Box>
            <Text
              fontSize="xl"
              fontWeight="700"
              color="white"
              mb={3}
              lineHeight="1.3"
              noOfLines={2}
            >
              {title}
            </Text>
            <Text
              fontSize="sm"
              color="whiteAlpha.600"
              noOfLines={3}
              lineHeight="1.5"
            >
              {description}
            </Text>
          </Box>

          <Flex align="center" justify="space-between">
            <Flex align="center" gap={2} color="var(--rc-accent)">
              <Icon as={FaGraduationCap} />
              <Text fontSize="xs" fontWeight="600" letterSpacing="1px">
                EARN A DEGREE
              </Text>
            </Flex>
            <Icon
              as={FaArrowRight}
              color="whiteAlpha.400"
              transition="all 0.3s ease"
              _groupHover={{ color: "white", transform: "translateX(4px)" }}
            />
          </Flex>
        </Flex>
      </Flex>
    </Link>
  );
};

export default Card;
