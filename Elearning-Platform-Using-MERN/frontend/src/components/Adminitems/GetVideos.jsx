import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  Grid,
  IconButton,
  Text,
  VStack,
  Heading,
  Icon,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Table, Thead, Tbody, Tr, Th, Td } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { useDispatch, useSelector } from "react-redux";
import convertDateFormat, {
  deleteProduct,
  getProduct,
  getvideo,
} from "../../Redux/AdminReducer/action";
import Pagination from "./Pagination";
import AdminNavTop from "../AdminNavTop";

const GetVideos = () => {
  const store = useSelector((store) => store.AdminReducer.videos);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const limit = 4;

  const user = JSON.parse(localStorage.getItem('user'))

  useEffect(() => {
    dispatch(getvideo(page, limit, user));
  }, [page, limit]);

  const handleDelete = (id, title) => {
    dispatch(deleteProduct(id));
    alert(`${title} is Deleted`);
  };

  const handlePageChange = (page) => {
    setPage(page);
  };

  const count = Math.ceil(store.length / limit);

  const handlePageButton = (val) => {
    setPage((prev) => prev + val);
  };

  return (
    <Box minH="100vh" bg="var(--rc-bg)" color="var(--rc-fg)">
      <Grid w="100%">
        <Box pt="100px" px={8} pb={10} maxW="container.xl" mx="auto">
          <AdminNavTop />

          <Box mt={12}>
            <Flex justify="space-between" align="end" mb={10}>
              <VStack align="start" spacing={1}>
                <Heading size="xl" fontWeight="900" letterSpacing="-1.5px">Course Videos</Heading>
                <Text color="whiteAlpha.500" fontWeight="600">Inventory of all uploaded video lessons</Text>
              </VStack>
            </Flex>

            <Box className="rc-glass" borderRadius="32px" overflow="hidden">
              <Table variant="simple" sx={{ borderCollapse: 'separate', borderSpacing: '0 8px' }}>
                <Thead bg="whiteAlpha.50">
                  <Tr>
                    <Th color="whiteAlpha.400" border="none" py={6} px={8} fontSize="xs" fontWeight="800">TITLE</Th>
                    <Th color="whiteAlpha.400" border="none" py={6} px={8} fontSize="xs" fontWeight="800">UPLOADED</Th>
                    <Th color="whiteAlpha.400" border="none" py={6} px={8} fontSize="xs" fontWeight="800">DESCRIPTION</Th>
                    <Th color="whiteAlpha.400" border="none" py={6} px={8} fontSize="xs" fontWeight="800">VIEWS</Th>
                    <Th color="whiteAlpha.400" border="none" py={6} px={8} fontSize="xs" fontWeight="800">LINK</Th>
                    <Th color="whiteAlpha.400" border="none" py={6} px={8} fontSize="xs" fontWeight="800" textAlign="right">ACTIONS</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {store.length > 0 &&
                    store.map((el, i) => (
                      <Tr key={i} _hover={{ bg: "whiteAlpha.50" }} transition="background 0.2s">
                        <Td border="none" py={6} px={8} fontWeight="700">{el.title}</Td>
                        <Td border="none" py={6} px={8} color="whiteAlpha.600" fontSize="sm">{convertDateFormat(el.createdAt)}</Td>
                        <Td border="none" py={6} px={8} color="whiteAlpha.600" fontSize="sm" maxW="200px" isTruncated>{el.description}</Td>
                        <Td border="none" py={6} px={8} fontWeight="800" color="var(--rc-accent)">{el.views}</Td>
                        <Td border="none" py={6} px={8} fontSize="xs" color="blue.300" textDecoration="underline" isTruncated maxW="150px">
                          <a href={el.link} target="_blank" rel="noreferrer">{el.link}</a>
                        </Td>
                        <Td border="none" py={6} px={8} textAlign="right">
                          <Link to={`/admin/videos/add/${el.courseId}`}>
                            <Button
                              size="sm"
                              variant="ghost"
                              leftIcon={<Icon as={AddIcon} />}
                              borderRadius="10px"
                              fontWeight="800"
                              _hover={{ bg: "whiteAlpha.200", color: "white" }}
                            >
                              Add New
                            </Button>
                          </Link>
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


export default GetVideos;
