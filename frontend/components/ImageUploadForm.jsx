import React from "react";
import { View, Image } from "react-native";
import { TextInput, IconButton, Card, Text } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";

// the component has a textfield at the top,
// then a preview image on the left, and an upload button (IconButton) on the right.
// the input key can be null, so that the textfield is not rendered.
export default function ImageUploadComponent ({ label, form, setForm, inputKey, imageKey, buttonText }) {
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setForm({ ...form, [imageKey]: result.assets[0].uri });
    }
  };

  return (
    <Card style={{ padding: 12, marginBottom: 12 }}>
      {inputKey && (
        <TextInput
          label={label}
          mode="outlined"
          value={form[inputKey]}
          onChangeText={(text) => setForm({...form, [inputKey]: text})}
          style={{ marginBottom: 4 }}
        />
      )}
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <View style={{ alignItems: "center" }}>
          <IconButton icon="camera" size={30} onPress={pickImage} />
          <Text variant="labelSmall" style={{ width: 120, textAlign: "center" }}>{buttonText}</Text>
        </View>
        {form[imageKey] && (
          <Image 
            source={{ uri: form[imageKey] }} 
            style={{ 
              width: 80, 
              height: 80, 
              borderRadius: 5,
              borderWidth: 1,
              borderColor: "#a6a6a6",
              objectFit: "contain",
            }} 
          />
        )}
      </View>
    </Card>
  );
};
