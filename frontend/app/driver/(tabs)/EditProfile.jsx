import React, { useState, useEffect } from "react";
import { View } from "react-native";
import { useRouter } from "expo-router";
import { Button, Text, IconButton, HelperText, Banner, Appbar, ActivityIndicator } from "react-native-paper";
import useToast from "../../../hooks/useToast";
import useAuth from "../../../hooks/useAuth";
import PersonalInfoForm from "../../../components/PersonalInfoForm";
import ImageUploadForm from "../../../components/ImageUploadForm";
import MyScrollView from "../../../components/MyScrollView";

export default function EditProfile() {
  const router = useRouter();
  const { showToast } = useToast();
  const { contextProfile } = useAuth();

  const [form, setForm] = useState({});

  useEffect(() => {
    if (!contextProfile) return;

    setForm({
      firstName: contextProfile.first_name,
      lastName: contextProfile.last_name,
      email: contextProfile.email,
      phone: contextProfile.phone,
      password: "",
      confirmPassword: "",
      licenseNumber: contextProfile.license_number,
      carPlate: contextProfile.car_plate,
      licenseImage: null,
      registrationImage: null,
    });
  }, [contextProfile]);

  const [isSensitiveChanged, setIsSensitiveChanged] = useState(false);

  // when the sensitive fields are changed, show the alert message to the user
  useEffect(() => {
    if (!contextProfile) return;

    const isChanged = form.firstName !== contextProfile.first_name 
      || form.lastName !== contextProfile.lastName 
      || form.licenseNumber !== contextProfile.license_number
      || form.carPlate !== contextProfile.car_plate
      || form.licenseImage !== null
      || form.registrationImage !== null;

    setIsSensitiveChanged(isChanged);
  }, [form]);

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
  };

  const handleSubmit = async () => {
    // Leave empty for now
  };

  // if the contextProfile is not loaded, show a loading screen
  if (!contextProfile) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#6200ee" />
      </View>
    );
  }

  // check which part is different
  console.log(form.firstName, contextProfile.first_name, form.firstName !== contextProfile.first_name);
  console.log(form.lastName, contextProfile.last_name, form.lastName !== contextProfile.last_name);
  console.log(form.licenseNumber, contextProfile.license_number, form.licenseNumber !== contextProfile.license_number);
  console.log(form.carPlate, contextProfile.car_plate, form.carPlate !== contextProfile.car_plate);
  console.log(form.licenseImage);
  console.log(form.registrationImage);

  return (
    <MyScrollView>
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
      <Text variant="titleMedium" style={{ marginBottom: 10 }}>Personal Information</Text>
      <PersonalInfoForm form={form} setForm={setForm} userType="driver" />

      {/* Driver Info Section: Upload two images */}
      <Text variant="titleMedium" style={{ marginTop: 15, marginBottom: 10 }}>Driver Information</Text>
      <ImageUploadForm label="License Number" form={form} setForm={setForm} inputKey="licenseNumber" imageKey="licenseImage" buttonText="Upload License Image" />
      <ImageUploadForm label="Car Plate Number" form={form} setForm={setForm} inputKey="carPlate" imageKey="registrationImage" buttonText="Upload Registration Paper Image" />
      
      {/* Helper Text for Sensitive Changes */}
      {isSensitiveChanged ? (
        <HelperText type="error" visible={true}>
          You have modified sensitive fields. Your account will be temporarily blocked until admin approval.
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
