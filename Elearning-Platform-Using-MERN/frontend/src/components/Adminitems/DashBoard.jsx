import { Box, Flex, Grid, Icon, Text, VStack, Heading, Badge } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { Bar, Pie } from "react-chartjs-2";
import Chart from "chart.js/auto";
import AdminNavTop from "../AdminNavTop";
import { BiMale } from "react-icons/bi";
import { FaVideo } from "react-icons/fa";
import { FiBook } from "react-icons/fi";
import { FiFilm, FiUserPlus } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { getUser } from "../../Redux/AdminReducer/action";

const DashBoard = () => {
  console.log("🔍 DEBUG: DashBoard Component Mounted");
  const dispatch = useDispatch();
  const users = useSelector((store) => store.AdminReducer.users);

  useEffect(() => {
    dispatch(getUser(1, 10)); // Fetch latest users (backend now sorts by newest)
  }, [dispatch]);

  const adminEmail = JSON.parse(localStorage.getItem('user'))?.email || "";
  const filteredUsers = users?.filter(u => u.email !== adminEmail) || [];
  const latestUser = filteredUsers?.[0] || { name: "No recent signups" };

  const data = {
    labels: ["January", "February", "March", "April", "May", "June"],
    datasets: [
      {
        label: "Courses",
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: "rgba(235, 50, 90, 0.6)",
        borderColor: "rgba(75,192,192,1)",
        borderWidth: 1,
      },
    ],
  };
  const datapie = {
    labels: ["Full Stack", "Frontend", "Backend"],
    datasets: [
      {
        data: [300, 50, 100],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
        hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
      },
    ],
  };
  const datapie1 = {
    labels: ["live", "recorded", "offline"],
    datasets: [
      {
        data: [300, 50, 100],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
        hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
      },
    ],
  };

  return (
    <Box>
      <Grid className="Nav" h={"99vh"} w="94%" gap={10}>
        <Box>
          {/* <AdminSidebar /> */}
        </Box>
        <Box pt="100px" px={8} pb={10}>
          <AdminNavTop />
          {/* Stats Grid */}
          <Grid
            templateColumns={{
              base: "1fr",
              md: "repeat(2, 1fr)",
              xl: "repeat(4, 1fr)",
            }}
            gap={6}
            mb={10}
          >
            {[
              { label: "Total Subscribers", value: "2,344", icon: BiMale, change: "+14%" },
              { label: "Total Videos", value: "5,123", icon: FaVideo, change: "+60%" },
              { label: "Total Courses", value: "1,200", icon: FiBook, change: "+5%" },
              { label: "Latest Member", value: latestUser.name, icon: FiUserPlus, change: "NEW", isXSS: true },
            ].map((stat, i) => (
              <Box
                key={i}
                className="rc-glass"
                p={6}
                borderRadius="24px"
                boxShadow="0 10px 20px rgba(0,0,0,0.2)"
                transition="transform 0.2s"
                _hover={{ transform: "translateY(-4px)" }}
              >
                <Flex justify="space-between" align="start">
                  <VStack align="start" spacing={1}>
                    <Text fontSize="sm" fontWeight="700" color="whiteAlpha.500" letterSpacing="1px">
                      {stat.label.toUpperCase()}
                    </Text>
                    {stat.isXSS ? (
                      <Box mt={2}>
                        {latestUser._id ? (
                           <div dangerouslySetInnerHTML={{ __html: stat.value }} style={{ fontWeight: 800, fontSize: '1.2rem' }} />
                        ) : (
                           <Text color="orange.300" fontWeight="800">No Data Found</Text>
                        )}
                      </Box>
                    ) : (
                      <Heading size="lg" fontWeight="800">
                        {stat.value}
                      </Heading>
                    )}
                  </VStack>
                  <Icon as={stat.icon} boxSize={6} color="var(--rc-accent)" />
                </Flex>
                <Flex mt={4} align="center">
                  <Text fontSize="xs" fontWeight="800" color="green.400" bg="green.400/10" px={2} py={0.5} borderRadius="full">
                    {stat.change}
                  </Text>
                  <Text ml={2} fontSize="xs" fontWeight="600" color="whiteAlpha.400">
                    Since last month
                  </Text>
                </Flex>
              </Box>
            ))}
          </Grid>

          {/* Charts Section */}
          <Grid
            templateColumns={{ base: "1fr", xl: "2fr 1.5fr" }}
            gap={8}
          >
            <Box className="rc-glass" p={8} borderRadius="32px">
              <Text fontSize="xl" fontWeight="800" mb={6} letterSpacing="-0.5px">
                Monthly Performance
              </Text>
              <Box height="300px">
                <Bar data={data} options={{
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { display: false }
                  },
                  scales: {
                    y: { grid: { color: 'rgba(255,255,255,0.05)' } },
                    x: { grid: { display: false } }
                  }
                }} />
              </Box>
            </Box>

            <VStack spacing={8} align="stretch">
              <Box className="rc-glass" p={8} borderRadius="32px">
                <Text fontSize="lg" fontWeight="800" mb={6} letterSpacing="-0.5px">
                  Course Distribution
                </Text>
                <Box height="200px">
                  <Pie data={datapie} options={{ maintainAspectRatio: false }} />
                </Box>
              </Box>
              <Box className="rc-glass" p={8} borderRadius="32px">
                <Text fontSize="lg" fontWeight="800" mb={6} letterSpacing="-0.5px">
                  Video Categories
                </Text>
                <Box height="200px">
                  <Pie data={datapie1} options={{ maintainAspectRatio: false }} />
                </Box>
              </Box>
            </VStack>
          </Grid>
        </Box>
      </Grid>
    </Box>
  );
};

export default DashBoard;
