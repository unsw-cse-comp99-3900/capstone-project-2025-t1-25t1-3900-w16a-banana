import React from "react";
import { View } from "react-native";
import { DataTable, Button } from "react-native-paper";
import { useRouter } from "expo-router";

export default function ApplicationTable({ data, columns, rowKeys, userType }) {
  const router = useRouter();

  return (
    <View style={{ marginBottom: 20 }}>
      <DataTable>
        {/* Table Header */}
        <DataTable.Header>
          {columns.map((col, index) => (
            <DataTable.Title key={index}>{col}</DataTable.Title>
          ))}
          <DataTable.Title>Actions</DataTable.Title>
        </DataTable.Header>

        {/* Table Rows */}
        {data.map((item, index) => (
          <DataTable.Row key={index}>
            {rowKeys.map((key, i) => (
              <DataTable.Cell key={i}>{item[key]}</DataTable.Cell>
            ))}
            <DataTable.Cell>
              <Button
                mode="outlined"
                onPress={() => router.push(`/profile?type=${userType}&id=${item.id || item.restaurant_id || item.driver_id || item.admin_id}`)}
                style={{ marginRight: 5 }}
              >
                View
              </Button>
              <Button mode="outlined" onPress={() => console.log("Approve logic")}>Approve</Button>
              <Button mode="outlined" onPress={() => console.log("Reject logic")}>Reject</Button>
            </DataTable.Cell>
          </DataTable.Row>
        ))}
      </DataTable>
    </View>
  );
}
