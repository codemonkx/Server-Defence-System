import { Box, Flex, Grid, Text, VStack, Heading, Icon } from "@chakra-ui/react";
import React from "react";
import { Bar, Line, Pie } from "react-chartjs-2";
import AdminNavTop from "../AdminNavTop";

const Statistics = () => {
  // Chart.js defaults for dark mode
  const chartOptions = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: 'rgba(255, 255, 255, 0.6)',
          font: { weight: '700', family: 'Inter' }
        }
      }
    },
    scales: {
      x: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: 'rgba(255, 255, 255, 0.4)' }
      },
      y: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: 'rgba(255, 255, 255, 0.4)' }
      }
    }
  };

  const data = {
    labels: ["January", "February", "March", "April", "May", "June"],
    datasets: [
      {
        label: "Subscribers",
        data: [100, 200, 150, 250, 300, 200],
        fill: true,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderColor: "var(--rc-accent)",
        tension: 0.4,
      },
    ],
  };

  const datapie1 = {
    labels: ["Full Stack", "Frontend", "Backend"],
    datasets: [
      {
        data: [300, 50, 100],
        backgroundColor: ["#818CF8", "#F472B6", "#10B981"],
        borderWidth: 0,
        hoverOffset: 10
      },
    ],
  };

  const databar = {
    labels: ["January", "February", "March", "April", "May", "June"],
    datasets: [
      {
        label: "Courses Published",
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        borderColor: "rgba(255, 255, 255, 0.2)",
        borderWidth: 1,
        borderRadius: 8
      },
    ],
  };

  return (
    <Box minH="100vh" bg="var(--rc-bg)" color="var(--rc-fg)">
      <Grid w="100%">
        <Box pt="100px" px={8} pb={10} maxW="container.xl" mx="auto">
          <AdminNavTop />

          <Box mt={12}>
            <VStack align="start" spacing={1} mb={10}>
              <Heading size="xl" fontWeight="900" letterSpacing="-1.5px">Platform Insights</Heading>
              <Text color="whiteAlpha.500" fontWeight="600">Visual analytics and growth metrics</Text>
            </VStack>

            <Grid templateColumns={{ base: "1fr", lg: "repeat(2, 1fr)" }} gap={10} mb={10}>
              <Box className="rc-glass" p={8} borderRadius="32px">
                <Heading size="sm" fontWeight="800" color="whiteAlpha.400" mb={6} textTransform="uppercase" letterSpacing="1px">
                  Subscriber Growth
                </Heading>
                <Box h="300px">
                  <Line data={data} options={chartOptions} />
                </Box>
              </Box>

              <Box className="rc-glass" p={8} borderRadius="32px">
                <Heading size="sm" fontWeight="800" color="whiteAlpha.400" mb={6} textTransform="uppercase" letterSpacing="1px">
                  Course Distribution
                </Heading>
                <Box h="300px">
                  <Pie data={datapie1} options={{ ...chartOptions, scales: undefined }} />
                </Box>
              </Box>
            </Grid>

            <Box className="rc-glass" p={8} borderRadius="32px">
              <Heading size="sm" fontWeight="800" color="whiteAlpha.400" mb={6} textTransform="uppercase" letterSpacing="1px">
                Monthly Content Velocity
              </Heading>
              <Box h="300px">
                <Bar data={databar} options={chartOptions} />
              </Box>
            </Box>
          </Box>
        </Box>
      </Grid>
    </Box>
  );
};


export default Statistics;
