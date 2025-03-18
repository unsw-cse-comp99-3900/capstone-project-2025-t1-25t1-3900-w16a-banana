import React, { useState, useEffect } from "react";
import { View } from "react-native";
import { useRouter } from "expo-router";
import { Button, Text, IconButton, ActivityIndicator } from "react-native-paper";
import useToast from "../../../hooks/useToast";
import useAuth from "../../../hooks/useAuth";
import PersonalInfoForm from "../../../components/PersonalInfoForm";
import AddressForm from "../../../components/AddressForm";
import axios from "axios";
import { isStrongPassword } from "validator";
import isEmail from "validator/lib/isEmail";
import { BACKEND } from "../../../constants/backend";

export default function EditProfile() {
  const router = useRouter();
  const { showToast } = useToast();
  const { contextProfile, login } = useAuth();
  const [form, setForm] = useState({});

  useEffect(() => {
    setForm({
      username: contextProfile?.username || "",
      email: contextProfile?.email || "",
      phone: contextProfile?.phone || "",
      password: "",
      confirmPassword: "",
      address: contextProfile?.address || "",
      suburb: contextProfile?.suburb || "",
      state: contextProfile?.state || "",
      postcode: contextProfile?.postcode || "",
    });
  }, [contextProfile]);

  const handleSubmit = async () => {
    if (!isEmail(form.email)) {
      showToast("Please enter a valid email address.", "error");
      return;
    }

    if (form.password && !isStrongPassword(form.password)) {
      showToast("Please pick a stronger password.", "error");
      return;
    }

    if (form.password && form.password !== form.confirmPassword) {
      showToast("Passwords do not match.", "error");
      return;
    }

    try {
      const url = `${BACKEND}/customer/update`;
      const config = { headers: { Authorization: contextProfile.token } };
      const response = await axios.put(url, form, config);

      showToast("Profile updated successfully!", "success");

      // Save updated profile to context
      login(response.data);
      router.navigate("/customer/profile");
    } catch (error) {
      console.error("Error updating profile:", error);
      showToast(error.response?.data?.message || "Error updating profile.", "error");
    }
  };

  const handleReset = () => {
    setForm({
      username: contextProfile?.username || "",
      email: contextProfile?.email || "",
      phone: contextProfile?.phone || "",
      password: "",
      confirmPassword: "",
      address: contextProfile?.address || "",
      suburb: contextProfile?.suburb || "",
      state: contextProfile?.state || "",
      postcode: contextProfile?.postcode || "",
    });
  };

  if (!contextProfile) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#6200ee" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: "#f9f9f9" }}>
      {/* Back Button & Title */}
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}>
        <IconButton icon="arrow-left" size={24} onPress={() => router.back()} />
        <Text variant="headlineMedium" style={{ marginLeft: 10 }}>
          Edit Profile
        </Text>
      </View>

      {/* Personal Info Section */}
      <Text variant="titleMedium" style={{ marginBottom: 10 }}>Personal Information</Text>
      <PersonalInfoForm form={form} setForm={setForm} userType="customer" />

      {/* Address Section */}
      <AddressForm form={form} setForm={setForm} />

      {/* Submit & Reset Buttons */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 20 }}>
        <Button mode="outlined" onPress={handleReset}>Reset</Button>
        <Button mode="contained" onPress={handleSubmit}>Save Changes</Button>
      </View>
    </View>
  );
}
