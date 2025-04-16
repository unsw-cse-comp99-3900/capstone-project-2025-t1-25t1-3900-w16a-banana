import React, { useState } from "react";
import { View } from "react-native";
import {
  Text,
  TextInput,
  Button
} from "react-native-paper";
import axios from "axios";
import { BACKEND } from "../constants/backend";
import useAuth from "../hooks/useAuth";
import useToast from "../hooks/useToast";
import MenuItemEdit from "./MenuItemEdit";
import useDialog from "../hooks/useDialog";

/**
 * Renders and manages a single restaurant menu category and its items.
 * Allows editing the category name, deleting the category, and managing individual menu items.
 *
 * category: object - Contains category details including id, name, and its menu items.
 * onRefresh: function - Callback to refresh the menu list after updates.
 * displayIndex: number - Displayed index number for the category (e.g., "Category #1").
 */
export default function MenuCategoryEdit({ category, onRefresh, displayIndex }) {
  const { showToast } = useToast();
  const { showDialog } = useDialog();
  const { contextProfile } = useAuth();

  // keep the original name
  const [categoryName, setCategoryName] = useState(category.name);
  const originalName = category.name;

  // checks if user changed the category name
  const isCatChanged = categoryName.trim() !== originalName.trim();

  // turn on or off the new item form
  const [showNewItemForm, setShowNewItemForm] = useState(false);

  // update the category name
  const saveCategoryName = async () => {
    const url = `${BACKEND}/restaurant-menu/category/${category.id}`;
    const payload = { name: categoryName };
    const config = { headers: { Authorizaton: contextProfile.token } }; 

    try {
      await axios.put(url, payload, config);
      showToast("Category name updated.", "success");

      // refresh the whole screen
      onRefresh();
    } catch (error) {
      console.error("Failed to save category:", error);
      showToast("Failed to save category.", "error");
    }
  };

  // Reset the input category name to original name
  const resetCategoryName = () => {
    setCategoryName(originalName);
  };

  // Remove entire category
  const removeCategory = async () => {
    // write the message for check
    // count how many items in this category
    const itemCount = category.items.length;

    const message = itemCount > 0
      ? `This will remove the category and all ${itemCount} items in it.`
      : "This will remove the category.";

    showDialog({
      title: "Remove Category",
      message: message,
      onConfirm: async () => removeCategoryCallAPI(),
      confirmText: "Yes, remove it",
      cancelText: "Cancel",
    });
  };

  const removeCategoryCallAPI = async () => {
    const url = `${BACKEND}/restaurant-menu/category/${category.id}`;
    const config = { headers: { Authorization: contextProfile.token } };

    try {
      await axios.delete(url, config);
      showToast("Category removed.", "success");
      onRefresh();
    } catch (error) {
      console.error("Failed to remove category:", error);
      showToast("Failed to remove category.", "error");
    }
  };

  return (
    <View style={{ marginBottom: 30 }}>
      {/* Category Name Row */}
      <Text variant="titleMedium" style={{ marginBottom: 4 }}>
        {`Category #${displayIndex}`}
      </Text>
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "flex-start", gap: 2, marginBottom: 8 }}>
        <TextInput
          label="Category Name"
          dense
          mode="outlined"
          style={{ width: "70%", }}
          value={categoryName}
          onChangeText={setCategoryName}
        />
        {/* if the category name input is changed, show the redo + check, if not, show the trash bin */}
        {isCatChanged ? (
          <>
            <Button mode="text" onPress={resetCategoryName} icon="redo"/>
            <Button mode="text" onPress={saveCategoryName} icon="check-bold"/>
          </>
        ) : (
          <Button mode="text" icon="trash-can" onPress={removeCategory} />
        )}
      </View>
      {/* Display all the items */}
      <View style={{ marginLeft: 1 }}>
        {category.items?.map((item, index) => (
          <MenuItemEdit
            key={item.id}
            item={item}  
            categoryId={category.id}
            onRefresh={onRefresh}
            displayIndex={index+1}
          />
        ))}
      </View>

      {/* here is for a new item: a button to toggle on or off */}
      <Button mode="text" icon="plus" onPress={() => setShowNewItemForm(!showNewItemForm)}>
        {showNewItemForm ? "Hide New Item Form" : "Add New Item"}
      </Button>
      {showNewItemForm && (
        <View style={{ marginLeft: 1, marginTop: 2 }}>
          <MenuItemEdit
            item={null}       
            categoryId={category.id}
            onRefresh={onRefresh}
          />
        </View>
      )}
    </View>
  );
}