import React, { useState, useEffect } from "react";
import { View } from "react-native";
import { useRouter } from "expo-router";
import { Button, Text, Appbar, HelperText, Banner, Dialog, Portal, ActivityIndicator } from "react-native-paper";
import useToast from "../hooks/useToast";
import useAuth from "../hooks/useAuth";
import PersonalInfoForm from "./PersonalInfoForm";
import AddressForm from "./AddressForm";
import ImageUploadForm from "./ImageUploadForm";
import MyScrollView from "./MyScrollView";
import { BACKEND } from "../constants/backend";
import axios from "axios";
import isEmail from "validator/lib/isEmail";
import { isMobilePhone, isPostalCode, isStrongPassword } from "validator";

export default function EditProfileForm({ userType }) {
  const router = useRouter();
  const { showToast } = useToast();
  const { contextProfile, login } = useAuth();
  const [form, setForm] = useState({});
  const [isSensitiveChanged, setIsSensitiveChanged] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);

  const setInitialAttributes = () => {
    if (userType === "customer") {
      setForm({
        username: contextProfile?.username || "",
        email: contextProfile?.email || "",
        phone: contextProfile?.phone || "",
        password: "",
        confirmPassword: "",
        username: contextProfile?.username || "",
        address: contextProfile?.address || "",
        suburb: contextProfile?.suburb || "",
        state: contextProfile?.state || "",
        postcode: contextProfile?.postcode || "",
      });
    } else if (userType === "driver") {
      setForm({
        firstName: contextProfile?.first_name || "",
        lastName: contextProfile?.last_name || "",
        email: contextProfile?.email || "",
        phone: contextProfile?.phone || "",
        password: "",
        confirmPassword: "",
        licenseNumber: contextProfile?.license_number || "",
        carPlate: contextProfile?.car_plate || "",
        licenseImage: null,
        registrationImage: null,
      });
    } else if (userType === "restaurant") {
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
    }
  };

  useEffect(() => {
    setInitialAttributes();
  }, [contextProfile, userType]);

  // Detect if sensitive fields changed
  useEffect(() => {
    if (!contextProfile) return;

    let hasSensitiveChange = false;
    if (userType === "driver") {
      hasSensitiveChange =
        form.firstName !== contextProfile.first_name ||
        form.lastName !== contextProfile.last_name ||
        form.licenseNumber !== contextProfile.license_number ||
        form.carPlate !== contextProfile.car_plate ||
        form.licenseImage !== null ||
        form.registrationImage !== null;
    } else if (userType === "restaurant") {
      hasSensitiveChange =
        form.businessName !== contextProfile.name ||
        form.abn !== contextProfile.abn ||
        form.address !== contextProfile.address ||
        form.suburb !== contextProfile.suburb ||
        form.state !== contextProfile.state ||
        form.postcode !== contextProfile.postcode;
    }

    setIsSensitiveChanged(hasSensitiveChange);
  }, [form, contextProfile, userType]);

  // Reset form fields, and turn off the modal
  const handleReset = () => {
    setInitialAttributes();
    setDialogVisible(false);
  };

  const handleSubmit = async () => {
    if (!isEmail(form.email)) {
      showToast("Please enter a valid email address.", "error");
      return;
    }

    // check phone
    if (!isMobilePhone(form.phone, "en-AU")) {
      showToast("Please enter a valid Australian phone number.", "error");
      return;
    }

    // if password exist, then require strong password, and match confirm password
    if (form.password && !isStrongPassword(form.password)) {
      showToast("Password is not strong enough.", "error");
      return;
    }

    if (form.password && form.password !== form.confirmPassword) {
      showToast("Passwords do not match.", "error");
      return;
    }

    // postcode 4 digits
    if ((userType === "restaurant" || userType === "customer") && !isPostalCode(form.postcode, "AU")) {
      showToast("Please enter a valid Australian postcode.", "error");
      return;
    }

    // abn: 11 digits
    if (userType === "restaurant" && !(form.abn.length === 11 && !isNaN(form.abn))) {
      showToast("Please enter a valid ABN.", "error");
      return;
    }

    // driver license number all digits
    if (userType === "driver" && !form.licenseNumber.match(/^\d+$/)) {
      showToast("Please enter a valid license number.", "error");
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

    // create the form data
    const formData = new FormData();

    // consider the user types
    if (userType === "customer") {
      if (form.username !== contextProfile.username) formData.append("username", form.username);
      if (form.email !== contextProfile.email) formData.append("email", form.email);
      if (form.phone !== contextProfile.phone) formData.append("phone", form.phone);
      if (form.password) formData.append("password", form.password);
      if (form.address !== contextProfile.address) formData.append("address", form.address);
      if (form.suburb !== contextProfile.suburb) formData.append("suburb", form.suburb);
      if (form.state !== contextProfile.state) formData.append("state", form.state);
      if (form.postcode !== contextProfile.postcode) formData.append("postcode", form.postcode);

    } else if (userType === "driver") {
      if (form.firstName !== contextProfile.first_name) formData.append("first_name", form.firstName);
      if (form.lastName !== contextProfile.last_name) formData.append("last_name", form.lastName);
      if (form.email !== contextProfile.email) formData.append("email", form.email);
      if (form.phone !== contextProfile.phone) formData.append("phone", form.phone);
      if (form.password) formData.append("password", form.password);
      if (form.licenseNumber !== contextProfile.license_number) formData.append("license_number", form.licenseNumber);
      if (form.carPlate !== contextProfile.car_plate) formData.append("car_plate", form.carPlate);
  
      if (form.licenseImage) {
        const licenseImageResponse = await fetch(form.licenseImage);
        const licenseImageBlob = await licenseImageResponse.blob();
        formData.append("license_image", licenseImageBlob, "license.jpg");
      }
      
      if (form.registrationImage) {
        const registrationImageResponse = await fetch(form.registrationImage);
        const registrationImageBlob = await registrationImageResponse.blob();
        formData.append("registration_paper", registrationImageBlob, "registration.jpg");
      }

    } else if (userType === "restaurant") {
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
    }

    // API
    const url = `${BACKEND}/${userType}/update`;
    const config = { headers: { Authorization: contextProfile.token } };

    try {
      const response = await axios.put(url, formData, config);

      showToast("Profile updated successfully!", "success");

      // Save updated profile to context
      login(response.data);
      router.navigate(`/${userType}/profile`);
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
      {/* Confirmation Dialog for sensitive updates */}
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
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Edit Profile" />
      </Appbar.Header>

      {/* Alert Banner for sensitive updates */}
      {isSensitiveChanged && (
        <Banner visible={true} style={{ backgroundColor: "#FFF3CD", marginBottom: 16 }}>
          <Text style={{ fontSize: 16, fontWeight: "bold", color: "#856404" }}>
            Warning: Changing sensitive fields will require admin approval.
          </Text>
        </Banner>
      )}

      {/* Personal information section */}
      <PersonalInfoForm form={form} setForm={setForm} userType={userType} />
      
      {/* customer and restaurant fill the address */}
      {(userType === "customer" || userType === "restaurant") && <AddressForm form={form} setForm={setForm} />}
      
      {/* driver uploads license and rego paper */}
      {userType === "driver" && (
        <View style={{ marginHorizontal: 4 }}>
          <Text variant="titleMedium" style={{ marginTop: 25, marginBottom: 10 }}>Driver Information (Leave images empty if no change)</Text>
          <ImageUploadForm label="License Number" form={form} setForm={setForm} inputKey="licenseNumber" imageKey="licenseImage" buttonText="Upload License Image" />
          <ImageUploadForm label="Car Plate Number" form={form} setForm={setForm} inputKey="carPlate" imageKey="registrationImage" buttonText="Upload Registration Paper Image" />
        </View>
      )}

      {/* restaurant uploads 3 images */}
      {userType === "restaurant" && (
        <View style={{ marginHorizontal: 4 }}>
          <Text variant="titleMedium" style={{ marginBottom: 10, marginTop: 20 }}>Business Images (Leave empty if no change)</Text>
          <ImageUploadForm form={form} setForm={setForm} imageKey="image1" buttonText="Upload Image 1" />
          <ImageUploadForm form={form} setForm={setForm} imageKey="image2" buttonText="Upload Image 2" />
          <ImageUploadForm form={form} setForm={setForm} imageKey="image3" buttonText="Upload Image 3" />
        </View>
      )}

      {/* Helper Text for Sensitive Changes */}
      {isSensitiveChanged && (
        <HelperText type="error" visible={true}>
          <Text style={{ fontWeight: "bold" }} type="error">Submission Notice: &nbsp;</Text>
          You have modified sensitive fields. Your account will be temporarily blocked until admin approval.
        </HelperText>
      )}

      {/* Submit & Reset Buttons */}
      <View style={{ flexDirection: "row", justifyContent: "space-around", marginTop: 16 }}>
        <Button mode="outlined" onPress={handleReset}>Reset</Button>
        <Button mode="contained" onPress={handleSubmit}>Submit</Button>
      </View>
    </MyScrollView>
  );
}
