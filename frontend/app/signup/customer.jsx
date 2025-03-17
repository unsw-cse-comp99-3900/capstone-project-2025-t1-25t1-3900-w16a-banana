import React, { useState } from "react";
import { View } from "react-native";
import { useRouter } from "expo-router";
import { Button, Text, IconButton } from "react-native-paper";
import useToast from "../../hooks/useToast";
import useAuth from "../../hooks/useAuth";
import PersonalInfoForm from "../../components/PersonalInfoForm";
import AddressForm from "../../components/AddressForm";

export default function CustomerSignup() {
  const router = useRouter();
  const { showToast } = useToast();
  const { login } = useAuth();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: "",
    suburb: "",
    state: "",
    postcode: "",
  });

  const handleSubmit = () => {
    // TODO: Add submit
  };

  const handleClear = () => {
    setForm({
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
      address: "",
      suburb: "",
      state: "",
      postcode: "",
    });
  };

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: "#f9f9f9" }}>
      {/* Back Button & Title */}
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}>
        <IconButton icon="arrow-left" size={24} onPress={() => router.back()} />
        <Text variant="headlineMedium" style={{ marginLeft: 10 }}>
          New Customer Form
        </Text>
      </View>

      {/* Personal Info Section */}
      <Text variant="titleMedium" style={{ marginBottom: 10 }}>Personal Information</Text>
      <PersonalInfoForm form={form} setForm={setForm} userType="customer" />

      {/* Address Section */}
      <AddressForm form={form} setForm={setForm} />
      
      {/* Submit & Clear Buttons */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 20 }}>
        <Button mode="outlined" onPress={handleClear}>Clear</Button>
        <Button mode="contained" onPress={handleSubmit}>Submit</Button>
      </View>
    </View>
  );
}
