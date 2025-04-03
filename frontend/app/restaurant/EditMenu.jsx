import React, { useEffect, useState } from "react";
import { View, ScrollView, Image } from "react-native";
import {
  Text,
  TextInput,
  Button,
  ActivityIndicator,
} from "react-native-paper";
import axios from "axios";
import { useRouter } from "expo-router";
import { BACKEND } from "../../constants/backend";
import useAuth from "../../hooks/useAuth";
import useToast from "../../hooks/useToast";
import MenuCategoryEdit from "../../components/MenuCategoryEdit";
import useDialog from "../../hooks/useDialog";

export default function EditMenuPage() {
  const router = useRouter();
  const { contextProfile } = useAuth();
  const { showToast } = useToast();
  const { showDialog } = useDialog();

  // record the restaurantId
  const restaurantId = contextProfile?.id;

  const [loading, setLoading] = useState(true);
  const [menuCategories, setMenuCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState("");

  useEffect(() => {
    fetchMenu();
  }, [restaurantId]);

  // fetch and display the menu.
  const fetchMenu = async () => {
    if (!restaurantId) return;
    setLoading(true);

    const url = `${BACKEND}/restaurant-menu/${restaurantId}`;

    try {
      const response = await axios.get(url);
      setMenuCategories(response.data);
    } catch (error) {
      console.error("Failed to fetch restaurant menu:", error);
      showToast("Failed to fetch restaurant menu", "error");
    } finally {
      setLoading(false);
    }
  };

  const addCategory = async () => {
    if (!newCategoryName.trim()) {
      showToast("Please enter a category name.", "error");
      return;
    }

    // post to add this new category
    const url = `${BACKEND}/restaurant-menu/category/new`;
    const payload = { name: newCategoryName };
    const config = { headers: { Authorization: contextProfile.token } };

    try {
      const response = await axios.post(url, payload, config);

      showToast("New category added.", "success");
      setNewCategoryName("");

      // refresh the menu categories
      await fetchMenu();
    } catch (error) {
      console.error("Failed to add category:", error);
      showToast("Failed to add category.", "error");
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, padding: 16 }}>
      {/* Existing menu categories */}
      {menuCategories.map((cat, displayIndex) => (
        <MenuCategoryEdit
          key={cat.id}
          displayIndex={displayIndex + 1}
          category={cat}
          restaurantId={restaurantId}
          onRefresh={fetchMenu}
        />
      ))}
      {/* New menu categories */}
      <View style={{ marginBottom: 20 }}>
        <Text variant="titleMedium" style={{ marginBottom: 8 }}>
          {`New Menu Category #${menuCategories.length + 1}`}
        </Text>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TextInput
            dense
            mode="outlined"
            label="New Category Name"
            value={newCategoryName}
            onChangeText={setNewCategoryName}
            style={{ flex: 1, marginRight: 8 }}
          />
        <Button
          mode="text"
          icon="check-bold"
          onPress={addCategory}
        />
        </View>
      </View>

      {/* Done Button */}
      <Button mode="outlined" onPress={() => router.replace("/restaurant")} style={{ marginTop: 20 }}>
        Done
      </Button>
    </ScrollView>
  );
}



