import React from "react";
import {
  Flex,
  Box,
  Button,
  IconButton,
  useBreakpointValue,
  Text,
  Link,
  useDisclosure,
  Container,
  Stack,
  Collapse,
  Icon,
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@chakra-ui/react";
import {
  HamburgerIcon,
  CloseIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import { NavBarDrawer } from "../components/NavBarDrawer";

const Navbar = () => {
  const isMobile = useBreakpointValue({ base: true, lg: false });
  const { isOpen, onToggle, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();

  return (
    <Box position="fixed" top="0" w="100%" zIndex="1000" pt={4} px={4}>
      <Container maxW="container.lg">
        <Flex
          className="rc-glass"
          minH={'60px'}
          py={{ base: 2 }}
          px={{ base: 4, md: 6 }}
          align={'center'}
          borderRadius="full"
          justify="space-between"
        >
          <Flex align="center">
            <Text
              fontFamily={'Inter'}
              fontWeight="800"
              color={'white'}
              fontSize="2xl"
              cursor="pointer"
              onClick={() => navigate('/')}
              letterSpacing="-0.02em"
              className="rc-text-gradient"
            >
              LearnHub
            </Text>

            {!isMobile && (
              <Flex ml={10}>
                <DesktopNav />
              </Flex>
            )}
          </Flex>

          <Stack
            flex={{ base: 1, md: 0 }}
            justify={'flex-end'}
            direction={'row'}
            spacing={4}
            align="center"
          >
            {!isMobile && (
              <Button
                as={'a'}
                fontSize={'sm'}
                fontWeight={500}
                variant={'link'}
                color="whiteAlpha.800"
                onClick={() => navigate('/login')}
                _hover={{ color: 'white', textDecoration: 'none' }}
                cursor="pointer"
              >
                Log In
              </Button>
            )}
            <Button
              fontSize={'sm'}
              fontWeight={600}
              color={'white'}
              bg={'var(--rc-accent)'}
              px={6}
              borderRadius="full"
              onClick={() => navigate('/signup')}
              _hover={{
                opacity: 0.9,
                transform: 'translateY(-1px)',
                bg: 'red.400'
              }}
              _active={{ transform: 'translateY(0)' }}
              transition="all 0.2s"
            >
              Join Free
            </Button>
            {isMobile && (
              <IconButton
                onClick={onOpen}
                icon={<HamburgerIcon w={5} h={5} />}
                variant={'ghost'}
                aria-label={'Toggle Navigation'}
                color="white"
                _hover={{ bg: 'whiteAlpha.200' }}
              />
            )}
          </Stack>
        </Flex>
      </Container>
      <NavBarDrawer
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
      />
    </Box>
  );
};

const DesktopNav = () => {
  const navigate = useNavigate();
  const linkColor = 'whiteAlpha.700';
  const linkHoverColor = 'white';
  const popoverContentBgColor = 'var(--rc-gray-100)';

  return (
    <Stack direction={'row'} spacing={8}>
      {NAV_ITEMS.map((navItem) => (
        <Box key={navItem.label}>
          <Popover trigger={'hover'} placement={'bottom-start'}>
            <PopoverTrigger>
              <Link
                p={2}
                onClick={() => {
                  if (navItem.href) {
                    navItem.href.startsWith('#')
                      ? document.getElementById(navItem.href.substring(1))?.scrollIntoView({ behavior: 'smooth' })
                      : navigate(navItem.href);
                  }
                }}
                fontSize={'sm'}
                fontWeight={500}
                color={linkColor}
                cursor="pointer"
                _hover={{
                  textDecoration: 'none',
                  color: linkHoverColor,
                }}
              >
                {navItem.label}
              </Link>
            </PopoverTrigger>

            {navItem.children && (
              <PopoverContent
                border={0}
                boxShadow={'xl'}
                bg={popoverContentBgColor}
                p={4}
                rounded={'xl'}
                minW={'sm'}
                className="rc-glass"
              >
                <Stack>
                  {navItem.children.map((child) => (
                    <DesktopSubNav key={child.label} {...child} />
                  ))}
                </Stack>
              </PopoverContent>
            )}
          </Popover>
        </Box>
      ))}
    </Stack>
  );
};

const DesktopSubNav = ({ label, href, subLabel }) => {
  const navigate = useNavigate();
  return (
    <Box
      onClick={() => {
        if (href.startsWith('/#')) {
          navigate('/');
          setTimeout(() => {
            document.getElementById(href.substring(2))?.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        } else {
          navigate(href);
        }
      }}
      role={'group'}
      display={'block'}
      p={2}
      rounded={'md'}
      cursor="pointer"
      _hover={{ bg: 'whiteAlpha.100' }}
    >
      <Stack direction={'row'} align={'center'}>
        <Box>
          <Text
            transition={'all .3s ease'}
            fontWeight={500}
            color="white"
          >
            {label}
          </Text>
          <Text fontSize={'xs'} color="whiteAlpha.600">{subLabel}</Text>
        </Box>
        <Flex
          transition={'all .3s ease'}
          transform={'translateX(-10px)'}
          opacity={0}
          _groupHover={{ opacity: '100%', transform: 'translateX(0)' }}
          justify={'flex-end'}
          align={'center'}
          flex={1}
        >
          <Icon color={'var(--rc-accent)'} w={5} h={5} as={ChevronRightIcon} />
        </Flex>
      </Stack>
    </Box>
  );
};

const NAV_ITEMS = [
  {
    label: 'Explore',
    children: [
      {
        label: 'Trending Courses',
        subLabel: 'Find what everyone is learning',
        href: '/#trending-courses',
      },
      {
        label: 'New Releases',
        subLabel: 'Latest additions to our catalog',
        href: '/new-releases',
      },
    ],
  },
  {
    label: 'For Business',
    href: '/for-business',
  },
  {
    label: 'Become a Teacher',
    href: '/become-a-teacher',
  },
];

export default Navbar;
