import React from "react";
import { View } from "react-native";
import { TextInput, Text, HelperText, Button } from "react-native-paper";
import { Picker } from "@react-native-picker/picker";
import { isPostalCode } from "validator";
import useAuth from "../hooks/useAuth";

export default function AddressForm ({ form, setForm, allowContextAddress = false }) {
  const { contextProfile } = useAuth();
  
  const states = ["ACT", "NSW", "NT", "QLD", "SA", "TAS", "VIC", "WA"];

  const handleChange = (key, value) => {
    setForm((prevForm) => ({ ...prevForm, [key]: value }));
  };

  const fillDefaultAddress = () => {
    if (contextProfile) {
      const { address, suburb, state, postcode } = contextProfile;
      setForm((prevForm) => ({
        ...prevForm,
        address: address || "",
        suburb: suburb || "",
        state: state || "",
        postcode: postcode || "",
      }));
    }
  };

  return (
    <View>
      {/* Text: address information, and a button: fill with default address */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <Text variant="titleMedium">
          Address Information
        </Text>
        {allowContextAddress && (
          <Button
            mode="text"
            onPress={fillDefaultAddress}
            icon="home-account"
          >
            Use Default
          </Button>
        )}
      </View>

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
