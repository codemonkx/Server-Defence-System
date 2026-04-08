import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  Grid,
  IconButton,
  Select,
  Text,
  useBreakpointValue,
  VStack,
  Heading,
  HStack,
  Tag
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Table, Thead, Tbody, Tr, Th, Td } from "@chakra-ui/react";
import { AddIcon, EditIcon } from "@chakra-ui/icons";
import { useDispatch, useSelector } from "react-redux";
import convertDateFormat, {
  deleteProduct,
  getProduct,
} from "../../Redux/TeacherReducer/action";
import Pagination from "../Adminitems/Pagination";
import TeacherNavTop from "./TeacherNavTop";
import Navbar from "../UserComponents/UserNavbar";

const AddTeacher = () => {
  const store = useSelector((store) => store.TeacherReducer.data);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [order, setOrder] = useState("");
  const limit = 4;

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleSelect = (e) => {
    const { value } = e.target;
    setOrder(value);
  };

  useEffect(() => {
    dispatch(getProduct(page, limit, search, order));
  }, [page, search, order, limit]);

  const handleVideos = (id, title) => {
    navigate(`/Teacher/videos/add/${id}`, { state: { id, title } });
  };

  const handlePageChange = (page) => {
    setPage(page);
  };

  const count = 4;

  const handlePageButton = (val) => {
    setPage((prev) => prev + val);
  };

  return (
    <Box minH="100vh" bg="var(--rc-bg)" color="var(--rc-fg)">
      <Grid w="100%">
        <Box pt="100px" px={8} pb={10} maxW="container.xl" mx="auto">
          <TeacherNavTop handleSearch={handleSearch} />

          <Box mt={12}>
            <Flex justify="space-between" align="end" mb={10}>
              <VStack align="start" spacing={1}>
                <Heading size="xl" fontWeight="900" letterSpacing="-1.5px">Teacher Catalog</Heading>
                <Text color="whiteAlpha.500" fontWeight="600">Inventory and management of your teaching materials</Text>
              </VStack>

              <HStack spacing={4}>
                <Select
                  placeholder="Filter by Pricing"
                  bg="blackAlpha.300"
                  border="1px solid"
                  borderColor="whiteAlpha.100"
                  borderRadius="14px"
                  h="48px"
                  w="240px"
                  onChange={handleSelect}
                  _focus={{ borderColor: "var(--rc-accent)" }}
                >
                  <option value="asc">Price: Low to High</option>
                  <option value="desc">Price: High to Low</option>
                </Select>

                <Link to="/Teacher/addCourse">
                  <Button
                    bg="white"
                    color="black"
                    h="48px"
                    px={8}
                    borderRadius="14px"
                    fontWeight="800"
                    _hover={{ bg: "whiteAlpha.900", transform: "translateY(-2px)" }}
                    _active={{ transform: "translateY(0)" }}
                  >
                    Start New Course
                  </Button>
                </Link>
              </HStack>
            </Flex>

            <Box className="rc-glass" borderRadius="32px" overflow="hidden">
              <Table variant="simple" sx={{ borderCollapse: 'separate', borderSpacing: '0 8px' }}>
                <Thead bg="whiteAlpha.50">
                  <Tr>
                    <Th color="whiteAlpha.400" border="none" py={6} px={8} fontSize="xs" fontWeight="800">TITLE</Th>
                    <Th color="whiteAlpha.400" border="none" py={6} px={8} fontSize="xs" fontWeight="800">LAST UPDATED</Th>
                    <Th color="whiteAlpha.400" border="none" py={6} px={8} fontSize="xs" fontWeight="800">DOMAIN</Th>
                    <Th color="whiteAlpha.400" border="none" py={6} px={8} fontSize="xs" fontWeight="800">DESCRIPTION</Th>
                    <Th color="whiteAlpha.400" border="none" py={6} px={8} fontSize="xs" fontWeight="800">ENROLLMENT FEE</Th>
                    <Th color="whiteAlpha.400" border="none" py={6} px={8} fontSize="xs" fontWeight="800" textAlign="right">ACTIONS</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {store?.length > 0 &&
                    store?.map((el, i) => (
                      <Tr key={i} _hover={{ bg: "whiteAlpha.50" }} transition="background 0.2s">
                        <Td border="none" py={6} px={8} fontWeight="700">{el.title}</Td>
                        <Td border="none" py={6} px={8} color="whiteAlpha.600" fontSize="sm">{convertDateFormat(el.createdAt)}</Td>
                        <Td border="none" py={6} px={8}>
                          <Tag size="sm" variant="subtle" colorScheme="indigo" borderRadius="full" px={3}>
                            {el.category}
                          </Tag>
                        </Td>
                        <Td border="none" py={6} px={8} color="whiteAlpha.600" fontSize="sm" maxW="200px" isTruncated>{el.description}</Td>
                        <Td border="none" py={6} px={8} fontWeight="800" color="var(--rc-accent)">${el.price}</Td>
                        <Td border="none" py={6} px={8} textAlign="right">
                          <Button
                            size="sm"
                            variant="ghost"
                            leftIcon={<AddIcon />}
                            onClick={() => handleVideos(el._id, el.title)}
                            borderRadius="10px"
                            fontWeight="800"
                            _hover={{ bg: "whiteAlpha.200", color: "white" }}
                          >
                            Manage Content
                          </Button>
                        </Td>
                      </Tr>
                    ))}
                </Tbody>
              </Table>
            </Box>

            <Flex justify="center" align="center" mt={10} gap={6}>
              <Button
                variant="ghost"
                isDisabled={page <= 1}
                onClick={() => handlePageButton(-1)}
                borderRadius="14px"
                fontWeight="800"
                _hover={{ bg: "whiteAlpha.100" }}
              >
                Previous
              </Button>
              <Pagination
                totalCount={count}
                current_page={page}
                handlePageChange={handlePageChange}
              />
              <Button
                variant="ghost"
                isDisabled={page >= count}
                onClick={() => handlePageButton(1)}
                borderRadius="14px"
                fontWeight="800"
                _hover={{ bg: "whiteAlpha.100" }}
              >
                Next
              </Button>
            </Flex>
          </Box>
        </Box>
      </Grid>
    </Box>
  );
};

export default AddTeacher;
