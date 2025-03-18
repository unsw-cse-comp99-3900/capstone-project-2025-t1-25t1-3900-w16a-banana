import React, { useState, useEffect } from "react";
import { View, Alert } from "react-native";
import { useRouter } from "expo-router";
import { Button, Text, Appbar, HelperText, Banner, Dialog, Portal, ActivityIndicator } from "react-native-paper";
import useToast from "../../../hooks/useToast";
import useAuth from "../../../hooks/useAuth";
import PersonalInfoForm from "../../../components/PersonalInfoForm";
import ImageUploadForm from "../../../components/ImageUploadForm";
import MyScrollView from "../../../components/MyScrollView";
import { BACKEND } from "../../../constants/backend";
import axios from "axios";
import isEmail from "validator/lib/isEmail";
import { isStrongPassword } from "validator";

export default function EditProfile() {
  const router = useRouter();
  const { showToast } = useToast();
  const { contextProfile, login } = useAuth();
  const [form, setForm] = useState({});

  useEffect(() => {
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
  }, [contextProfile]);

  const [isSensitiveChanged, setIsSensitiveChanged] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);

  // when the sensitive fields are changed, show the alert message to the user
  useEffect(() => {
    if (!contextProfile) return;

    const isChanged = form.firstName !== contextProfile.first_name 
      || form.lastName !== contextProfile.last_name 
      || form.licenseNumber !== contextProfile.license_number
      || form.carPlate !== contextProfile.car_plate
      || form.licenseImage !== null
      || form.registrationImage !== null;

    setIsSensitiveChanged(isChanged);
  }, [form, contextProfile]);

  const handleReset = () => {
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
    
    if (isSensitiveChanged) {
      setDialogVisible(true);
      return;
    }

    await submitProfileUpdate();
  };

  const submitProfileUpdate = async () => {
    setDialogVisible(false);
    
    const formData = new FormData();

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
    
    try {
      const url = `${BACKEND}/driver/update`;
      const config = { headers: { Authorization: contextProfile.token } };
      
      const response = await axios.put(url, formData, config);
      showToast("Profile update submitted for admin approval.", "success");

      // save the updated profile to the context
      login(response.data);
      router.navigate("/driver/profile");
    } catch (error) {
      console.error("Error updating profile:", error);
      showToast(error.response?.data?.message || "Error updating profile.", "error");
    }
  };

  // if the contextProfile is not loaded, show a loading screen
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
      <Appbar.Header style={{ marginBottom: 0 }}>
        <Appbar.BackAction onPress={() => router.navigate("/driver/profile")} />
        <Appbar.Content title="Edit Driver Profile" />
      </Appbar.Header>

      {/* Alert Banner */}
      <Banner
        visible={true}
        actions={[]}
        style={{ backgroundColor: "#FFF3CD", marginBottom: 16 }}
      >
        <Text style={{ fontSize: 16, fontWeight: "bold", color: "#856404" }}>
          Warning:&nbsp; 
        </Text>
        <Text style={{ color: "#856404" }}>
          Changing your first name, last name, license number, car plate, or images will require admin approval
          and temporarily block your account until reviewed.
        </Text>
      </Banner>

      {/* Personal Info Section */}
      <Text variant="titleMedium" style={{ marginBottom: 10 }}>Personal Information (Leave password empty if no change)</Text>
      <PersonalInfoForm form={form} setForm={setForm} userType="driver" />

      {/* Driver Info Section: Upload two images */}
      <Text variant="titleMedium" style={{ marginTop: 25, marginBottom: 10 }}>Driver Information (Leave images empty if no change)</Text>
      <ImageUploadForm label="License Number" form={form} setForm={setForm} inputKey="licenseNumber" imageKey="licenseImage" buttonText="Upload License Image" />
      <ImageUploadForm label="Car Plate Number" form={form} setForm={setForm} inputKey="carPlate" imageKey="registrationImage" buttonText="Upload Registration Paper Image" />
      
      {/* Helper Text for Sensitive Changes */}
      {isSensitiveChanged ? (
        <HelperText type="error" visible={true}>
          Submission Notice: You have modified sensitive fields. Your account will be temporarily blocked until admin approval.
        </HelperText>
      ) : null}
      
      {/* Submit & Reset Buttons */}
      <View style={{ flexDirection: "row", justifyContent: "space-around", marginTop: 8, marginBottom: 20 }}>
        <Button mode="outlined" onPress={handleReset}>Reset</Button>
        <Button mode="contained" onPress={handleSubmit}>Submit</Button>
      </View>
    </MyScrollView>
  );
}
