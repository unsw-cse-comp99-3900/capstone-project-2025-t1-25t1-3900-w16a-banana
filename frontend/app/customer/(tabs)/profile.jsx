import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, ActivityIndicator } from "react-native";
import { Button, Avatar } from "react-native-paper";
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
  const { isContextLoading, contextProfile } = useAuth();
  const { showToast } = useToast();

  useEffect(() => {
    if (isContextLoading) return;

    const fetchProfile = async () => {
      const url = `${BACKEND}/auth/me`;
      const config = { headers: { Authorization: contextProfile.token } };

      try {
        const response = await axios.get(url, config);
        setProfile(response.data);
        console.log(response.data);
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

  const handleImagePick = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) {
      console.log("Selected Image:", result.assets[0].uri);
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
    <View style={{ flex: 1, alignItems: "center", padding: 16, backgroundColor: "#f9f9f9" }}>
      {/* Profile Image */}
      <View style={{ alignItems: "center", position: "relative" }}>
        <Avatar.Image
          size={100}
          source={{ uri: `${BACKEND}/${profile.url_profile_image}` }}
        />
        <TouchableOpacity
          onPress={handleImagePick}
          style={{ position: "absolute", bottom: 0, right: -10, backgroundColor: "#4CAF50", borderRadius: 20, padding: 5 }}
        >
          <Text style={{ color: "white", fontSize: 12 }}>✎</Text>
        </TouchableOpacity>
      </View>

      {/* Username */}
      <View style={{ flexDirection: "row", alignItems: "center", marginTop: 10 }}>
        <Text style={{ fontSize: 18, fontWeight: "bold" }}>{profile.username}</Text>
        <TouchableOpacity onPress={() => console.log("Edit Username")}>
          <Text style={{ marginLeft: 10, color: "#4CAF50" }}>✎</Text>
        </TouchableOpacity>
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
      <View style={{ width: "100%", marginTop: 20, padding: 10, backgroundColor: "#f0f0f0", borderRadius: 10 }}>
        <Text style={{ fontWeight: "bold" }}>Phone</Text>
        <Text>{profile.phone}</Text>
      </View>

      {/* Address Info */}
      <View style={{ width: "100%", marginTop: 10, padding: 10, backgroundColor: "#f0f0f0", borderRadius: 10 }}>
        <Text style={{ fontWeight: "bold" }}>Primary Address</Text>
        <Text>{`${profile.address}, ${profile.suburb}, ${profile.state} ${profile.postcode}`}</Text>
      </View>
    </View>
  );
}