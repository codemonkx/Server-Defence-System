import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  Grid,
  IconButton,
  Select,
  Text,
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
  deleteUsers,
  getUser,
} from "../../Redux/AdminReducer/action";
import Pagination from "./Pagination";
import AdminNavTop from "../AdminNavTop";

const Users = () => {
  const store = useSelector((store) => store.AdminReducer.users);
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
    dispatch(getUser(page, limit));
  }, [page]);

  const handleDelete = (id, name) => {
    dispatch(deleteUsers(id));
    alert(`${name} is Deleted`);
  };

  const handlePageChange = (page) => {
    setPage(page);
  };
  const count = 2;

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
                <Heading size="lg" fontWeight="800" letterSpacing="-1px">User Management</Heading>
                <Text color="whiteAlpha.500" fontWeight="600" fontSize="sm">Manage platform members and their roles</Text>
              </VStack>
              <Link to="/admin/users/add">
                <Button
                  leftIcon={<AddIcon />}
                  bg="white"
                  color="black"
                  borderRadius="14px"
                  fontWeight="700"
                  _hover={{ bg: "whiteAlpha.900" }}
                >
                  Add user
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
                  <option value="" style={{ background: '#111' }}>Sort by Age</option>
                  <option value="asc" style={{ background: '#111' }}>Age: Youngest First</option>
                  <option value="desc" style={{ background: '#111' }}>Age: Oldest First</option>
                </Select>
              </Flex>

              <Box overflowX="auto">
                <Table variant="simple">
                  <Thead>
                    <Tr borderColor="whiteAlpha.100">
                      <Th color="whiteAlpha.400" borderBottom="1px solid" borderColor="whiteAlpha.100">NAME</Th>
                      <Th color="whiteAlpha.400" borderBottom="1px solid" borderColor="whiteAlpha.100">ROLE</Th>
                      <Th color="whiteAlpha.400" borderBottom="1px solid" borderColor="whiteAlpha.100">EMAIL</Th>
                      <Th color="whiteAlpha.400" borderBottom="1px solid" borderColor="whiteAlpha.100">CITY</Th>
                      <Th color="whiteAlpha.400" borderBottom="1px solid" borderColor="whiteAlpha.100">AGE</Th>
                      <Th color="whiteAlpha.400" borderBottom="1px solid" borderColor="whiteAlpha.100" textAlign="right">ACTIONS</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {store?.length > 0 &&
                      store?.map((el, i) => (
                        <Tr key={i} borderColor="whiteAlpha.50" _hover={{ bg: "whiteAlpha.50" }} transition="bg 0.2s">
                          <Td fontWeight="700" borderBottom="1px solid" borderColor="whiteAlpha.50" dangerouslySetInnerHTML={{ __html: el.name }} />
                          <Td borderBottom="1px solid" borderColor="whiteAlpha.50">
                            <Text fontSize="xs" fontWeight="800" color={el.role === 'admin' ? 'purple.300' : 'blue.300'} bg="whiteAlpha.100" px={2} py={1} borderRadius="6px" display="inline-block">
                              {el.role?.toUpperCase()}
                            </Text>
                          </Td>
                          <Td color="whiteAlpha.700" borderBottom="1px solid" borderColor="whiteAlpha.50">{el.email}</Td>
                          <Td borderBottom="1px solid" borderColor="whiteAlpha.50">{el.city}</Td>
                          <Td fontWeight="600" borderBottom="1px solid" borderColor="whiteAlpha.50">{el.age}</Td>
                          <Td borderBottom="1px solid" borderColor="whiteAlpha.50" textAlign="right">
                            <Flex justify="flex-end" gap={2}>
                              <Link to={`/admin/users/edit/${el._id}`}>
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
                                onClick={() => handleDelete(el._id, el.name)}
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
                  Showing {store?.length} users
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

export default Users;
