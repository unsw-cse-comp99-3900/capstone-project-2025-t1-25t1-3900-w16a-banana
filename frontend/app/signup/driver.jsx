import React, { useState } from "react";
import { View } from "react-native";
import { useRouter } from "expo-router";
import { Button, Text, IconButton } from "react-native-paper";
import useToast from "../../hooks/useToast";
import useAuth from "../../hooks/useAuth";
import PersonalInfoForm from "../../components/PersonalInfoForm";
import ImageUploadForm from "../../components/ImageUploadForm";
import { BACKEND } from "../../constants/backend";
import { isStrongPassword } from "validator";
import axios from "axios";
import MyScrollView from "../../components/MyScrollView";

export default function DriverSignup() {
  const router = useRouter();
  const { showToast } = useToast();
  const { login } = useAuth();

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
    registrationImage: null
  });

  const handleSubmit = async () => {
    // Validate required fields
    for (const key in form) {
      if (!form[key]) {
        showToast("Please fill all fields.", "error");
        return;
      }
    }
  
    // Ensure images are uploaded
    if (!form.licenseImage || !form.registrationImage) {
      showToast("Please upload both images.", "error");
      return;
    }

    // Password needs to be strong
    if (!isStrongPassword(form.password)) {
      showToast("Password is not strong enough.", "error");
      return;
    }

    // Passwords must match
    if (form.password !== form.confirmPassword) {
      showToast("Passwords do not match.", "error");
      return;
    }

    try {
      // Convert the URI to a blod
      const licenseImageResponse = await fetch(form.licenseImage);
      const licenseImageBlob = await licenseImageResponse.blob();
  
      const registrationImageResponse = await fetch(form.registrationImage);
      const registrationImageBlob = await registrationImageResponse.blob();
  
      // Create form data
      const formData = new FormData();
  
      // Append images to form data, add the third parameter to make sure it is a file
      formData.append("license_image", licenseImageBlob, "license.jpg");
      formData.append("registration_paper", registrationImageBlob, "registration.jpg");
  
      // Append other form data
      formData.append("email", form.email);
      formData.append("password", form.password);
      formData.append("phone", form.phone);
      formData.append("first_name", form.firstName);
      formData.append("last_name", form.lastName);
      formData.append("license_number", form.licenseNumber);
      formData.append("car_plate", form.carPlate);

      const config = {
        headers: {
          Accept: "application/json",
        }
      }

      // make the API call
      const response = await axios.post(`${BACKEND}/driver/register`, formData, config);

      showToast("Registration successful!", "success");
      login(response.data);
      router.navigate("/driver");
    } catch (error) {
      console.error("Error:", error);
      showToast(error.response?.data?.message || "An error occurred.", "error");
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
      registrationImage: null
    });
  };

  return (
    <MyScrollView>
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
      <ImageUploadForm label="License Number" form={form} setForm={setForm} inputKey="licenseNumber" imageKey="licenseImage" buttonText="Upload License Image" />
      <ImageUploadForm label="Car Plate Number" form={form} setForm={setForm} inputKey="carPlate" imageKey="registrationImage" buttonText="Upload Registration Paper Image"/>
      
      {/* Submit & Clear Buttons */}
      <View style={{ flexDirection: "row", justifyContent: "space-around", marginTop: 8, marginBottom: 20 }}>
        <Button mode="outlined" onPress={handleClear}>Clear</Button>
        <Button mode="contained" onPress={handleSubmit}>Submit</Button>
      </View>
    </MyScrollView>
  );
}