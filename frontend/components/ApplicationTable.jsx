import React, { useState } from "react";
import { View, ScrollView } from "react-native";
import { DataTable, Button, Dialog, Portal, Text } from "react-native-paper";
import { useRouter } from "expo-router";
import capitalize from "capitalize";
import useToast from "../hooks/useToast";
import useAuth from "../hooks/useAuth";
import axios from "axios";
import { BACKEND } from "../constants/backend";

/**
 * Displays a scrollable table of user applications with action buttons to view, approve, or reject entries.
 * 
 * data: array - list of application objects to display.
 * columns: array - list of column titles to show in the table header.
 * rowKeys: array - list of keys to extract values from each item row.
 * userType: string - either 'restaurant' or 'driver', determines API endpoints.
 * forceReload: function - function to refresh the parent component after actions.
 */
export default function ApplicationTable({ data, columns, rowKeys, userType, forceReload }) {
  const router = useRouter();
  const { showToast } = useToast();
  const { contextProfile } = useAuth();
  const [dialogVisible, setDialogVisible] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);
  const [selectedId, setSelectedId] = useState(null);

  // Function to open the confirmation dialog
  const openDialog = (id, action) => {
    setSelectedId(id);
    setSelectedAction(action);
    setDialogVisible(true);
  };

  // Function to close the confirmation dialog
  const closeDialog = () => {
    setDialogVisible(false);
    setSelectedId(null);
    setSelectedAction(null);
  };

  // Function to handle Approve or Reject action
  const handleAction = async () => {
    if (!selectedId || !selectedAction) return;

    const url = `${BACKEND}/admin/${userType}/${selectedId}/${selectedAction}`;
    
    try {
      await axios.post(url, {}, {
        headers: { Authorization: contextProfile.token },
      });

      showToast("Submission successful", "success");
      closeDialog();
      
      // force reload
      forceReload();
    } catch (error) {
      showToast("Failed to process request", "error");
      console.error("Error:", error);
    }
  };

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
                  onPress={() => router.push(`/profile?type=${userType}&id=${item.restaurant_id || item.driver_id}`)}
                >
                  View
                </Button>
                <Button mode="text" onPress={() => openDialog(item.restaurant_id || item.driver_id, "approve")}>
                  Approve
                </Button>
                <Button mode="text" onPress={() => openDialog(item.restaurant_id || item.driver_id, "reject")}>
                  Reject
                </Button>
              </DataTable.Cell>
            </DataTable.Row>
          ))}
        </DataTable>
      </ScrollView>

      {/* Confirmation Dialog */}
      <Portal>
        <Dialog visible={dialogVisible} onDismiss={closeDialog}>
          <Dialog.Title>Confirm Action</Dialog.Title>
          <Dialog.Content>
            <Text>You are going to <Text style={{ fontWeight: "bold" }}>{selectedAction}</Text> this pending application. Do you want to proceed?</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={closeDialog}>Cancel</Button>
            <Button onPress={handleAction}>Confirm</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}
