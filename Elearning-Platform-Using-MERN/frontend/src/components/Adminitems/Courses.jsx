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
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Table, Thead, Tbody, Tr, Th, Td } from "@chakra-ui/react";
import { AddIcon, EditIcon } from "@chakra-ui/icons";
import { useDispatch, useSelector } from "react-redux";
import convertDateFormat, {
  deleteProduct,
  getProduct,
} from "../../Redux/AdminReducer/action";
import Pagination from "./Pagination";
import AdminNavTop from "../AdminNavTop";
import Navbar from "../UserComponents/UserNavbar";

const Courses = () => {
  const store = useSelector((store) => store.AdminReducer.data);
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [order, setOrder] = useState("");
  const limit = 4;
  const tableSize = useBreakpointValue({ base: "sm", sm: "md", md: "lg" });

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

  const handleDelete = (id, title) => {
    dispatch(deleteProduct(id));
    alert(`${title} is Deleted`);
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
          <AdminNavTop handleSearch={handleSearch} />

          <Box mt={8}>
            <Flex justify="space-between" align="center" mb={10}>
              <VStack align="start" spacing={1}>
                <Heading size="lg" fontWeight="800" letterSpacing="-1px">Course Management</Heading>
                <Text color="whiteAlpha.500" fontWeight="600" fontSize="sm">Manage and monitor all platform courses</Text>
              </VStack>
              <Link to="/admin/addCourse">
                <Button
                  leftIcon={<AddIcon />}
                  bg="white"
                  color="black"
                  borderRadius="14px"
                  fontWeight="700"
                  _hover={{ bg: "whiteAlpha.900" }}
                >
                  Create Course
                </Button>
              </Link>
            </Flex>

            <Box className="rc-glass" p={6} borderRadius="32px" mb={10}>
              <Flex gap={4} mb={6}>
                <Select
                  maxW="300px"
                  bg="whiteAlpha.50"
                  borderColor="whiteAlpha.100"
                  borderRadius="12px"
                  onChange={handleSelect}
                  fontWeight="600"
                >
                  <option value="" style={{ background: '#111' }}>Sort by Price</option>
                  <option value="asc" style={{ background: '#111' }}>Price: Low to High</option>
                  <option value="desc" style={{ background: '#111' }}>Price: High to Low</option>
                </Select>
              </Flex>

              <Box overflowX="auto">
                <Table variant="simple" size={tableSize}>
                  <Thead>
                    <Tr borderColor="whiteAlpha.100">
                      <Th color="whiteAlpha.400" borderBottom="1px solid" borderColor="whiteAlpha.100">TITLE</Th>
                      <Th color="whiteAlpha.400" borderBottom="1px solid" borderColor="whiteAlpha.100">CATEGORY</Th>
                      <Th color="whiteAlpha.400" borderBottom="1px solid" borderColor="whiteAlpha.100">PRICE</Th>
                      <Th color="whiteAlpha.400" borderBottom="1px solid" borderColor="whiteAlpha.100">TEACHER</Th>
                      <Th color="whiteAlpha.400" borderBottom="1px solid" borderColor="whiteAlpha.100" textAlign="right">ACTIONS</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {store?.length > 0 &&
                      store?.map((el, i) => (
                        <Tr key={i} borderColor="whiteAlpha.50" _hover={{ bg: "whiteAlpha.50" }} transition="bg 0.2s">
                          <Td fontWeight="700" borderBottom="1px solid" borderColor="whiteAlpha.50">{el.title}</Td>
                          <Td borderBottom="1px solid" borderColor="whiteAlpha.50">
                            <Text fontSize="xs" fontWeight="800" color="var(--rc-accent)" bg="whiteAlpha.100" px={2} py={1} borderRadius="6px" display="inline-block">
                              {el.category?.toUpperCase()}
                            </Text>
                          </Td>
                          <Td fontWeight="600" borderBottom="1px solid" borderColor="whiteAlpha.50">₹{el.price}</Td>
                          <Td color="whiteAlpha.700" borderBottom="1px solid" borderColor="whiteAlpha.50">{el.teacher}</Td>
                          <Td borderBottom="1px solid" borderColor="whiteAlpha.50" textAlign="right">
                            <Flex justify="flex-end" gap={2}>
                              <Link to={`/admin/edit/${el._id}`}>
                                <IconButton
                                  size="sm"
                                  icon={<EditIcon />}
                                  variant="ghost"
                                  color="whiteAlpha.600"
                                  _hover={{ color: "white", bg: "whiteAlpha.200" }}
                                  aria-label="Edit"
                                />
                              </Link>
                              <IconButton
                                size="sm"
                                icon={<Text fontWeight="800">×</Text>}
                                variant="ghost"
                                color="red.400"
                                _hover={{ bg: "red.400/10" }}
                                onClick={() => handleDelete(el._id, el.title)}
                                aria-label="Delete"
                              />
                            </Flex>
                          </Td>
                        </Tr>
                      ))}
                  </Tbody>
                </Table>
              </Box>

              <Flex justify="space-between" align="center" mt={8} pt={6} borderTop="1px solid" borderColor="whiteAlpha.100">
                <Text fontSize="sm" fontWeight="600" color="whiteAlpha.400">
                  Showing {store?.length} courses
                </Text>
                <Flex gap={2}>
                  <Button
                    size="sm"
                    variant="ghost"
                    isDisabled={page <= 1}
                    onClick={() => handlePageButton(-1)}
                    color="whiteAlpha.600"
                    _hover={{ color: "white", bg: "whiteAlpha.100" }}
                  >
                    Previous
                  </Button>
                  <Pagination
                    totalCount={count}
                    current_page={page}
                    handlePageChange={handlePageChange}
                  />
                  <Button
                    size="sm"
                    variant="ghost"
                    isDisabled={page >= count}
                    onClick={() => handlePageButton(1)}
                    color="whiteAlpha.600"
                    _hover={{ color: "white", bg: "whiteAlpha.100" }}
                  >
                    Next
                  </Button>
                </Flex>
              </Flex>
            </Box>
          </Box>
        </Box>
      </Grid>
    </Box>
  );
};

export default Courses;
