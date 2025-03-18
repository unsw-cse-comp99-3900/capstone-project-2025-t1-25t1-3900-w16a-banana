import React, { useState } from "react";
import { View } from "react-native";
import { Appbar, Button, Text } from "react-native-paper";
import { useRouter } from "expo-router";
import axios from "axios";
import { BACKEND } from "../../../constants/backend";
import useAuth from "../../../hooks/useAuth";
import useToast from "../../../hooks/useToast";
import PersonalInfoForm from "../../../components/PersonalInfoForm";
import { isStrongPassword } from "validator";
import isEmail from "validator/lib/isEmail";

export default function EditPersonalInfo() {
  const router = useRouter();
  const { contextProfile, login } = useAuth();
  const { showToast } = useToast();
  
  // Initialize form state with existing user data
  const [form, setForm] = useState({
    username: contextProfile.username || "",
    email: contextProfile.email || "",
    phone: contextProfile.phone || "",
    password: "",
    confirmPassword: "",
  });
  
  // Reset form to original profile data
  const handleReset = () => {
    setForm({
      username: contextProfile.username,
      email: contextProfile.email,
      phone: contextProfile.phone,
      password: "",
      confirmPassword: "",
    });
  };

  // Submit form data to update profile
  const handleSubmit = async () => {
    // if the password is filled, then needs to check the password
    if (!isEmail(form.email)) {
      showToast("Please enter a valid email address.", "error");
      return;
    }

    if (form.password || form.confirmPassword) {
      if (!isStrongPassword(form.password)) {
        showToast("Please choose a stronger password", "error");
        return;
      }

      if (form.password !== form.confirmPassword) {
        showToast("Passwords do not match.", "error");
        return;
      }
    }

    // prepare
    const url = `${BACKEND}/customer/update/profile`;
    const config = { headers: { Authorization: contextProfile.token } };

    // create the formdata
    const formData = new FormData();
    formData.append("username", form.username);
    formData.append("email", form.email);
    formData.append("phone", form.phone);
    if (form.password) formData.append("password", form.password);

    try {
      const response = await axios.put(url, form, config);
      showToast("Profile updated successfully!", "success");
      
      // Update the context with the new profile data
      login(response.data);
      console.log(response.data);
      
      // go to the profile page
      router.navigate("/customer/profile");
    } catch (error) {
      console.error("Error updating profile:", error);
      showToast(error.response?.data?.message || "Error updating profile.", "error");
    }
  };

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: "#fff" }}>
      {/* App Header with Back Button */}
      <Appbar.Header style={{ marginBottom: 25 }}>
        <Appbar.BackAction onPress={() => router.navigate("/customer/profile")} />
        <Appbar.Content title="Edit Personal Info" />
      </Appbar.Header>

      {/* Personal Info Form */}
      <PersonalInfoForm form={form} setForm={setForm} userType="customer" />

      {/* Add a helper text, keep the password field empty if no change */}
      <Text style={{ color: "#777", fontSize: 12, marginBottom: 10, marginTop: 5 }}>
        Leave the password fields empty if you don't want to change it.
      </Text>

      {/* Action Buttons */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 20 }}>
        <Button mode="outlined" onPress={handleReset}>Reset</Button>
        <Button mode="contained" onPress={handleSubmit}>Submit</Button>
      </View>
    </View>
  );
}