import React, { useState } from "react";
import { View } from "react-native";
import { TextInput, Text } from "react-native-paper";
import validator from "validator";

// customer: username, email, phone, password, confirmPassword
// driver: first name, last name, email, phone, password, confirmPassword
// restaurant: business name, email, phone, password, confirmPassword
export default function PersonalInfoForm ({ form, setForm, userType }) {
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

  return (
    <View>
      {userType === "customer" && (
        <TextInput
          label="Username"
          mode="outlined"
          value={form.username}
          onChangeText={(text) => handleChange("username", text)}
          style={{ marginBottom: 8 }}
        />
      )}
      {userType === "driver" && (
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <TextInput
            label="First Name"
            mode="outlined"
            value={form.firstName}
            onChangeText={(text) => handleChange("firstName", text)}
            style={{ flex: 1, marginRight: 5 }}
          />
          <TextInput
            label="Last Name"
            mode="outlined"
            value={form.lastName}
            onChangeText={(text) => handleChange("lastName", text)}
            style={{ flex: 1, marginLeft: 5 }}
          />
        </View>
      )}
      {userType === "restaurant" && (
        <TextInput
          label="Business Name"
          mode="outlined"
          value={form.businessName}
          onChangeText={(text) => handleChange("name", text)}
          style={{ marginBottom: 8 }}
        />
      )}
      {/* Common Fields: email, phone, password, confirm password */}
      <TextInput
        label="Email"
        mode="outlined"
        value={form.email}
        keyboardType="email-address"
        onChangeText={(text) => handleChange("email", text)}
        style={{ marginBottom: 8 }}
      />
      <TextInput
        label="Phone"
        mode="outlined"
        value={form.phone}
        keyboardType="phone-pad"
        onChangeText={(text) => handleChange("phone", text)}
        style={{ marginBottom: 8 }}
      />
      {/* passwrod and confirm password on the same row */}
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <TextInput
          mode="outlined"
          label="Password"
          value={form.password}
          secureTextEntry
          onChangeText={(text) => {
            handleChange("password", text);
            validatePassword(text);
          }}
          style={{ flex: 1, marginRight: 5 }}
        />
        <TextInput
          label="Confirm Password"
          mode="outlined"
          value={form.confirmPassword}
          secureTextEntry
          onChangeText={(text) => handleChange("confirmPassword", text)}
          style={{ flex: 1, marginLeft: 5 }}
        />
      </View>
      {passwordError ? <Text style={{ color: "red" }}>{passwordError}</Text> : null}
    </View>
  );
};
