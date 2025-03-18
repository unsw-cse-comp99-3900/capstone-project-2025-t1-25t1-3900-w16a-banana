import React, { useState } from "react";
import { KeyboardAvoidingView, ScrollView, View, Platform } from "react-native";
import { useRouter } from "expo-router";
import { Button, Text, IconButton, TextInput, HelperText } from "react-native-paper";
import useToast from "../../hooks/useToast";
import PersonalInfoForm from "../../components/PersonalInfoForm";
import AddressForm from "../../components/AddressForm";
import ImageUploadForm from "../../components/ImageUploadForm";
import { isPostalCode, isStrongPassword } from "validator";
import axios from "axios";
import isEmail from "validator/lib/isEmail";
import { BACKEND } from "../../constants/backend";
import useAuth from "../../hooks/useAuth";

export default function Restaurant () {
  const router = useRouter();
  const { showToast } = useToast();
  const { login } = useAuth();

  const [form, setForm] = useState({
    businessName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    address: "",
    suburb: "",
    state: "",
    postcode: "",
    abn: "",
    description: "",
    image1: null,
    image2: null,
    image3: null,
  });

  // ABN: Australian Business Number, 11 digits
  const isValidABN = form.abn && (form.abn.length !== 11 || isNaN(form.abn));

  const handleSubmit = async () => {
    for (const key in form) {
      if (!form[key]) {
        showToast("Please fill all required fields.", "error");
        return;
      }
    }

    // email must valid
    if (!isEmail(form.email)) {
      showToast("Please enter a valid email address.", "error");
      return;
    }

    // ensure all three images are uploaded
    if (!(form.image1 && form.image2 && form.image3)) {
      showToast("Please upload all three images.", "error");
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
  
    // Validate ABN
    if (isValidABN) {
      showToast("Please enter a valid ABN number.", "error");
      return;
    }
    
    // Validate postcode
    if (!isPostalCode(form.postcode, "AU")) {
      showToast("Please enter a valid Australian postcode.", "error");
      return;
    }
  
    try {
      // Create form data
      const formData = new FormData();
      
      // process the 3 images
      const image1Response = await fetch(form.image1);
      const image1Blob = await image1Response.blob();
      formData.append("image1", image1Blob, "restaurant_image1.jpg");
      
      const image2Response = await fetch(form.image2);
      const image2Blob = await image2Response.blob();
      formData.append("image2", image2Blob, "restaurant_image2.jpg");
      
      const image3Response = await fetch(form.image3);
      const image3Blob = await image3Response.blob();
      formData.append("image3", image3Blob, "restaurant_image3.jpg");
  
      // Append other form data
      formData.append("name", form.businessName);
      formData.append("email", form.email);
      formData.append("password", form.password);
      formData.append("phone", form.phone);
      formData.append("address", form.address);
      formData.append("suburb", form.suburb);
      formData.append("state", form.state);
      formData.append("postcode", form.postcode);
      formData.append("abn", form.abn);
      formData.append("description", form.description);
  
      const config = {
        headers: {
          Accept: "application/json",
        }
      };
  
      // Make the API call
      const response = await axios.post(`${BACKEND}/restaurant/register`, formData, config);
      
      // Success
      showToast("Restaurant registration successful!", "success");
      login(response.data);
      router.navigate("/restaurant");
    } catch (error) {
      console.error("Error:", error);
      showToast(error.response?.data?.message || "An error occurred during registration.", "error");
    }
  };

  const handleClear = () => {
    setForm({
      businessName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      address: "",
      suburb: "",
      state: "",
      postcode: "",
      abn: "",
      description: "",
      image1: null,
      image2: null,
      image3: null,
    });

    showToast("Form cleared");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView style={{ flex: 1, padding: 20, backgroundColor: "#f9f9f9" }}>
        {/* Back Button & Title */}
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}>
          <IconButton icon="arrow-left" size={24} onPress={() => router.back()} />
          <Text variant="headlineMedium" style={{ marginLeft: 10 }}>
            New Restaurant Form
          </Text>
        </View>

        {/* Personal Info Section */}
        <Text variant="titleMedium" style={{ marginBottom: 10 }}>Business Information</Text>
        <PersonalInfoForm form={form} setForm={setForm} userType="restaurant" />
        
        {/* ABN and Description */}
        <TextInput
          label="ABN Number"
          mode="outlined"
          value={form.abn}
          keyboardType="numeric"
          error={isValidABN}
          onChangeText={(text) => setForm((prevForm) => ({ ...prevForm, abn: text }))}
          style={{ marginBottom: isValidABN ? 0 : 8, marginTop: 8 }}
          maxLength={11}
        />
        {isValidABN ? (
          <HelperText type="error" visible={true} style={{ marginBottom: 8 }}>
            ABN number must be 11 digits.
          </HelperText>
        ) : null}
        <TextInput
          label="Description"
          mode="outlined"
          value={form.description}
          onChangeText={(text) => setForm((prevForm) => ({ ...prevForm, description: text }))}
          style={{ marginBottom: 16 }}
          multiline
          numberOfLines={4}
        />

        {/* Address Section */}
        <AddressForm form={form} setForm={setForm} />

        {/* Image Uploads */}
        <Text variant="titleMedium" style={{ marginTop: 15, marginBottom: 10 }}>Upload Advertisement Images</Text>
        <ImageUploadForm 
          label="Image 1" 
          form={form} 
          setForm={setForm} 
          imageKey="image1" 
          inputKey={null} 
          buttonText="Upload Image 1" 
        />
        <ImageUploadForm 
          label="Image 2" 
          form={form} 
          setForm={setForm} 
          imageKey="image2" 
          inputKey={null} 
          buttonText="Upload Image 2" 
        />
        <ImageUploadForm 
          label="Image 3" 
          form={form} 
          setForm={setForm} 
          imageKey="image3" 
          inputKey={null} 
          buttonText="Upload Image 3" 
        />

        {/* Submit & Clear Buttons */}
        <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 20, marginBottom: 50 }}>
          <Button mode="outlined" onPress={handleClear}>Clear</Button>
          <Button mode="contained" onPress={handleSubmit}>Submit</Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
