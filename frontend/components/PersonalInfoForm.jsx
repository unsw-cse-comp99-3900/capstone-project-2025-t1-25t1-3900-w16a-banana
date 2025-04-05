import React from "react";
import { View } from "react-native";
import { TextInput, Text, HelperText } from "react-native-paper";
import { isMobilePhone, isStrongPassword } from "validator";
import isEmail from "validator/lib/isEmail";

// customer: username, email, phone, password, confirmPassword
// driver: first name, last name, email, phone, password, confirmPassword
// restaurant: business name, email, phone, password, confirmPassword
// admin: first_name, last_name, email, password, confirmPassword
export default function PersonalInfoForm ({ form, setForm, userType }) {
  const handleChange = (key, value) => {
    setForm((prevForm) => ({ ...prevForm, [key]: value }));
  };

  const isValidEmail = form.email && !isEmail(form.email);
  const isValidPhone = form.phone && !isMobilePhone(form.phone, "en-AU");
  const isValidPassword = form.password && !isStrongPassword(form.password);
  const doPasswordsMatch = form.password && form.confirmPassword && form.password !== form.confirmPassword;

  // determine types
  const isCustomer = userType === "customer";
  const isDriver = userType === "driver";
  const isRestaurant = userType === "restaurant";
  const isAdmin = userType === "admin";

  return (
    <View style={{ marginBottom: 15, }}>
      {isCustomer && (
        <TextInput
          label="Username"
          mode="outlined"
          value={form.username}
          onChangeText={(text) => handleChange("username", text)}
          style={{ marginBottom: 8 }}
        />
      )}
      {(isDriver || isAdmin) && (
        <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
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
      {isRestaurant && (
        <TextInput
          label="Business Name"
          mode="outlined"
          value={form.businessName}
          onChangeText={(text) => handleChange("businessName", text)}
          style={{ marginBottom: 8 }}
        />
      )}
      {/* Common Fields: email, phone, password, confirm password */}
      <TextInput
        label="Email"
        mode="outlined"
        value={form.email}
        keyboardType="email-address"
        error={isValidEmail}
        onChangeText={(text) => handleChange("email", text)}
        style={{ marginBottom: isValidEmail ? 0 : 8 }}
      />
      {isValidEmail ? (
        <HelperText type="error" visible={true} style={{ marginBottom: 8 }}>
          Please enter a valid email address.
        </HelperText>
      ) : null}

      {/* phone */}
      {!isAdmin && (<TextInput
        label="Phone"
        mode="outlined"
        value={form.phone}
        keyboardType="phone-pad"
        error={isValidPhone}
        onChangeText={(text) => handleChange("phone", text)}
        style={{ marginBottom: isValidPhone ? 0 : 8 }}
      />)}
      {isValidPhone ? (
        <HelperText type="error" visible={true} style={{ marginBottom: 8 }}>
          Please enter a valid Australian phone number.
        </HelperText>
      ) : null}
      {/* password and confirm password on the same row */}
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <TextInput
          mode="outlined"
          label="Password"
          value={form.password}
          secureTextEntry
          error={isValidPassword}
          onChangeText={(text) => handleChange("password", text)}
          style={{ flex: 1, marginRight: 5 }}
        />
        <TextInput
          label="Confirm Password"
          mode="outlined"
          value={form.confirmPassword}
          secureTextEntry
          error={doPasswordsMatch}
          onChangeText={(text) => handleChange("confirmPassword", text)}
          style={{ flex: 1, marginLeft: 5 }}
        />
      </View>
      {isValidPassword ? (
        <HelperText type="error" visible={true}>
          Password must be at least 8 characters long and contain a number, a lowercase letter, and an uppercase letter.
        </HelperText>
      ) : null}
      {doPasswordsMatch ? (
        <HelperText type="error" visible={true}>
          Passwords do not match.
        </HelperText>
      ) : null}
    </View>
  );
};
