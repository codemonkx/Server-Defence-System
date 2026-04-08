import React, { useEffect, useState, useCallback } from "react";
import {
  Box, Flex, Grid, Heading, Text, VStack, Badge,
  Table, Thead, Tbody, Tr, Th, Td, IconButton,
  Spinner, Tabs, TabList, TabPanels, Tab, TabPanel,
  CircularProgress, CircularProgressLabel, SimpleGrid,
} from "@chakra-ui/react";
import { RepeatIcon } from "@chakra-ui/icons";
import AdminNavTop from "../AdminNavTop";
import { API_BASE_URL } from "../../config";

const getToken = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  return user?.token || "";
};

const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

const statusColor = (code) => {
  if (!code) return "gray";
  if (code >= 500) return "red";
  if (code >= 400) return "orange";
  if (code >= 300) return "yellow";
  return "green";
};

const fmt = (date) => date ? new Date(date).toLocaleString() : "—";
const fmtBytes = (b) => {
  if (!b) return "0 B";
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / 1024 / 1024).toFixed(2)} MB`;
};

// ── Stat Card ──────────────────────────────────────────────────────────────
const StatCard = ({ label, value, sub, color = "white" }) => (
  <Box
    className="rc-glass"
    p={5}
    borderRadius="20px"
    transition="transform 0.2s"
    _hover={{ transform: "translateY(-3px)" }}
  >
    <Text fontSize="10px" fontWeight="700" color="whiteAlpha.400" letterSpacing="1.5px" mb={1}>
      {label.toUpperCase()}
    </Text>
    <Heading size="md" fontWeight="800" color={color} isTruncated>
      {value ?? "—"}
    </Heading>
    {sub && <Text fontSize="xs" color="whiteAlpha.400" fontWeight="600" mt={1}>{sub}</Text>}
  </Box>
);

// ── Gauge Card ─────────────────────────────────────────────────────────────
const GaugeCard = ({ label, percent, detail }) => {
  const pct = parseFloat(percent) || 0;
  const color = pct > 85 ? "red.400" : pct > 60 ? "orange.400" : "green.400";
  return (
    <Box className="rc-glass" p={6} borderRadius="24px" textAlign="center">
      <Text fontSize="10px" fontWeight="700" color="whiteAlpha.400" letterSpacing="1.5px" mb={4}>
        {label.toUpperCase()}
      </Text>
      <CircularProgress value={pct} color={color} trackColor="whiteAlpha.100" size="90px" thickness="8px">
        <CircularProgressLabel fontWeight="800" fontSize="sm">{pct.toFixed(0)}%</CircularProgressLabel>
      </CircularProgress>
      {detail && <Text fontSize="xs" color="whiteAlpha.400" fontWeight="600" mt={3}>{detail}</Text>}
    </Box>
  );
};

// ── Mini Table ─────────────────────────────────────────────────────────────
const MiniBreakdown = ({ title, data }) => (
  <Box className="rc-glass" p={5} borderRadius="20px">
    <Text fontSize="xs" fontWeight="700" color="whiteAlpha.400" letterSpacing="1px" mb={4}>
      {title.toUpperCase()}
    </Text>
    <VStack align="stretch" spacing={2}>
      {Object.entries(data || {}).map(([k, v]) => (
        <Flex key={k} justify="space-between" align="center">
          <Badge colorScheme={statusColor(parseInt(k))} borderRadius="6px" fontWeight="800" fontSize="xs">
            {k}
          </Badge>
          <Text fontWeight="700" fontSize="sm">{v}</Text>
        </Flex>
      ))}
      {Object.keys(data || {}).length === 0 && (
        <Text fontSize="xs" color="whiteAlpha.400">No data yet</Text>
      )}
    </VStack>
  </Box>
);

// ── Main Component ─────────────────────────────────────────────────────────
const LogsDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loginLogs, setLoginLogs] = useState([]);
  const [requestLogs, setRequestLogs] = useState([]);
  const [reqStats, setReqStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAll = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);
    try {
      const [statsRes, loginRes, logsRes, reqStatsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/users/stats`, { headers: authHeaders() }),
        fetch(`${API_BASE_URL}/users/logs`, { headers: authHeaders() }),
        fetch(`${API_BASE_URL}/users/universal-logs`, { headers: authHeaders() }),
        fetch(`${API_BASE_URL}/users/request-stats`, { headers: authHeaders() }),
      ]);
      const [statsData, loginData, logsData, reqStatsData] = await Promise.all([
        statsRes.json(), loginRes.json(), logsRes.json(), reqStatsRes.json(),
      ]);
      if (statsData.stats) setStats(statsData.stats);
      if (loginData.logs) setLoginLogs(loginData.logs);
      if (logsData.logs) setRequestLogs(logsData.logs);
      setReqStats(reqStatsData);
    } catch (e) {
      console.error("Failed to fetch logs:", e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
    const interval = setInterval(() => fetchAll(true), 30000);
    return () => clearInterval(interval);
  }, [fetchAll]);

  if (loading) {
    return (
      <Box minH="100vh" bg="var(--rc-bg)" color="var(--rc-fg)" display="flex" alignItems="center" justifyContent="center">
        <VStack>
          <Spinner size="xl" color="var(--rc-accent)" thickness="4px" />
          <Text fontWeight="600" color="whiteAlpha.500">Loading logs...</Text>
        </VStack>
      </Box>
    );
  }

  const memPct = parseFloat(stats?.memory?.usage) || 0;
  const cpuPct = parseFloat(stats?.cpu?.usagePercent) || 0;
  const diskPct = parseFloat(stats?.storage?.usagePercent) || 0;

  return (
    <Box minH="100vh" bg="var(--rc-bg)" color="var(--rc-fg)">
      <Grid w="100%">
        <Box pt="100px" px={8} pb={10} maxW="container.xl" mx="auto">
          <AdminNavTop />

          {/* Header */}
          <Flex justify="space-between" align="center" mb={10}>
            <VStack align="start" spacing={1}>
              <Heading size="lg" fontWeight="800" letterSpacing="-1px">Server Logs</Heading>
              <Text color="whiteAlpha.500" fontWeight="600" fontSize="sm">
                Live server activity · auto-refreshes every 30s
              </Text>
            </VStack>
            <IconButton
              icon={refreshing ? <Spinner size="sm" /> : <RepeatIcon />}
              onClick={() => fetchAll(true)}
              variant="ghost"
              color="whiteAlpha.600"
              _hover={{ color: "white", bg: "whiteAlpha.100" }}
              aria-label="Refresh"
              isDisabled={refreshing}
            />
          </Flex>

          {/* ── Row 1: Server health stats ── */}
          <SimpleGrid columns={{ base: 2, md: 4, xl: 6 }} gap={4} mb={6}>
            <StatCard label="Uptime" value={stats?.uptime?.human} sub="hh:mm:ss" />
            <StatCard label="Node" value={stats?.process?.version} sub={stats?.process?.platform} />
            <StatCard label="CPU Cores" value={stats?.cpu?.cores} sub={stats?.cpu?.model?.slice(0, 24)} />
            <StatCard label="Heap Used" value={`${(stats?.process?.memory?.heapUsed / 1024 / 1024).toFixed(1)} MB`} sub={`of ${(stats?.process?.memory?.heapTotal / 1024 / 1024).toFixed(1)} MB`} />
            <StatCard label="Requests / hr" value={reqStats?.totalRequestsLastHour ?? "—"} sub="last 1 hour" />
            <StatCard label="Failed Logins" value={reqStats?.totalFailedLogins ?? "—"} sub="all time" color={reqStats?.totalFailedLogins > 0 ? "red.300" : "green.300"} />
          </SimpleGrid>

          {/* ── Row 2: Traffic stats ── */}
          <SimpleGrid columns={{ base: 2, md: 4 }} gap={4} mb={6}>
            <StatCard label="Avg Response Time" value={reqStats?.avgResponseTimeMs ? `${reqStats.avgResponseTimeMs} ms` : "—"} sub="last 1 hour" />
            <StatCard label="Total Data Transfer" value={fmtBytes(reqStats?.totalDataTransferBytes)} sub="last 1 hour" />
            <StatCard label="CPU Load" value={`${reqStats?.cpuUsagePercent ?? cpuPct}%`} sub={`load avg: ${stats?.cpu?.loadAverage?.[0]?.toFixed(2)}`} />
            <StatCard label="Disk Free" value={stats?.storage?.free} sub={`of ${stats?.storage?.total}`} />
          </SimpleGrid>

          {/* ── Row 3: Gauges + Breakdowns ── */}
          <Grid templateColumns={{ base: "1fr", lg: "repeat(3, 1fr) repeat(2, 1fr)" }} gap={4} mb={8}>
            <GaugeCard label="Memory" percent={memPct} detail={`${stats?.memory?.usage} · ${stats?.memory?.free} free`} />
            <GaugeCard label="CPU" percent={cpuPct} detail={`${stats?.cpu?.cores} cores`} />
            <GaugeCard label="Disk" percent={diskPct} detail={`${stats?.storage?.used} used`} />
            <MiniBreakdown title="Status Codes" data={reqStats?.statusBreakdown} />
            <MiniBreakdown title="HTTP Methods" data={reqStats?.methodBreakdown} />
          </Grid>

          {/* ── Tabs ── */}
          <Box className="rc-glass" borderRadius="32px" overflow="hidden">
            <Tabs variant="unstyled">
              <TabList px={6} pt={6} gap={2}>
                {["Login Logs", "Request Logs", "IP Activity"].map((t) => (
                  <Tab
                    key={t}
                    fontWeight="700"
                    fontSize="sm"
                    color="whiteAlpha.400"
                    px={4} py={2}
                    borderRadius="12px"
                    _selected={{ color: "white", bg: "whiteAlpha.200" }}
                  >
                    {t}
                  </Tab>
                ))}
              </TabList>

              <TabPanels>
                {/* ── Login Logs ── */}
                <TabPanel p={6}>
                  <Box overflowX="auto">
                    <Table variant="simple" size="sm">
                      <Thead>
                        <Tr>
                          {["User", "Email", "Source IP", "Geographic Location", "Session / UA", "Time"].map(h => (
                            <Th key={h} color="whiteAlpha.400" borderColor="whiteAlpha.100">{h}</Th>
                          ))}
                        </Tr>
                      </Thead>
                      <Tbody>
                        {loginLogs.length === 0 && (
                          <Tr><Td colSpan={6} textAlign="center" color="whiteAlpha.400" py={8}>No login logs found</Td></Tr>
                        )}
                        {loginLogs.map((log, i) => (
                          <Tr key={i} _hover={{ bg: "whiteAlpha.50" }} transition="bg 0.2s">
                            <Td fontWeight="700" borderColor="whiteAlpha.50">{log.name}</Td>
                            <Td color="whiteAlpha.600" borderColor="whiteAlpha.50">{log.email}</Td>
                            <Td fontFamily="mono" fontSize="xs" borderColor="whiteAlpha.50" whiteSpace="nowrap">{log.ip || "—"}</Td>
                            <Td borderColor="whiteAlpha.50">
                              <Text fontSize="xs" color="whiteAlpha.600">
                                {[log.city, log.region, log.country].filter(Boolean).join(", ") || "Unknown"}
                              </Text>
                              {log.timezone && <Text fontSize="10px" color="whiteAlpha.400">{log.timezone}</Text>}
                            </Td>
                            <Td borderColor="whiteAlpha.50">
                              <Text fontSize="10px" color="whiteAlpha.400" maxW="180px" isTruncated>{log.userAgent || "—"}</Text>
                            </Td>
                            <Td fontSize="xs" color="whiteAlpha.500" borderColor="whiteAlpha.50">{fmt(log.timestamp)}</Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </Box>
                </TabPanel>

                {/* ── Request Logs ── */}
                <TabPanel p={6}>
                  <Box overflowX="auto">
                    <Table variant="simple" size="sm">
                      <Thead>
                        <Tr>
                          {["Method", "Endpoint", "Status", "Resp Time", "Session Duration", "Data Transfer", "Source IP", "CPU %", "Timestamp"].map(h => (
                            <Th key={h} color="whiteAlpha.400" borderColor="whiteAlpha.100">{h}</Th>
                          ))}
                        </Tr>
                      </Thead>
                      <Tbody>
                        {requestLogs.length === 0 && (
                          <Tr><Td colSpan={9} textAlign="center" color="whiteAlpha.400" py={8}>No request logs found</Td></Tr>
                        )}
                        {requestLogs.map((log, i) => (
                          <Tr key={i} _hover={{ bg: "whiteAlpha.50" }} transition="bg 0.2s">
                            <Td borderColor="whiteAlpha.50">
                              <Badge colorScheme="purple" borderRadius="6px" fontWeight="800">
                                {log.network?.request_method || log.web?.http_method || "—"}
                              </Badge>
                            </Td>
                            <Td fontFamily="mono" fontSize="xs" maxW="160px" isTruncated borderColor="whiteAlpha.50">
                              {log.web?.request_uri || log.app?.endpoint || "—"}
                            </Td>
                            <Td borderColor="whiteAlpha.50">
                              <Badge colorScheme={statusColor(log.web?.status_code)} borderRadius="6px" fontWeight="800">
                                {log.web?.status_code || "—"}
                              </Badge>
                            </Td>
                            <Td fontFamily="mono" fontSize="xs" borderColor="whiteAlpha.50">
                              {log.web?.response_time != null ? `${log.web.response_time} ms` : "—"}
                            </Td>
                            <Td fontFamily="mono" fontSize="xs" borderColor="whiteAlpha.50">
                              {log.network?.session_duration_ms != null ? `${log.network.session_duration_ms} ms` : "—"}
                            </Td>
                            <Td fontSize="xs" borderColor="whiteAlpha.50">
                              {fmtBytes(log.network?.data_transfer_bytes)}
                            </Td>
                            <Td fontFamily="mono" fontSize="xs" color="whiteAlpha.500" borderColor="whiteAlpha.50" whiteSpace="nowrap">
                              {log.network?.source_ip || log.web?.remote_ip || "—"}
                            </Td>
                            <Td fontSize="xs" borderColor="whiteAlpha.50">
                              {log.network?.cpu_usage_percent != null
                                ? <Badge colorScheme={log.network.cpu_usage_percent > 80 ? "red" : "green"} borderRadius="6px">{log.network.cpu_usage_percent}%</Badge>
                                : "—"}
                            </Td>
                            <Td fontSize="xs" color="whiteAlpha.500" borderColor="whiteAlpha.50">
                              {fmt(log.core?.timestamp)}
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </Box>
                </TabPanel>

                {/* ── IP Activity ── */}
                <TabPanel p={6}>
                  <Box overflowX="auto">
                    <Table variant="simple" size="sm">
                      <Thead>
                        <Tr>
                          {["Source IP", "Req / min", "Failed Logins", "Total Requests", "Threat Level"].map(h => (
                            <Th key={h} color="whiteAlpha.400" borderColor="whiteAlpha.100">{h}</Th>
                          ))}
                        </Tr>
                      </Thead>
                      <Tbody>
                        {(!reqStats?.ipStats || reqStats.ipStats.length === 0) && (
                          <Tr><Td colSpan={5} textAlign="center" color="whiteAlpha.400" py={8}>No IP data yet</Td></Tr>
                        )}
                        {(reqStats?.ipStats || []).map((ip, i) => {
                          const threat = ip.failed_logins > 5 ? "HIGH" : ip.failed_logins > 0 ? "MEDIUM" : "LOW";
                          const threatColor = threat === "HIGH" ? "red" : threat === "MEDIUM" ? "orange" : "green";
                          return (
                            <Tr key={i} _hover={{ bg: "whiteAlpha.50" }} transition="bg 0.2s">
                              <Td fontFamily="mono" fontSize="xs" fontWeight="700" borderColor="whiteAlpha.50" whiteSpace="nowrap">{ip.ip}</Td>
                              <Td fontFamily="mono" fontSize="xs" borderColor="whiteAlpha.50">{ip.requests_per_min}</Td>
                              <Td borderColor="whiteAlpha.50">
                                <Text fontWeight="700" color={ip.failed_logins > 0 ? "red.300" : "whiteAlpha.600"}>
                                  {ip.failed_logins}
                                </Text>
                              </Td>
                              <Td fontFamily="mono" fontSize="xs" borderColor="whiteAlpha.50">{ip.total_requests}</Td>
                              <Td borderColor="whiteAlpha.50">
                                <Badge colorScheme={threatColor} borderRadius="6px" fontWeight="800">{threat}</Badge>
                              </Td>
                            </Tr>
                          );
                        })}
                      </Tbody>
                    </Table>
                  </Box>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Box>
        </Box>
      </Grid>
    </Box>
  );
};

export default LogsDashboard;
