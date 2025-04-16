import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Avatar, Portal, Dialog, Button } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import { BACKEND } from "../constants/backend";
import useAuth from "../hooks/useAuth";
import useToast from "../hooks/useToast";

/**
 * ProfileAvatar - A profile avatar component allowing the user to view and update their profile picture.
 *
 * userType: the role of the current user (e.g., "customer", "driver", "restaurant", "admin"), used to determine the API endpoint for updating the profile image
 */
export default function ProfileAvatar({ userType }) {
  const { contextProfile, login } = useAuth();
  const { showToast } = useToast();
  
  const [selectedImage, setSelectedImage] = useState(null);
  const [dialogVisible, setDialogVisible] = useState(false);

  // Pick the image
  const handleImagePick = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      setDialogVisible(true); // Show confirmation dialog
    }
  };

  // Upload the image
  const handleUploadImage = async () => {
    setDialogVisible(false);
    if (!selectedImage) return;

    const imageResponse = await fetch(selectedImage);
    const imageBlob = await imageResponse.blob();

    const formData = new FormData();
    formData.append("profile_image", imageBlob, "profile.jpg");

    // Prepare
    const url = `${BACKEND}/${userType}/update`;
    const config = { headers: { Authorization: contextProfile.token } };

    try {
      const response = await axios.put(url, formData, config);
      showToast("Profile picture updated!", "success");
      login(response.data);
    } catch (error) {
      console.error(error);
      showToast(error.response?.data?.message || "Error updating profile picture.", "error");
    }
  };

  return (
    <View style={{ alignItems: "center", position: "relative" }}>
      <Avatar.Image
        size={120}
        source={{ uri: `${BACKEND}/${contextProfile.url_profile_image}` }}
      />
      <TouchableOpacity
        onPress={handleImagePick}
        style={{ position: "absolute", bottom: 0, right: -10, backgroundColor: "#4CAF50", borderRadius: 20, padding: 5 }}
      >
        <Text style={{ color: "white", fontSize: 12 }}>✎</Text>
      </TouchableOpacity>

      {/* Dialog for confirmation */}
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
    </View>
  );
}