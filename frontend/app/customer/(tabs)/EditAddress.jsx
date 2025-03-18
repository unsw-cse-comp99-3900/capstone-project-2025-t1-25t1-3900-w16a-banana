import React, { useState } from "react";
import { View } from "react-native";
import { Appbar, Button, Text } from "react-native-paper";
import { useRouter } from "expo-router";
import axios from "axios";
import { BACKEND } from "../../../constants/backend";
import useAuth from "../../../hooks/useAuth";
import useToast from "../../../hooks/useToast";
import AddressForm from "../../../components/AddressForm";
import { isPostalCode } from "validator";

export default function EditAddress() {
  const router = useRouter();
  const { contextProfile, login } = useAuth();
  const { showToast } = useToast();
  
  // Initialize form state with existing user address data
  const [form, setForm] = useState({
    address: contextProfile.address || "",
    suburb: contextProfile.suburb || "",
    state: contextProfile.state || "",
    postcode: contextProfile.postcode || "",
  });
  
  // Reset form to original address data
  const handleReset = () => {
    setForm({
      address: contextProfile.address,
      suburb: contextProfile.suburb,
      state: contextProfile.state,
      postcode: contextProfile.postcode,
    });
  };

  // Submit form data to update address
  const handleSubmit = async () => {
    // Validate postcode
    if (!isPostalCode(form.postcode, "AU")) {
      showToast("Please enter a valid Australian postcode.", "error");
      return;
    }

    // Prepare request
    const url = `${BACKEND}/customer/update/profile`;
    const config = { headers: { Authorization: contextProfile.token } };
    
    // Create form data
    const formData = new FormData();
    formData.append("address", form.address);
    formData.append("suburb", form.suburb);
    formData.append("state", form.state);
    formData.append("postcode", form.postcode);
    
    try {
      const response = await axios.put(url, form, config);
      showToast("Address updated successfully!", "success");
      console.log(response.data);
      
      // Update the context with the new address data
      login(response.data);
      
      // Navigate back to profile page
      router.navigate("/customer/profile");
    } catch (error) {
      console.error("Error updating address:", error);
      showToast(error.response?.data?.message || "Error updating address.", "error");
    }
  };

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: "#fff" }}>
      {/* App Header with Back Button */}
      <Appbar.Header style={{ marginBottom: 25 }}>
        <Appbar.BackAction onPress={() => router.navigate("/customer/profile")} />
        <Appbar.Content title="Edit Address" />
      </Appbar.Header>

      {/* Address Form */}
      <AddressForm form={form} setForm={setForm} />

      {/* Action Buttons */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 20 }}>
        <Button mode="outlined" onPress={handleReset}>Reset</Button>
        <Button mode="contained" onPress={handleSubmit}>Submit</Button>
      </View>
    </View>
  );
}
