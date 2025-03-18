import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { Button, Avatar, Portal, Dialog } from "react-native-paper";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import { BACKEND } from "../../constants/backend";
import useAuth from "../../../hooks/useAuth";
import useToast from "../../../hooks/useToast";

export default function Profile() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const { isContextLoading, contextProfile, login } = useAuth();
  const { showToast } = useToast();

  // dialogue state variables
  const [selectedImage, setSelectedImage] = useState(null);
  const [dialogVisible, setDialogVisible] = useState(false);

  useEffect(() => {
    if (isContextLoading) return;
    if (profile) return;

    const fetchProfile = async () => {
      const url = `${BACKEND}/auth/me`;
      const config = { headers: { Authorization: contextProfile.token } };

      try {
        const response = await axios.get(url, config);
        setProfile(response.data);
        console.log(response.data);

        // also saves the latest profile
        login(response.data);
      } catch (error) {
        console.error("Error fetching profile:", error);
        showToast("Error fetching profile... Please try again later.", "error");
        router.navigate("/customer");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [contextProfile]);

  // pick the image
  const handleImagePick = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
  
    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      setDialogVisible(true);  // Show confirmation dialog
    }
  };

  // upload the image
  const handleUploadImage = async () => {
    setDialogVisible(false);
    if (!selectedImage) return;
  
    const imageResponse = await fetch(selectedImage);
    const imageBlob = await imageResponse.blob();
  
    const formData = new FormData();
    formData.append("profile_image", imageBlob, "profile.jpg");
  
    // prepare
    const url = `${BACKEND}/customer/update/profile`;
    const config = { headers: { Authorization: contextProfile.token } };
    
    try {
      const response = await axios.put(url, formData, config);
      console.log(response)
      showToast("Profile picture updated!", "success");

      // save this to the profile
      setProfile(response.data);
      login(response.data);
    } catch (error) {
      console.log(error);
      showToast(error.response?.data?.message || "Error updating profile picture.", "error");
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#6200ee" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, alignItems: "center", paddingHorizontal: 16, paddingVertical: 25, backgroundColor: "#f9f9f9" }}>
      {/* a dialogue component for the image upload */}
      <Portal>
        <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)}>
          <Dialog.Title>Upload Profile Picture</Dialog.Title>
          <Dialog.Content>
            <Text>Do you want to update your profile picture?</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDialogVisible(false)}>No</Button>
            <Button onPress={handleUploadImage}>Yes</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {/* Profile Image */}
      <View style={{ alignItems: "center", position: "relative" }}>
        <Avatar.Image
          size={120}
          source={{ uri: `${BACKEND}/${profile.url_profile_image}` }}
        />
        <TouchableOpacity
          onPress={handleImagePick}
          style={{ position: "absolute", bottom: 0, right: -10, backgroundColor: "#4CAF50", borderRadius: 20, padding: 5 }}
        >
          <Text style={{ color: "white", fontSize: 12 }}>✎</Text>
        </TouchableOpacity>
      </View>

      {/* Username, here do not allow edit */}
      <View style={{ flexDirection: "row", alignItems: "center", marginTop: 10 }}>
        <Text style={{ fontSize: 22, fontWeight: "bold" }}>{profile.username}</Text>
      </View>

      {/* Action Buttons */}
      <View style={{ flexDirection: "row", marginTop: 20, gap: 10 }}>
        <Button mode="outlined" icon="heart" onPress={() => router.push("/customer/favourites")}>
          Favourites
        </Button>
        <Button mode="outlined" icon="history" onPress={() => router.push("/customer/history")}>
          History
        </Button>
      </View>

      {/* Personal Info */}
      <View style={{ width: "100%", marginTop: 20, paddingVertical: 10, paddingHorizontal: 18, backgroundColor: "#f0f0f0", borderRadius: 10 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <Text style={{ fontSize: 18, fontWeight: "bold", paddingBottom: 7 }}>Personal Information</Text>
          <TouchableOpacity onPress={() => console.log("Edit Personal Info")}
            style={{ padding: 5 }}>
            <Text style={{ color: "#4CAF50" }}>✎</Text>
          </TouchableOpacity>
        </View>
        <Text style={{ fontSize: 16 }}><Text style={{ fontWeight: "bold" }}>Username:</Text> {profile.username}</Text>
        <Text style={{ fontSize: 16 }}><Text style={{ fontWeight: "bold" }}>Email:</Text> {profile.email}</Text>
        <Text style={{ fontSize: 16 }}><Text style={{ fontWeight: "bold" }}>Phone:</Text> {profile.phone}</Text>
      </View>

      {/* Address Info */}
      <View style={{ width: "100%", marginTop: 20, paddingVertical: 10, paddingHorizontal: 18, backgroundColor: "#f0f0f0", borderRadius: 10 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <Text style={{ fontSize: 18, fontWeight: "bold", paddingBottom: 7, }}>Primary Address</Text>
          <TouchableOpacity onPress={() => console.log("Edit Address Info")}
            style={{ padding: 5 }}>
            <Text style={{ color: "#4CAF50" }}>✎</Text>
          </TouchableOpacity>
        </View>
        <Text style={{ fontSize: 16 }}><Text style={{ fontWeight: "bold" }}>Address:</Text> {profile.address}</Text>
        <Text style={{ fontSize: 16 }}><Text style={{ fontWeight: "bold" }}>Suburb:</Text> {profile.suburb}</Text>
        <Text style={{ fontSize: 16 }}><Text style={{ fontWeight: "bold" }}>State:</Text> {profile.state}</Text>
        <Text style={{ fontSize: 16 }}><Text style={{ fontWeight: "bold" }}>Postcode:</Text> {profile.postcode}</Text>
      </View>
    </View>
  );
}