import React, { useState } from "react";
import { KeyboardAvoidingView, ScrollView, View, Platform } from "react-native";
import { useRouter } from "expo-router";
import { Button, Text, IconButton, TextInput, HelperText } from "react-native-paper";
import useToast from "../../hooks/useToast";
import PersonalInfoForm from "../../components/PersonalInfoForm";
import AddressForm from "../../components/AddressForm";
import ImageUploadForm from "../../components/ImageUploadForm";

export default function Restaurant () {
  const router = useRouter();
  const { showToast } = useToast();

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

  const handleSubmit = () => {
    // TODO: Add submit logic
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

  // ABN: Australian Business Number, 11 digits
  const isValidABN = form.abn && (form.abn.length !== 11 || isNaN(form.abn));

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
