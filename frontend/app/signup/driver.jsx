import React, { useState } from "react";
import { View } from "react-native";
import { useRouter } from "expo-router";
import { Button, TextInput, Text, IconButton } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import validator from "validator";
import useToast from "../../hooks/useToast";

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

  const [passwordError, setPasswordError] = useState("");

  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  const validatePassword = (password) => {
    if (!validator.isStrongPassword(password)) {
      setPasswordError("Password is not strong enough!");
    } else {
      setPasswordError("");
    }
  };

  const pickImage = async (type) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setForm({ ...form, [type]: result.assets[0].uri });
    }
  };

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
    setPasswordError("");
  };

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: "#fff" }}>
      {/* Back Button & Title */}
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}>
        <IconButton icon="arrow-left" size={24} onPress={() => router.back()} />
        <Text variant="headlineMedium" style={{ marginLeft: 10 }}>
          New Driver Form
        </Text>
      </View>

      {/* Personal Info Section */}
      <Text variant="titleMedium" style={{ marginBottom: 10 }}>Personal Information</Text>
      <TextInput label="First Name" mode="outlined" value={form.firstName} onChangeText={(text) => handleChange("firstName", text)} style={{ marginBottom: 8 }}/>
      <TextInput label="Last Name" mode="outlined" value={form.lastName} onChangeText={(text) => handleChange("lastName", text)} style={{ marginBottom: 8 }}/>
      <TextInput label="Email" mode="outlined" value={form.email} keyboardType="email-address" onChangeText={(text) => handleChange("email", text)} style={{ marginBottom: 8 }}/>
      <TextInput label="Phone" mode="outlined" value={form.phone} keyboardType="phone-pad" onChangeText={(text) => handleChange("phone", text)} style={{ marginBottom: 8 }}/>
      <TextInput
        mode="outlined"
        label="Password"
        value={form.password}
        secureTextEntry
        onChangeText={(text) => {
          handleChange("password", text);
          validatePassword(text);
        }}
        style={{ marginBottom: 8 }}
      />
      {passwordError ? <Text style={{ color: "red" }}>{passwordError}</Text> : null}
      <TextInput label="Confirm Password" mode="outlined" value={form.confirmPassword} secureTextEntry onChangeText={(text) => handleChange("confirmPassword", text)} style={{ marginBottom: 8 }}/>
      
      {/* Driver Info Section */}
      <Text variant="titleMedium" style={{ marginTop: 15, marginBottom: 10 }}>Driver Information</Text>
      <TextInput label="License Number" mode="outlined" value={form.licenseNumber} onChangeText={(text) => handleChange("licenseNumber", text)} style={{ marginBottom: 8 }} />
      <Button mode="outlined" onPress={() => pickImage("licenseImage")} style={{ marginBottom: 8 }}>
        Upload License Image
      </Button>
      <TextInput label="Car Plate Number" mode="outlined" value={form.carPlate} onChangeText={(text) => handleChange("carPlate", text)} style={{ marginBottom: 8 }} />
      <Button mode="outlined" onPress={() => pickImage("carImage")}>
        Upload Car Image
      </Button>
      
      {/* Submit & Clear Buttons */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 20 }}>
        <Button mode="outlined" onPress={handleClear}>Clear</Button>
        <Button mode="contained" onPress={handleSubmit}>Submit</Button>
      </View>
    </View>
  );
}