import React, { useCallback, useState } from "react";
import { ScrollView, View } from "react-native";
import { Text, Divider } from "react-native-paper";
import { DatePickerInput } from "react-native-paper-dates";
import { useFocusEffect } from "expo-router";
import axios from "axios";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend } from "chart.js";
import { Bar, Line } from "react-chartjs-2";
import { startOfMonth, format } from "date-fns";

import MyScrollView from "./MyScrollView";
import useAuth from "../hooks/useAuth";
import { BACKEND } from "../constants/backend";
import PressableIcon from "./PressableIcon";
import RestaurantReviews from "./RestaurantReviews";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

/**
 * ReportPage
 *
 * Displays a revenue report for the logged-in user (restaurant or driver), 
 * including daily order counts and earnings within a selected date range.
 * Charts are rendered using Chart.js (line and bar).
 *
 * Inputs:
 * - none directly, but relies on the authenticated user context for fetching data.
 *
 * Behavior:
 * - On mount (or focus), fetches revenue data for the current month by default.
 * - Allows the user to pick a date range and manually refresh the report.
 * - Displays total orders, total earnings, and per-day line/bar charts.
 */
export default function ReportPage() {
  const { contextProfile } = useAuth();

  // Default to this month
  const [startDate, setStartDate] = useState(startOfMonth(new Date()));
  const [endDate, setEndDate] = useState(new Date());

  const [totalOrder, setTotalOrder] = useState(0);
  const [totalEarning, setTotalEarning] = useState(0);
  const [chartData, setChartData] = useState([]);

  const fetchData = async () => {
    const startStr = format(startDate, "yyyy-MM-dd");
    const endStr = format(endDate, "yyyy-MM-dd");

    const url = `${BACKEND}/report/${contextProfile.role}?start_date=${startStr}&end_date=${endStr}`;
    const config = { headers: { Authorization: contextProfile.token } };

    try {
      const response = await axios.get(url, config);
      const data = response.data;
      setTotalOrder(data.total_order);
      setTotalEarning(data.total_earning);
      setChartData(data.data);
    } catch (error) {
      console.error("Error fetching report data:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (contextProfile) fetchData();
    }, [contextProfile])
  );

  const labels = chartData.map(item => item.date);
  const orders = chartData.map(item => item.num_orders);
  const earnings = chartData.map(item => item.earnings);

  return (
    <MyScrollView>
      <Text variant="titleLarge" style={{ marginBottom: 8 }}>Revenue Report</Text>

      <View style={{ marginBottom: 12 }}>
        <Text variant="titleMedium">Total Orders: {totalOrder}</Text>
        <Text variant="titleMedium">Total Earnings: ${totalEarning.toFixed(2)}</Text>
        <Divider style={{ marginTop: 8 }} />
      </View>

      <View style={{ flexDirection: "column", alignItems: "flex-start", gap: 8, marginBottom: 16 }}>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
          <Text variant="titleMedium" style={{ marginBottom: 8 }}>Select Date Range</Text>
          <PressableIcon source="check" size={24} color="#6c757d" onPress={fetchData} />
        </View>
        <DatePickerInput
          label="Start Date"
          value={startDate}
          onChange={setStartDate}
          inputMode="start"
          mode="outlined"
          locale="en-GB"
        />
        <DatePickerInput
          label="End Date"
          value={endDate}
          onChange={setEndDate}
          inputMode="end"
          mode="outlined"
          locale="en-GB"
        />
      </View>

      {chartData.length > 0 && (
        <View>
          {/* ordres graph */}
          <Text variant="titleMedium">Orders per Day</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 24 }}>
            <View style={{ width: Math.max(600, labels.length * 40), paddingRight: 16 }}>
              <Line
                data={{
                  labels,
                  datasets: [
                    {
                      label: "Orders",
                      data: orders,
                      borderColor: "#007bff",
                      backgroundColor: "rgba(0, 123, 255, 0.2)",
                      tension: 0.3,
                      pointRadius: 4
                    }
                  ],
                }}
                options={{
                  responsive: true,
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        stepSize: 1
                      }
                    },
                    x: {
                      ticks: {
                        callback: function(value) {
                          // x axis shows MM-DD only
                          const label = this.getLabelForValue(value);
                          return label.slice(5); 
                        }
                      }
                    }
                  },
                  plugins: {
                    legend: { display: false },
                  },
                }}
              />
            </View>
          </ScrollView>
        
          {/* earnings per day graph */}
          <Text variant="titleMedium">Earnings per Day</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={{ width: Math.max(600, labels.length * 40), paddingRight: 16 }}>
              <Bar
                data={{
                  labels,
                  datasets: [
                    {
                      label: "Earnings ($)",
                      data: earnings,
                      backgroundColor: "#198754"
                    }
                  ],
                }}
                options={{
                  responsive: true,
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        callback: (value) => `$${value}`,
                        stepSize: 50
                      }
                    },
                    x: {
                      ticks: {
                        callback: function(value) {
                          // x axis shows MM-DD only
                          const label = this.getLabelForValue(value);
                          return label.slice(5); 
                        }
                      }
                    }
                  },
                  plugins: {
                    legend: { display: false },
                  },
                }}
              />
            </View>
          </ScrollView>

          {/* show all the reviews of the restaurant */}
          <Divider style={{ marginTop: 8 }} />
          <RestaurantReviews
            role={contextProfile.role}
            id={contextProfile.id}
          />
        </View>
      )}
    </MyScrollView>
  );
}
