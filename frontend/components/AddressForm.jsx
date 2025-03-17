import React from "react";
import { View } from "react-native";
import { TextInput, Text, Dropdown } from "react-native-paper";

const AddressForm = ({ form, setForm }) => {
  const states = ["ACT", "NSW", "NT", "QLD", "SA", "TAS", "VIC", "WA"];

  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  return (
    <View>
      <Text variant="titleMedium" style={{ marginTop: 15, marginBottom: 10 }}>
        Address Information
      </Text>
      <TextInput
        label="Address"
        mode="outlined"
        value={form.address}
        onChangeText={(text) => handleChange("address", text)}
        style={{ marginBottom: 8 }}
      />
      <TextInput
        label="Suburb"
        mode="outlined"
        value={form.suburb}
        onChangeText={(text) => handleChange("suburb", text)}
        style={{ marginBottom: 8 }}
      />
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <TextInput
          label="Postcode"
          mode="outlined"
          value={form.postcode}
          keyboardType="numeric"
          onChangeText={(text) => handleChange("postcode", text)}
          style={{ marginBottom: 8 }}
        />
        <Dropdown
          label="State"
          mode="outlined"
          selectedValue={form.state}
          onValueChange={(value) => handleChange("state", value)}
          items={states.map((state) => ({ label: state, value: state }))}
          style={{ marginBottom: 8 }}
        />
      </View>
    </View>
  );
};
