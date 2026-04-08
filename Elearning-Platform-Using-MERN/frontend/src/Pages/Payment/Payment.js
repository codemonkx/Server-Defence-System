import { Button } from "@chakra-ui/button";
import { useDisclosure } from "@chakra-ui/hooks";
import { Box, Flex, Heading, Text, VStack } from "@chakra-ui/layout";
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/modal";
import DynamicSelect from "./DynamicSelect";
import { Radio } from "@chakra-ui/radio";
import { BsFillCreditCardFill } from "react-icons/bs";
import { RiVisaFill } from "react-icons/ri";
import { FaCcMastercard, FaWallet } from "react-icons/fa";
import { SiMastercard, SiAmericanexpress, SiFlutter } from "react-icons/si";
import { AiTwotoneBank } from "react-icons/ai";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { capitalizeFirstLetter } from "../../Redux/UserReducer/action";
import { useParams } from "react-router";
import { Input, keyframes, useToast } from "@chakra-ui/react";
import { showToast } from "../../components/SignUp";

export default function Payment({ isOpen, onOpen, onClose }) {
  const { id } = useParams();
  const courseId = id;
  const upiRef = useRef(null);
  const [input, setinput] = useState("");

  let baseURL = "https://elearning-platform-using-mern-j5py.vercel.app";
  const token = JSON.parse(localStorage.getItem("user"))?.token || "";

  const [course, setCourse] = useState({});
  const vpiRef = useRef(null);
  const toast = useToast();

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await axios.get(`${baseURL}/courses/${courseId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCourse(res.data.course);
      } catch (err) {
        console.log(err);
      }
    };

    if (isOpen) fetchCourse();
  }, [isOpen, courseId]);

  function showUPI() {
    upiRef.current.style.display = "block";
  }

  function blockUPI() {
    upiRef.current.style.display = "none";
  }

  function handleInput(e) {
    setinput(e.target.value);
  }

  function handlePayment() {
    axios
      .post(
        `${baseURL}/users/addCourse/${courseId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        showToast({
          toast,
          message: res?.data?.message || res?.data?.msg,
          color: "green",
        });
        onClose();
      })
      .catch((err) => {
        showToast({
          toast,
          message: err?.response?.data?.error || err?.message,
          color: "red",
        });
        onClose();
      });
    setinput("");
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay backdropFilter="blur(10px)" bg="blackAlpha.700" />
      <ModalContent
        className="rc-glass"
        color="var(--rc-fg)"
        borderRadius="32px"
        overflow="hidden"
        mt="100px"
      >
        <ModalHeader borderBottom="1px solid" borderColor="whiteAlpha.100" py={6} px={8}>
          <Heading size="md" fontWeight="800" letterSpacing="-0.5px">Secure Checkout</Heading>
        </ModalHeader>
        <ModalCloseButton mt={4} mr={4} />

        <ModalBody p={8}>
          <VStack spacing={8} align="stretch">
            <Box>
              <Flex justify="space-between" align="end" mb={6}>
                <VStack align="start" spacing={1}>
                  <Text fontSize="xs" fontWeight="700" color="whiteAlpha.400" letterSpacing="1px">ORDER SUMMARY</Text>
                  <Heading size="md" fontWeight="800">{capitalizeFirstLetter(course?.title)}</Heading>
                  <Text fontSize="sm" color="whiteAlpha.600">by {capitalizeFirstLetter(course?.teacher)}</Text>
                </VStack>
                <Box textAlign="right">
                  <Text fontSize="xs" fontWeight="700" color="whiteAlpha.400" mb={1}>TOTAL</Text>
                  <Heading size="xl" color="var(--rc-accent)" fontWeight="900">₹{course?.price}</Heading>
                </Box>
              </Flex>

              <Box p={4} borderRadius="20px" bg="whiteAlpha.50" border="1px solid" borderColor="whiteAlpha.100">
                <Text fontSize="sm" fontWeight="600" color="whiteAlpha.800">
                  Includes {course?.videos?.length || 1} lesson modules with lifetime access.
                </Text>
              </Box>
            </Box>

            <Box>
              <Text fontSize="xs" fontWeight="700" color="whiteAlpha.400" mb={4} letterSpacing="1px">PAYMENT METHOD</Text>

              <Box
                className="rc-glass"
                p={4}
                borderRadius="24px"
                cursor="pointer"
                onClick={showUPI}
                _hover={{ bg: "whiteAlpha.100" }}
                transition="all 0.2s"
              >
                <Flex align="center" justify="space-between">
                  <Flex align="center" gap={4}>
                    <Box p={3} bg="#43A047CC" borderRadius="12px">
                      <SiFlutter color="white" size="20px" />
                    </Box>
                    <Box>
                      <Heading size="xs" fontWeight="800">UPI Payment</Heading>
                      <Text fontSize="xs" color="whiteAlpha.500">Pay via Google Pay, PhonePe, or Paytm</Text>
                    </Box>
                  </Flex>
                  <Radio isChecked borderColor="whiteAlpha.300" colorScheme="red" />
                </Flex>
              </Box>

              <Box
                ref={upiRef}
                display="none"
                mt={4}
                p={6}
                bg="whiteAlpha.50"
                borderRadius="24px"
                border="1px solid"
                borderColor="whiteAlpha.100"
              >
                <VStack align="start" spacing={4}>
                  <Box w="100%">
                    <Text fontSize="xs" fontWeight="700" color="whiteAlpha.400" mb={2}>VIRTUAL PAYMENT ADDRESS (VPA)</Text>
                    <Input
                      placeholder="username@upi"
                      bg="blackAlpha.300"
                      border="1px solid"
                      borderColor="whiteAlpha.200"
                      borderRadius="12px"
                      h="50px"
                      _placeholder={{ color: "whiteAlpha.300" }}
                      _focus={{ borderColor: "var(--rc-accent)", bg: "blackAlpha.500" }}
                      onChange={handleInput}
                      value={input}
                    />
                  </Box>
                  <Text fontSize="xs" color="whiteAlpha.500" fontStyle="italic">
                    Example: name@okaxis, 9876543210@paytm
                  </Text>
                  <Button size="xs" variant="link" color="whiteAlpha.400" onClick={blockUPI}>
                    Show less
                  </Button>
                </VStack>
              </Box>
            </Box>

            <Text fontSize="10px" color="whiteAlpha.300" textAlign="center" px={4}>
              By completing your purchase, you agree to LearnHub's Terms of Service and Privacy Policy.
              Taxes may apply based on your location.
            </Text>
          </VStack>
        </ModalBody>

        <ModalFooter p={8} gap={4}>
          <Button
            variant="ghost"
            color="whiteAlpha.600"
            borderRadius="16px"
            h="56px"
            flex="1"
            _hover={{ bg: "whiteAlpha.100", color: "white" }}
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            onClick={handlePayment}
            isDisabled={!input.includes("@")}
            bg="white"
            color="black"
            borderRadius="16px"
            h="56px"
            flex="2"
            fontWeight="800"
            _hover={{ bg: "whiteAlpha.900", transform: "translateY(-1px)" }}
            _active={{ transform: "translateY(0)" }}
          >
            Complete Purchase
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
