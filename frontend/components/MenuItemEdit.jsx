import React, { useState } from "react";
import { View } from "react-native";
import {
  Text,
  TextInput,
  Button,
  HelperText
} from "react-native-paper";
import axios from "axios";
import { BACKEND } from "../constants/backend";
import useAuth from "../hooks/useAuth";
import useToast from "../hooks/useToast";
import useDialog from "../hooks/useDialog";
import ImageUploadComponent from "./ImageUploadForm";
import { isDecimal } from "validator";

// this component works for both new and existing item
export default function MenuItemEdit({item, categoryId, onRefresh, displayIndex, }) {
  const { contextProfile } = useAuth();
  const { showToast } = useToast();
  const { showDialog } = useDialog();

  // Determine if this is a new item (no item object or no item.id)
  const isNew = !(item && item.id);

  // set up initial form
  const initialForm = {
    name: isNew ? "" : item.name,
    description: isNew ? "" : item.description,
    price: isNew ? "" : String(item.price),
    itemImage: (isNew && !item?.url_img ) ? null : `${BACKEND}/${item?.url_img || ""}`.trim(),
  };

  // set up the form state
  const [form, setForm] = useState(initialForm);

  // check if the form has changed
  const formChanged = 
    form.name.trim() !== initialForm.name.trim() ||
    form.description.trim() !== initialForm.description.trim() ||
    form.price.trim() !== initialForm.price.trim() ||
    form.itemImage !== initialForm.itemImage;

  // Basic decimal check for price. Up to 2 decimals, must be > 0
  const priceFormat = { decimal_digits: "0,2", force_decimal: false };
  const isPriceValid = isDecimal(form.price || "", priceFormat) && Number(form.price) > 0;

  // update an existing item
  const updateItemCallAPI = async (formData) => {
    const url = `${BACKEND}/restaurant-menu/item/${item.id}`;
    const config = { headers: { Authorization: contextProfile.token } };

    try {
      await axios.put(url, formData, config);
      showToast("Item updated!", "success");
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error("Failed to update item:", error);
      showToast("Failed to update item.", "error");
    }
  };

  // post a new item
  const createItemCallAPI = async (formData) => {
    const url = `${BACKEND}/restaurant-menu/item/new/${categoryId}`;
    const config = { headers: { Authorization: contextProfile.token } };

    try {
      await axios.post(url, formData, config);
      showToast("New item created!", "success");
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error("Failed to create item:", error);
      showToast("Failed to create item.", "error");
    }
  };

  const handleSave = async () => {
    // Validate fields
    if (!form.name.trim()) {
      showToast("Please enter a name.", "error");
      return;
    }
    if (!isPriceValid) {
      showToast("Price must be a positive number, up to 2 decimals.", "error");
      return;
    }

    // Build form data
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("description", form.description);
    formData.append("price", form.price);
    formData.append("is_available", true); // always true

    // If user replaced the image with a new URI, do the upload
    if (form.itemImage && !form.itemImage.startsWith(BACKEND)) {
      try {
        const imgResp = await fetch(form.itemImage);
        const imgBlob = await imgResp.blob();
        formData.append("img", imgBlob, "itemImage.jpg");
      } catch (err) {
        console.error("Failed to fetch image:", err);
        showToast("Failed to attach image.", "error");
        return;
      }
    }

    // Decide if we do POST or PUT
    if (isNew) {
      showDialog({
        title: "Create New Item",
        message: `Are you sure you want to create "${form.name}"?`,
        onConfirm: () => createItemCallAPI(formData),
        confirmText: "Yes, create it",
        cancelText: "Cancel",
      });
    } else {
      showDialog({
        title: "Update Item",
        message: `Are you sure you want to update "${form.name}"?`,
        onConfirm: () => updateItemCallAPI(formData),
        confirmText: "Yes, update it",
        cancelText: "Cancel",
      });
    }
  };

  const handleRemove = async () => {
    // Only relevant if we have an existing item
    if (isNew) return;
    
    showDialog({
      title: "Remove Item",
      message: `Are you sure you want to remove "${form.name}"?`,
      onConfirm: async () => {
        try {
          const url = `${BACKEND}/restaurant-menu/item/${item.id}`;
          const config = { headers: { Authorization: contextProfile.token } };
          await axios.delete(url, config);

          showToast("Item removed.", "success");
          if (onRefresh) onRefresh();
        } catch (err) {
          console.error(err);
          showToast("Failed to remove item.", "error");
        }
      }
    });
  };

  const handleReset = () => {
    setForm(initialForm);
  };

  return (
    <View style={{ marginBottom: 12, paddingLeft: 8, borderLeftWidth: 2, borderLeftColor: "#ddd" }}>
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 4 }}>
        <Text variant="titleSmall">
          {isNew 
            ? "New Menu Item" 
            : `Food Item #${displayIndex || ""}`
          }
        </Text>
        
        {/* Buttons on the right */}
        <View style={{ marginLeft: 8, flexDirection: "row", gap: 8 }}>
          {isNew ? (
            // For new items, let's have a "Save" & maybe "Cancel" or "Reset"?
            <>
              <Button mode="text" icon="redo" onPress={handleReset}>
                Reset
              </Button>
              <Button mode="text" icon="check-bold" onPress={handleSave}>
                Submit
              </Button>
            </>
          ) : formChanged ? (
            <>
              <Button mode="text" icon="redo" onPress={handleReset}>
                Reset
              </Button>
              <Button mode="text" icon="check-bold" onPress={handleSave}>
                Save
              </Button>
            </>
          ) : (
            // If not changed, show remove
            <Button mode="text" icon="trash-can-outline" onPress={handleRemove}>
              Remove
            </Button>
          )}
        </View>
      </View>

      {/* Name */}
      <TextInput
        dense
        mode="outlined"
        label="Item Name"
        value={form.name}
        onChangeText={(val) => setForm({ ...form, name: val })}
        style={{ marginBottom: 8 }}
      />

      {/* Price */}
      <TextInput
        dense
        mode="outlined"
        label="Price"
        value={form.price}
        onChangeText={(val) => setForm({ ...form, price: val })}
        keyboardType="decimal-pad"
        style={{ marginBottom: 8 }}
        error={!isNew && !isPriceValid}
      />
      {!isPriceValid && !!form.price && (
        <HelperText type="error" visible>
          Price must be a positive number up to 2 decimals.
        </HelperText>
      )}

      {/* Description */}
      <TextInput
        dense
        mode="outlined"
        label="Description"
        value={form.description}
        onChangeText={(val) => setForm({ ...form, description: val })}
        multiline
        numberOfLines={3}
        style={{ marginBottom: 8 }}
      />

      {/* Image upload */}
      <ImageUploadComponent
        label={null}        
        inputKey={null}
        imageKey="itemImage"
        form={form}
        setForm={setForm}
        buttonText={form.itemImage ? "Replace Item Image" : "Upload Item Image"}
      />
    </View>
  );
}
