import React, { useState } from "react";
import { View } from "react-native";
import { useRouter } from "expo-router";
import { Button, TextInput, Text, IconButton } from "react-native-paper";
import { Picker } from "@react-native-picker/picker";
import useToast from "../hooks/useToast";
import capitalize from "capitalize";

export default function Login() {
  const router = useRouter();
  const { showToast } = useToast();

  const [form, setForm] = useState({
    email: "",
    password: "",
    userType: "",
  });

  const userTypes = ["customer", "driver", "restaurant", "admin"];

  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  const handleSubmit = () => {
    // TODO: Add submit logic
  };

  const handleClear = () => {
    setForm({ email: "", password: "", userType: "" });
  };

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: "#fff" }}>
      {/* Back Button & Title (Fixed at the Top) */}
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}>
        <IconButton icon="arrow-left" size={24} onPress={() => router.back()} />
        <Text variant="headlineMedium" style={{ marginLeft: 10 }}>Login</Text>
      </View>

      {/* Centered Form */}
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text variant="titleMedium" style={{ marginBottom: 20 }}>Login to Your Account</Text>
        <View style={{ width: "100%" }}>
          {/* Email Input */}
          <TextInput
            label="Email"
            mode="outlined"
            value={form.email}
            keyboardType="email-address"
            onChangeText={(text) => handleChange("email", text)}
            style={{ marginBottom: 8 }}
          />

          {/* Password Input */}
          <TextInput
            label="Password"
            mode="outlined"
            value={form.password}
            secureTextEntry
            onChangeText={(text) => handleChange("password", text)}
            style={{ marginBottom: 8 }}
          />

          {/* User Type Selection (Picker) */}
          <View style={{ borderRadius: 5, borderWidth: 1, borderColor: "#323232", marginBottom: 16 }}>
            <Picker
              selectedValue={form.userType}
              onValueChange={(value) => handleChange("userType", value)}
              style={{ height: 50 }}
            >
              <Picker.Item label="Login As" value="" />
              {userTypes.map((type) => (
                <Picker.Item key={type} label={capitalize(type)} value={type} />
              ))}
            </Picker>
          </View>

          {/* Buttons */}
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 20 }}>
            <Button mode="outlined" onPress={handleClear}>Clear</Button>
            <Button mode="contained" onPress={handleSubmit}>Submit</Button>
          </View>
        </View>
      </View>
    </View>
  );
}

