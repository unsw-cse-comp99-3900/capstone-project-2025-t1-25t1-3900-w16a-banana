import React, { useState } from "react";
import { View, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { useRouter } from "expo-router";
import { Button, Text, IconButton } from "react-native-paper";
import useToast from "../../hooks/useToast";
import PersonalInfoForm from "../../components/PersonalInfoForm";
import ImageUploadForm from "../../components/ImageUploadForm";
import { BACKEND } from "../constants/backend";

export default function DriverSignup() {
  const router = useRouter();
  const { showToast } = useToast();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    licenseNumber: "",
    carPlate: "",
    licenseImage: null,
    carImage: null,
  });

  const handleSubmit = async () => {
    // All fields should be filled
    for (const key in form) {
      if (!form[key]) {
        showToast('Please fill all fields before submission.', 'error');
        return;
      }
    }
  
    // Check if images are uploaded
    if (!form.licenseImage) {
      showToast("Please upload your license image", "error");
      return;
    }
  
    if (!form.carImage) {
      showToast("Please upload your car registration paper image", "error");
      return;
    }
  
    // Password validation
    if (!isStrongPassword(form.password)) {
      showToast("Please pick a stronger password.", "error");
      return;
    }
  
    if (form.password !== form.confirmPassword) {
      showToast("Passwords do not match.", "error");
      return;
    }
  
    // Prepare URL with query parameters
    const baseUrl = `${BACKEND}/driver/register`;

    const queryParams = new URLSearchParams({
      email: form.email,
      password: form.password,
      phone: form.phone,
      first_name: form.firstName,
      last_name: form.lastName,
      license_number: form.licenseNumber,
      car_plate: form.carPlate
    });
  
    const url = `${baseUrl}?${queryParams.toString()}`;
  
    // Form data
    const formData = new FormData();
    formData.append('license_image', form.licenseImage);
    formData.append('registration_paper', form.carImage);
  
    const config = {
      headers: {
        'accept': 'application/json',
        'Content-Type': 'multipart/form-data'
      }
    };
  
    try {
      const response = await axios.post(url, formData, config);
      showToast("Registration successful!", "success");
      login(response.data);
      router.push("/dashboard");
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Something went wrong. Please try again.";
      showToast(errorMessage, "error");
    }
  };

  const handleClear = () => {
    setForm({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      licenseNumber: "",
      carPlate: "",
      licenseImage: null,
      carImage: null,
    });
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#f9f9f9" }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <ScrollView 
        contentContainerStyle={{ padding: 20 }}
        showsVerticalScrollIndicator={true}
      >
        {/* Back Button & Title */}
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}>
          <IconButton icon="arrow-left" size={24} onPress={() => router.back()} />
          <Text variant="headlineMedium" style={{ marginLeft: 10 }}>
            New Driver Form
          </Text>
        </View>

        {/* Personal Info Section */}
        <Text variant="titleMedium" style={{ marginBottom: 10 }}>Personal Information</Text>
        <PersonalInfoForm form={form} setForm={setForm} userType="driver" />

        {/* Driver Info Section: Upload two images: license image, and car image */}
        <Text variant="titleMedium" style={{ marginTop: 15, marginBottom: 10 }}>Driver Information</Text>
        <ImageUploadForm label="License Number" form={form} setForm={setForm} fieldKey="licenseImage" buttonText="Upload License Image" />
        <ImageUploadForm label="Car Plate Number" form={form} setForm={setForm} fieldKey="carImage" buttonText="Upload Registration Paper Image"/>
        
        {/* Submit & Clear Buttons */}
        <View style={{ flexDirection: "row", justifyContent: "space-around", marginTop: 8, marginBottom: 20 }}>
          <Button mode="outlined" onPress={handleClear}>Clear</Button>
          <Button mode="contained" onPress={handleSubmit}>Submit</Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}