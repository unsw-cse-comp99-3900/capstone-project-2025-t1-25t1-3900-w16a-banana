import React, { useState } from "react";
import { KeyboardAvoidingView, ScrollView, View, Platform } from "react-native";
import { useRouter } from "expo-router";
import { Button, Text, IconButton, TextInput } from "react-native-paper";
import useToast from "../../hooks/useToast";
import PersonalInfoForm from "../../components/PersonalInfoForm";
import AddressForm from "../../components/AddressForm";
import ImageUploadForm from "../../components/ImageUploadForm";

export default function RestaurantSignup() {
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
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView style={{ flex: 1, padding: 20, backgroundColor: "#f9f9f9", marginBottom: 20 }}>
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
        {/* add abn and description under the business information */}
        <TextInput
          label="ABN Number"
          mode="outlined"
          value={form.abn}
          keyboardType="numeric"
          onChangeText={(text) => setForm({ ...form, abn: text })}
          style={{ marginBottom: 8, marginTop: 8, }}
          maxLength={11}
        />
        <TextInput
          label="Description"
          mode="outlined"
          value={form.description}
          onChangeText={(text) => setForm({ ...form, description: text })}
          style={{ marginBottom: 8 }}
          multiline
          numberOfLines={4}
        />

        {/* Address Section */}
        <AddressForm form={form} setForm={setForm} />

        {/* Image Uploads */}
        <Text variant="titleMedium" style={{ marginTop: 15, marginBottom: 10 }}>Upload Images</Text>
        <ImageUploadForm label="Image 1" form={form} setForm={setForm} fieldKey="image1" />
        <ImageUploadForm label="Image 2" form={form} setForm={setForm} fieldKey="image2" />
        <ImageUploadForm label="Image 3" form={form} setForm={setForm} fieldKey="image3" />

        {/* Submit & Clear Buttons */}
        <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 20, marginBottom: 30 }}>
          <Button mode="outlined" onPress={handleClear}>Clear</Button>
          <Button mode="contained" onPress={handleSubmit}>Submit</Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}