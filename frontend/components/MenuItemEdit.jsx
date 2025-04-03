import React, { useEffect, useState } from "react";
import { View } from "react-native";
import {
  Text,
  TextInput,
  Button,
  HelperText
} from "react-native-paper";
import axios from "axios";
import useAuth from "../hooks/useAuth";
import useToast from "../hooks/useToast";
import { BACKEND } from "../constants/backend";
import useDialog from "../hooks/useDialog";
import ImageUploadComponent from "./ImageUploadForm";
import { isDecimal } from "validator";

export default function MenuItemEdit({ item, categoryId, onRefresh, displayIndex }) {
  const { contextProfile } = useAuth();
  const { showToast } = useToast();
  const { showDialog } = useDialog();

  // form saves the input values, originalData saves the original values
  const initialForm = {
    name: item.name,
    description: item.description,
    price: String(item.price),
    itemImage: item.url_img ? `${BACKEND}/${item.url_img}` : null,
  }
  
  const [form, setForm] = useState(initialForm);
  const [originalData, setOriginalData] = useState(initialForm);

  // Check if anything changed
  const isFormChanged = 
    form.name.trim() !== originalData.name.trim() ||
    form.description.trim() !== originalData.description.trim() ||
    form.price.trim() !== originalData.price.trim() ||
    form.itemImage !== originalData.itemImage;

  // check the price format
  const priceFormat = { decimal_digits: "0,2", force_decimal: false };
  const isPriceValid = isDecimal(form.price, priceFormat) && Number(form.price) > 0;

  // Save changes
  const saveChanges = async () => {
    // if no changes, showToast
    if (!isFormChanged) {
      showToast("No changes to save.", "info");
      return;
    }
    
    // validate the price: a number and > 0, two decimal places maximum
    if (!isPriceValid(form.price)) {
      showToast("Price must be a positive number with up to 2 decimal places.", "error");
      return;
    }

    // add the changed fields
    const formData = new FormData();
    if (form.name !== originalData.name) formData.append("name", form.name);
    if (form.description !== originalData.description) formData.append("description", form.description);
    if (form.price !== originalData.price) formData.append("price", form.price);

    // If the user replaced the image, then upload
    if (form.itemImage && !form.itemImage.startsWith(BACKEND)) {
      const imgResp = await fetch(form.itemImage);
      const imgBlob = await imgResp.blob();
      formData.append("img", imgBlob, "itemImage.jpg");
    }

    // prepare
    const url = `${BACKEND}/restaurant-menu/item/${item.id}`;
    const config = { headers: { Authorization: contextProfile.token } };

    try {
      const response = await axios.put(url, formData, config);
      showToast("Item updated.", "success");
      onRefresh();
    } catch (error) {
      console.error("Failed to save item:", error);
      showToast("Failed to save item.", "error");
    }
  };

  // Reset changes
  const resetChanges = () => {
    setForm({
      name: originalData.name,
      description: originalData.description,
      price: originalData.price,
      itemImage: originalData.itemImage,
    });
  };

  // Remove item
  const removeItem = async () => {
    showDialog({
      title: "Remove Item Confirm",
      message: `Are you sure you want to remove "${form.name}"?`,
      onConfirm: async () => {
        try {
          const url = `${BACKEND}/restaurant-menu/item/${item.id}`;
          const config = { headers: { Authorization: contextProfile.token } };

          const response = await axios.delete(url, config);
          showToast("Item has been removed.", "success");
          onRefresh();
        } catch (err) {
          console.error(err);
          showToast("Failed to remove item.", "error");
        }
      },
    });
  };

  return (
    <View style={{ marginBottom: 16, paddingLeft: 10, borderLeftWidth: 2, borderLeftColor: "#ddd" }}>
      {/* horizontal view: category label + buttons */}
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "flex-start", marginBottom: 4, gap: 4}} >
        <Text variant="titleSmall">
          {`Food Item #${displayIndex}`}
        </Text>
        {/* if the item is not changed, show the rubbish bin, otherwise, shows check + reset */}
        {isFormChanged ? (
          <View style={{ flexDirection: "row", gap: 2 }}>
            <Button mode="text" onPress={resetChanges} icon="redo">Redo</Button>
            <Button mode="text" onPress={saveChanges} icon="check-bold">Save</Button>
          </View>
        ) : (
          <Button mode="text" onPress={removeItem} icon="trash-can-outline">Remove</Button>
        )}
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
        style={{ marginBottom: isPriceValid ? 8 : 0 }}
        error={!isPriceValid}
      />
      {!isPriceValid ? (
        <HelperText type="error" visible={true} style={{ marginBottom: 8 }}>
          Price must be a positive number with up to 2 decimal places.
        </HelperText>
      ) : null}
      {/* Description */}
      <TextInput
        dense
        mode="outlined"
        label="Item Description"
        multiline
        numberOfLines={3}
        value={form.description}
        onChangeText={(val) => setForm({ ...form, description: val })}
        style={{ marginBottom: 8 }}
      />
      {/* Image Upload */}
      <ImageUploadComponent
        // label and inputKey is null, since no need to use them
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
