import React, { useEffect, useState } from "react";
import { View } from "react-native";
import {
  Text,
  ActivityIndicator,
  DataTable,
  TextInput,
  Button,
  IconButton,
  Portal,
  Dialog,
} from "react-native-paper";
import axios from "axios";
import { useRouter } from "expo-router";
import { BACKEND } from "../../constants/backend";
import useAuth from "../../hooks/useAuth";
import useToast from "../../hooks/useToast";

export default function EditMenuPage() {
  const router = useRouter();
  const { contextProfile } = useAuth();
  const { showToast } = useToast();

  // We'll use contextProfile.id as the restaurant ID
  const restaurantId = contextProfile?.id;

  const [menuCategories, setMenuCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Local edit states: track changes to category/item fields
  const [editedCategories, setEditedCategories] = useState({});
  // shaped like: { [categoryId]: { name: "New Cat Name", items: { [itemId]: { name, price, description } } } }

  // For confirmation dialog
  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [onConfirm, setOnConfirm] = useState(() => {});

  // Fetch the restaurant’s menu
  useEffect(() => {
    if (!restaurantId) return;

    const fetchMenu = async () => {
      try {
        const response = await axios.get(`${BACKEND}/restaurant-menu/${restaurantId}`);
        setMenuCategories(response.data);
      } catch (error) {
        console.error("Failed to fetch restaurant menu:", error);
        showToast("Failed to fetch restaurant menu", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, [restaurantId]);

  // Initialize local edit state whenever menuCategories changes
  useEffect(() => {
    const initialEdits = {};
    menuCategories.forEach((cat) => {
      const itemsObj = {};
      cat.items.forEach((item) => {
        itemsObj[item.id] = {
          name: item.name,
          price: String(item.price),
          description: item.description,
        };
      });
      initialEdits[cat.id] = {
        name: cat.name,
        items: itemsObj,
      };
    });
    setEditedCategories(initialEdits);
  }, [menuCategories]);

  // Handle changes to a category name
  const onCategoryNameChange = (categoryId, newName) => {
    setEditedCategories((prev) => ({
      ...prev,
      [categoryId]: {
        ...prev[categoryId],
        name: newName,
      },
    }));
  };

  // Handle changes to an item field
  const onItemFieldChange = (categoryId, itemId, field, newValue) => {
    setEditedCategories((prev) => ({
      ...prev,
      [categoryId]: {
        ...prev[categoryId],
        items: {
          ...prev[categoryId].items,
          [itemId]: {
            ...prev[categoryId].items[itemId],
            [field]: newValue,
          },
        },
      },
    }));
  };

  // Example: save category
  const saveCategory = async (categoryId) => {
    try {
      const { name } = editedCategories[categoryId];
      // TODO: call your API to update the category name
      showToast(`Saved category: ${name} (id: ${categoryId})`, "success");
    } catch (err) {
      console.error(err);
      showToast("Failed to save category.", "error");
    }
  };

  // Example: save item
  const saveItem = async (categoryId, itemId) => {
    try {
      const { name, price, description } = editedCategories[categoryId].items[itemId];
      // TODO: call your API to update the item
      showToast(`Saved item: ${name} (id: ${itemId})`, "success");
    } catch (err) {
      console.error(err);
      showToast("Failed to save item.", "error");
    }
  };

  // Confirm removal of category/item
  const confirmRemove = (type, categoryId, itemId = null) => {
    let message = "";
    let confirmAction;

    if (type === "category") {
      message = "Remove this entire category?";
      confirmAction = async () => {
        try {
          // TODO: call your API to remove the category
          showToast(`Removed category (id: ${categoryId})`, "success");
        } catch (err) {
          console.error(err);
          showToast("Failed to remove category.", "error");
        }
      };
    } else {
      message = "Remove this menu item?";
      confirmAction = async () => {
        try {
          // TODO: call your API to remove the item
          showToast(`Removed item (id: ${itemId})`, "success");
        } catch (err) {
          console.error(err);
          showToast("Failed to remove item.", "error");
        }
      };
    }

    setDialogMessage(message);
    setOnConfirm(() => confirmAction);
    setDialogVisible(true);
  };

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  if (!menuCategories || menuCategories.length === 0) {
    return (
      <View style={{ padding: 16, flex: 1 }}>
        <Text variant="titleLarge">No menu data found.</Text>
      </View>
    );
  }

  return (
    <View style={{ padding: 16, flex: 1 }}>
      {/* Confirmation Dialog */}
      <Portal>
        <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)}>
          <Dialog.Title>Confirm</Dialog.Title>
          <Dialog.Content>
            <Text>{dialogMessage}</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDialogVisible(false)}>Cancel</Button>
            <Button
              onPress={() => {
                setDialogVisible(false);
                onConfirm?.();
              }}
            >
              OK
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {menuCategories.map((cat) => {
        const catEdits = editedCategories[cat.id] || {};
        return (
          <View key={cat.id} style={{ marginBottom: 24 }}>
            {/* Category Name Row */}
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
              <TextInput
                label="Category Name"
                value={catEdits.name}
                onChangeText={(val) => onCategoryNameChange(cat.id, val)}
                style={{ flex: 1, marginRight: 10 }}
              />
              <Button 
                mode="contained" 
                onPress={() => saveCategory(cat.id)} 
                style={{ marginRight: 5 }}
              >
                Save
              </Button>
              <Button 
                mode="outlined" 
                onPress={() => confirmRemove("category", cat.id)}
              >
                Remove
              </Button>
            </View>

            {/* Items Table */}
            <DataTable>
              <DataTable.Header>
                <DataTable.Title style={{ flex: 2 }}>Name</DataTable.Title>
                <DataTable.Title style={{ flex: 3 }}>Description</DataTable.Title>
                <DataTable.Title numeric>Price</DataTable.Title>
                <DataTable.Title style={{ flex: 1 }}>Actions</DataTable.Title>
              </DataTable.Header>

              {cat.items.map((item) => {
                const itemEdits = catEdits.items?.[item.id] || {};
                return (
                  <DataTable.Row key={item.id}>
                    <DataTable.Cell style={{ flex: 2 }}>
                      <TextInput
                        value={itemEdits.name}
                        onChangeText={(val) => onItemFieldChange(cat.id, item.id, "name", val)}
                        mode="outlined"
                      />
                    </DataTable.Cell>
                    <DataTable.Cell style={{ flex: 3 }}>
                      <TextInput
                        value={itemEdits.description}
                        onChangeText={(val) => onItemFieldChange(cat.id, item.id, "description", val)}
                        mode="outlined"
                      />
                    </DataTable.Cell>
                    <DataTable.Cell numeric style={{ flex: 1 }}>
                      <TextInput
                        value={itemEdits.price}
                        onChangeText={(val) => onItemFieldChange(cat.id, item.id, "price", val)}
                        mode="outlined"
                        keyboardType="decimal-pad"
                        style={{ width: 70 }}
                      />
                    </DataTable.Cell>
                    <DataTable.Cell style={{ flex: 1, flexDirection: "row", justifyContent: "center" }}>
                      <IconButton
                        icon="content-save"
                        size={20}
                        onPress={() => saveItem(cat.id, item.id)}
                      />
                      <IconButton
                        icon="delete"
                        size={20}
                        onPress={() => confirmRemove("item", cat.id, item.id)}
                      />
                    </DataTable.Cell>
                  </DataTable.Row>
                );
              })}
            </DataTable>

            {/* TODO: Add button to create a new item in this category */}
            {/* Also add logic to upload/replace item image, etc. */}
          </View>
        );
      })}

      <Button onPress={() => router.back()}>Done</Button>
    </View>
  );
}
