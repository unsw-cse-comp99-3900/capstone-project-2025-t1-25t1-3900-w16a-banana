import React from "react";
import { View, Image } from "react-native";
import { TextInput, Button, Card } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";

// the component has a textfield at the top,
// then a preview image on the left, and a upload button on the right.
export default function DriverImageUpload ({ label, form, setForm, fieldKey }) {
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setForm({ ...form, [fieldKey]: result.assets[0].uri });
    }
  };

  return (
    <Card style={{ padding: 10, marginBottom: 8 }}>
      <TextInput
        label={label}
        mode="outlined"
        value={form[fieldKey + "Number"] || ""}
        onChangeText={(text) => setForm({ ...form, [fieldKey + "Number"]: text })}
        style={{ marginBottom: 8 }}
      />
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        {form[fieldKey] && (
          <Image source={{ uri: form[fieldKey] }} style={{ width: 100, height: 80, borderRadius: 5 }} />
        )}
        <Button mode="outlined" onPress={pickImage}>Upload {label} Image</Button>
      </View>
    </Card>
  );
};
