import React, { useState } from "react";
import { View } from "react-native";
import { useRouter } from "expo-router";
import { Button, Text, IconButton } from "react-native-paper";
import useToast from "../../hooks/useToast";
import useAuth from "../../hooks/useAuth";
import PersonalInfoForm from "../../components/PersonalInfoForm";
import AddressForm from "../../components/AddressForm";
import axios from "axios";
import { isStrongPassword } from "validator";
import { BACKEND } from "../../constants/backend";

/**
 * Renders the customer sign-up form with fields for personal and address details, 
 * handles validation, and submits the registration request to the backend.
 */
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

  const handleSubmit = async () => {
    // all fields are required
    for (const key in form) {
      if (!form[key]) {
        showToast("Please fill all fields before submission.", "error");
        return;
      }
    }

    // password must be strong, and password and confirmPassword must match
    if (!isStrongPassword(form.password)) {
      showToast("Please pick a stronger password.", "error");
      return;
    }

    if (form.password !== form.confirmPassword) {
      showToast("Passwords do not match.", "error");
      return;
    }

    // API call
    const url = `${BACKEND}/customer/register`;
    
    const config = {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      }
    };

    try {
      const response = await axios.post(url, form, config);
      showToast("Registration successful!", "success");
      login(response.data);
      router.navigate("/customer");
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Something went wrong. Please try again.";
      showToast(errorMessage, "error");
    }
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
      <Text variant="titleMedium" style={{ marginBottom: 5 }}>Personal Information</Text>
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
