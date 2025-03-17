import React, { useState } from "react";
import { View } from "react-native";
import { useRouter } from "expo-router";
import { Button, Text, IconButton } from "react-native-paper";
import useToast from "../../hooks/useToast";
import PersonalInfoForm from "../../components/PersonalInfoForm";
import ImageUploadForm from "../../components/ImageUploadForm";

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

  const handleSubmit = () => {
    // TODO: Add submit
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
    <View style={{ flex: 1, padding: 20, backgroundColor: "#f9f9f9" }}>
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
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 20 }}>
        <Button mode="outlined" onPress={handleClear}>Clear</Button>
        <Button mode="contained" onPress={handleSubmit}>Submit</Button>
      </View>
    </View>
  );
}
