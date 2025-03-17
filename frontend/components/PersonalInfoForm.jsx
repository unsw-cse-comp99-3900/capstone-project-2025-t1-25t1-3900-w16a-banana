import React, { useState } from "react";
import { View } from "react-native";
import { TextInput, Text, HelperText } from "react-native-paper";
import validator, { isMobilePhone, isStrongPassword } from "validator";
import isEmail from "validator/lib/isEmail";

// customer: username, email, phone, password, confirmPassword
// driver: first name, last name, email, phone, password, confirmPassword
// restaurant: business name, email, phone, password, confirmPassword
export default function PersonalInfoForm ({ form, setForm, userType }) {
  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
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
      {form.email && !isEmail(form.email) && (
        <HelperText type="error" visible={true}>
          Please enter a valid email address.
        </HelperText>
      )}
      <TextInput
        label="Phone"
        mode="outlined"
        value={form.phone}
        keyboardType="phone-pad"
        onChangeText={(text) => handleChange("phone", text)}
        style={{ marginBottom: 8 }}
      />
      {form.phone && !isMobilePhone(form.phone, "en-AU") && (
        <HelperText type="error" visible={true}>
          Please enter a valid Australian phone number.
        </HelperText>
      )}
      {/* passwrod and confirm password on the same row */}
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <TextInput
          mode="outlined"
          label="Password"
          value={form.password}
          secureTextEntry
          onChangeText={(text) => {
            handleChange("password", text);
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
      {form.password && !isStrongPassword(form.password) && (
        <HelperText type="error" visible={true}>
          Password must be at least 8 characters long and contain a number, a lowercase letter, and an uppercase letter.
        </HelperText>
      )}
      {form.password && form.confirmPassword && form.password !== form.confirmPassword && (
        <HelperText type="error" visible={true}>
          Passwords do not match.
        </HelperText>
      )}
    </View>
  );
};
