import React, { useState } from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";
import { Picker } from "@react-native-picker/picker";
import MyScrollView from "../../../components/MyScrollView";
import UserTableWithType from "../../../components/UserTableWithType";

export default function Users() {
  const [selectedType, setSelectedType] = useState("all");

  return (
    <MyScrollView>
      {/* Title */}
      <Text variant="headlineMedium" style={{ marginBottom: 15 }}>
        User Profiles
      </Text>

      {/* Dropdown Selection */}
      <View style={{ borderWidth: 1, borderColor: "#ccc", borderRadius: 8, marginBottom: 25 }}>
        <Picker
          selectedValue={selectedType}
          onValueChange={(itemValue) => setSelectedType(itemValue)}
          style={{ height: 50 }}
        >
          <Picker.Item label="All Users" value="all" />
          <Picker.Item label="Customers" value="customer" />
          <Picker.Item label="Drivers" value="driver" />
          <Picker.Item label="Restaurants" value="restaurant" />
          <Picker.Item label="Admins" value="admin" />
        </Picker>
      </View>

      {/* User Table */}
      {selectedType === "all" ? (
        <>
          <UserTableWithType userType="customer" />
          <UserTableWithType userType="driver" />
          <UserTableWithType userType="restaurant" />
          <UserTableWithType userType="admin" />
        </>
      ) : (
        <UserTableWithType userType={selectedType} />
      )}
    </MyScrollView>
  );
}
