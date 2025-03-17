import React, { useState } from "react";
import { View } from "react-native";
import { useRouter } from "expo-router";
import { Button, TextInput, Text, IconButton } from "react-native-paper";
import validator from "validator";
import useToast from "../../hooks/useToast";
import useAuth from "../../hooks/useAuth";

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

  const handleSubmit = () => {
    // TODO: Add submit
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
    setPasswordError("");
  };

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: "#fff" }}>
      {/* Back Button & Title */}
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}>
        <IconButton icon="arrow-left" size={24} onPress={() => router.back()} />
        <Text variant="headlineMedium" style={{ marginLeft: 10 }}>
          New Customer Form
        </Text>
      </View>

      {/* Personal Info Section */}
      <Text variant="titleMedium" style={{ marginBottom: 10 }}>Personal Information</Text>
      <TextInput label="Username" mode="outlined" value={form.username} onChangeText={(text) => handleChange("username", text)} style={{ marginBottom: 8 }}/>
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
      
      {/* Address Section */}
      <Text variant="titleMedium" style={{ marginTop: 15, marginBottom: 10 }}>Address</Text>
      <TextInput label="Address" mode="outlined" value={form.address} onChangeText={(text) => handleChange("address", text)} style={{ marginBottom: 8 }} />
      <TextInput label="Suburb" mode="outlined" value={form.suburb} onChangeText={(text) => handleChange("suburb", text)} style={{ marginBottom: 8 }}/>
      <TextInput label="State" mode="outlined" value={form.state} onChangeText={(text) => handleChange("state", text)} style={{ marginBottom: 8 }} />
      <TextInput label="Postcode" mode="outlined" value={form.postcode} keyboardType="numeric" onChangeText={(text) => handleChange("postcode", text)} style={{ marginBottom: 8 }} />
      
      {/* Submit & Clear Buttons */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 20 }}>
        <Button mode="outlined" onPress={handleClear}>Clear</Button>
        <Button mode="contained" onPress={handleSubmit}>Submit</Button>
      </View>
    </View>
  );
}