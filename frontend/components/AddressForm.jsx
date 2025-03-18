import React from "react";
import { View } from "react-native";
import { TextInput, Text, HelperText } from "react-native-paper";
import { Picker } from "@react-native-picker/picker";
import { isPostalCode } from "validator";

export default function AddressForm ({ form, setForm }) {
  const states = ["ACT", "NSW", "NT", "QLD", "SA", "TAS", "VIC", "WA"];

  const handleChange = (key, value) => {
    setForm((prevForm) => ({ ...prevForm, [key]: value }));
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
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 16 }}>
        <TextInput
          label="Suburb"
          mode="outlined"
          value={form.suburb}
          onChangeText={(text) => handleChange("suburb", text)}
          style={{ width: "48%" }}
        />
        <TextInput
          label="Postcode"
          mode="outlined"
          value={form.postcode}
          keyboardType="numeric"
          onChangeText={(text) => handleChange("postcode", text)}
          style={{ width: "48%" }}
        />
      </View>
      {form.postcode && !isPostalCode(form.postcode, "AU") ? (
        <HelperText type="error" visible={true} style={{ marginTop: -12, marginBottom: 8 }}>
          Please enter a valid Australian postcode
        </HelperText>
      ) : null}
      <View style={{ width: "48%", borderRadius: 5, borderWidth: 1, borderColor: "#323232", overflow: "hidden" }}>
        <Picker
          selectedValue={form.state}
          onValueChange={(value) => handleChange("state", value)}
          style={{ height: 50 }}
        >
          <Picker.Item label="Select State" value="" />
          {states.map((state) => (
            <Picker.Item key={state} label={state} value={state} />
          ))}
        </Picker>
      </View>
    </View>
  );
};
