import React, { useState, useEffect } from "react";
import { View } from "react-native";
import { useRouter } from "expo-router";
import { Button, Text, Appbar, HelperText, Banner, Dialog, Portal, ActivityIndicator } from "react-native-paper";
import useToast from "../../../hooks/useToast";
import useAuth from "../../../hooks/useAuth";
import PersonalInfoForm from "../../../components/PersonalInfoForm";
import AddressForm from "../../../components/AddressForm";
import ImageUploadForm from "../../../components/ImageUploadForm";
import MyScrollView from "../../../components/MyScrollView";
import { BACKEND } from "../../../constants/backend";
import axios from "axios";
import isEmail from "validator/lib/isEmail";
import { isPostalCode, isStrongPassword } from "validator";

export default function EditProfile() {
  const router = useRouter();
  const { showToast } = useToast();
  const { contextProfile, login } = useAuth();
  const [form, setForm] = useState({});

  useEffect(() => {
    setForm({
      businessName: contextProfile?.name || "",
      email: contextProfile?.email || "",
      phone: contextProfile?.phone || "",
      password: "",
      confirmPassword: "",
      abn: contextProfile?.abn || "",
      address: contextProfile?.address || "",
      suburb: contextProfile?.suburb || "",
      state: contextProfile?.state || "",
      postcode: contextProfile?.postcode || "",
      image1: null,
      image2: null,
      image3: null,
    });
  }, [contextProfile]);

  const [isSensitiveChanged, setIsSensitiveChanged] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);

  // Detect if sensitive fields have changed
  useEffect(() => {
    if (!contextProfile) return;

    const isChanged =
      form.businessName !== contextProfile.name ||
      form.abn !== contextProfile.abn ||
      form.address !== contextProfile.address ||
      form.suburb !== contextProfile.suburb ||
      form.state !== contextProfile.state ||
      form.postcode !== contextProfile.postcode;

    setIsSensitiveChanged(isChanged);
  }, [form, contextProfile]);

  const handleReset = () => {
    setForm({
      businessName: contextProfile.name || "",
      email: contextProfile.email || "",
      phone: contextProfile.phone || "",
      password: "",
      confirmPassword: "",
      abn: contextProfile.abn || "",
      address: contextProfile.address || "",
      suburb: contextProfile.suburb || "",
      state: contextProfile.state || "",
      postcode: contextProfile.postcode || "",
      image1: null,
      image2: null,
      image3: null,
    });

    setDialogVisible(false);
  };

  const handleSubmit = async () => {
    if (!isEmail(form.email)) {
      showToast("Please enter a valid email address.", "error");
      return;
    }

    if (form.password && !isStrongPassword(form.password)) {
      showToast("Password is not strong enough.", "error");
      return;
    }

    if (form.password && form.password !== form.confirmPassword) {
      showToast("Passwords do not match.", "error");
      return;
    }

    if (!isPostalCode(form.postcode, "AU")) {
      showToast("Please enter a valid Australian postcode.", "error");
      return;
    }

    if (isSensitiveChanged) {
      setDialogVisible(true);
      return;
    }

    await submitProfileUpdate();
  };

  const submitProfileUpdate = async () => {
    setDialogVisible(false);

    const formData = new FormData();

    if (form.businessName !== contextProfile.name) formData.append("name", form.businessName);
    if (form.email !== contextProfile.email) formData.append("email", form.email);
    if (form.phone !== contextProfile.phone) formData.append("phone", form.phone);
    if (form.password) formData.append("password", form.password);
    if (form.abn !== contextProfile.abn) formData.append("abn", form.abn);
    if (form.address !== contextProfile.address) formData.append("address", form.address);
    if (form.suburb !== contextProfile.suburb) formData.append("suburb", form.suburb);
    if (form.state !== contextProfile.state) formData.append("state", form.state);
    if (form.postcode !== contextProfile.postcode) formData.append("postcode", form.postcode);

    // Handle image uploads
    if (form.image1) {
      const image1Response = await fetch(form.image1);
      const image1Blob = await image1Response.blob();
      formData.append("image1", image1Blob, "restaurant_image1.jpg");
    }

    if (form.image2) {
      const image2Response = await fetch(form.image2);
      const image2Blob = await image2Response.blob();
      formData.append("image2", image2Blob, "restaurant_image2.jpg");
    }

    if (form.image3) {
      const image3Response = await fetch(form.image3);
      const image3Blob = await image3Response.blob();
      formData.append("image3", image3Blob, "restaurant_image3.jpg");
    }

    try {
      const url = `${BACKEND}/restaurant/update`;
      const config = { headers: { Authorization: contextProfile.token } };

      const response = await axios.put(url, formData, config);
      showToast("Profile update submitted for admin approval.", "success");

      // Save updated profile to context
      login(response.data);
      router.navigate("/restaurant/profile");
    } catch (error) {
      console.error("Error updating profile:", error);
      showToast(error.response?.data?.message || "Error updating profile.", "error");
    }
  };

  if (!contextProfile) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#6200ee" />
      </View>
    );
  }

  return (
    <MyScrollView>
      {/* Confirmation Dialog */}
      <Portal>
        <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)}>
          <Dialog.Title>Confirm Update</Dialog.Title>
          <Dialog.Content>
            <Text>Updating sensitive information will temporarily block your account. Do you want to proceed?</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDialogVisible(false)}>Cancel</Button>
            <Button onPress={submitProfileUpdate}>Proceed</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {/* Back Button & Title */}
      <Appbar.Header>
        <Appbar.BackAction onPress={() => router.navigate("/restaurant/profile")} />
        <Appbar.Content title="Edit Restaurant Profile" />
      </Appbar.Header>

      {/* Banner for Sensitive Changes */}
      <Banner
        visible={true}
        actions={[]}
        style={{ backgroundColor: "#FFF3CD", marginBottom: 16 }}
      >
        <Text style={{ fontSize: 16, fontWeight: "bold", color: "#856404" }}>
          Warning:&nbsp;
        </Text>
        <Text style={{ color: "#856404" }}>
          Changing your business name, ABN, or address details will require admin approval
          and temporarily block your account until reviewed.
        </Text>
      </Banner>

      {/* Business Info Section */}
      <PersonalInfoForm form={form} setForm={setForm} userType="restaurant" />

      {/* Address Section */}
      <AddressForm form={form} setForm={setForm} />

      {/* Business Images */}
      <Text variant="titleMedium" style={{ marginBottom: 10, marginTop: 20 }}>Business Images (Leave empty if no change)</Text>
      <ImageUploadForm form={form} setForm={setForm} imageKey="image1" buttonText="Upload Image 1" />
      <ImageUploadForm form={form} setForm={setForm} imageKey="image2" buttonText="Upload Image 2" />
      <ImageUploadForm form={form} setForm={setForm} imageKey="image3" buttonText="Upload Image 3" />

      {/* Helper Text for Sensitive Changes */}
      {isSensitiveChanged ? (
        <HelperText type="error" visible={true}>
          <Text style={{ fontWeight: "bold" }} type="error">Submission Notice: &nbsp;</Text>
          You have modified sensitive fields. Your account will be temporarily blocked until admin approval.
        </HelperText>
      ) : null}

      <View style={{ flexDirection: "row", justifyContent: "space-around", marginTop: 8, marginBottom: 20 }}>
        <Button mode="outlined" onPress={handleReset}>Reset</Button>
        <Button mode="contained" onPress={handleSubmit}>Submit</Button>
      </View>
    </MyScrollView>
  );
}
