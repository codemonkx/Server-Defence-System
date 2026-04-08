import React, { useState } from "react";
import {
  Flex,
  Box,
  Input,
  IconButton,
  useBreakpointValue,
  Text,
  Link,
  useDisclosure,
  useToast,
  Container,
} from "@chakra-ui/react";
import { FaSearch, FaBars } from "react-icons/fa";
import Dropdown from "./Dropdown";
import { useLocation, useNavigate } from "react-router-dom";
import { NavBarDrawer } from "../NavBarDrawer";
import { showToast } from "../SignUp";

const Navbar = () => {
  const isMobile = useBreakpointValue({ base: true, lg: false });
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user')) || {};
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const toast = useToast();
  const location = useLocation();

  function home() {
    navigate("/home");
  }

  function handleSearch() {
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <Box position="fixed" top="0" w="100%" zIndex="1000" pt={4} px={4}>
      <Container maxW="container.lg">
        <Flex
          as="nav"
          align="center"
          justify="space-between"
          px={{ base: 4, md: 8 }}
          py={2}
          className="rc-glass"
          borderRadius="full"
          width="100%"
        >
          <Flex align="center">
            <Text
              fontSize={{ base: "xl", md: "2xl" }}
              fontWeight="900"
              color="var(--rc-accent)"
              cursor="pointer"
              onClick={home}
              letterSpacing="-1px"
            >
              LearnHub
            </Text>
          </Flex>

          {!isMobile ? (
            <Flex align="center" flex={1} maxW="400px" mx={4}>
              <Flex
                w="100%"
                bg="whiteAlpha.100"
                borderRadius="full"
                align="center"
                px={4}
                border="1px solid"
                borderColor="whiteAlpha.100"
                _focusWithin={{ borderColor: "rgba(255,255,255,0.2)", bg: "whiteAlpha.200" }}
                transition="all 0.2s"
              >
                <Input
                  placeholder="Search courses..."
                  variant="unstyled"
                  fontSize="sm"
                  h="36px"
                  color="white"
                  _placeholder={{ color: "whiteAlpha.400" }}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <IconButton
                  aria-label="Search"
                  icon={<FaSearch size="14px" />}
                  variant="ghost"
                  size="sm"
                  color="whiteAlpha.600"
                  _hover={{ color: "white", bg: "transparent" }}
                  onClick={handleSearch}
                />
              </Flex>
            </Flex>
          ) : null}

          <Flex align="center" gap={6}>
            {!isMobile && (
              <Link
                fontSize="sm"
                fontWeight="600"
                color="whiteAlpha.700"
                _hover={{ color: "white" }}
                href="/Teachme"
              >
                {user.role !== 'teacher' && user.role !== 'admin' && 'Teach On LearnHub'}
              </Link>
            )}

            <Box>
              <Dropdown />
            </Box>

            {isMobile && (
              <IconButton
                aria-label="Menu"
                icon={<FaBars />}
                variant="ghost"
                color="white"
                onClick={onOpen}
              />
            )}
          </Flex>
        </Flex>
      </Container>
      <NavBarDrawer isOpen={isOpen} onOpen={onOpen} onClose={onClose} />
    </Box>
  );
};

export default Navbar;
