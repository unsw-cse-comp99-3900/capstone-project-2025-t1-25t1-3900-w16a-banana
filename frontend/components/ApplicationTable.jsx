import React from "react";
import { View, ScrollView } from "react-native";
import { DataTable, Button } from "react-native-paper";
import { useRouter } from "expo-router";
import capitalize from "capitalize";

export default function ApplicationTable({ data, columns, rowKeys, userType }) {
  const router = useRouter();

  return (
    <View style={{ marginBottom: 25 }}>
      <ScrollView horizontal>
        <DataTable>
          {/* Table Header */}
          <DataTable.Header>
            {columns.map((col, index) => (
              <DataTable.Title key={index} style={{ minWidth: 100 }}>{col}</DataTable.Title>
            ))}
            <DataTable.Title style={{ minWidth: 250 }}>Actions</DataTable.Title>
          </DataTable.Header>

          {/* Table Rows */}
          {data.map((item, index) => (
            <DataTable.Row key={index}>
              {rowKeys.map((key, i) => (
                <DataTable.Cell key={i} style={{ minWidth: 100 }}>{capitalize.words(item[key])}</DataTable.Cell>
              ))}
              <DataTable.Cell style={{ minWidth: 250, flexDirection: "row", gap: 5 }}>
                <Button
                  mode="text"
                  onPress={() => router.push(`/profile?type=${userType}&id=${item.id || item.restaurant_id || item.driver_id || item.admin_id}`)}
                >
                  View
                </Button>
                <Button mode="text" onPress={() => console.log("Approve logic")}>Approve</Button>
                <Button mode="text" onPress={() => console.log("Reject logic")}>Reject</Button>
              </DataTable.Cell>
            </DataTable.Row>
          ))}
        </DataTable>
      </ScrollView>
    </View>
  );
}
