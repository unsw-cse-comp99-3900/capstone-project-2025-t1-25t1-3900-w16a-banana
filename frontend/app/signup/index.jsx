import React from "react";
import { View, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Card, Text, IconButton } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";

export default function SignupSelection() {
  const router = useRouter();

  const options = [
    { type: "customer", icon: "person", label: "Customer", description: "Order food from nearby restaurants." },
    { type: "driver", icon: "local-shipping", label: "Driver", description: "Deliver food and earn money." },
    { type: "restaurant", icon: "storefront", label: "Restaurant", description: "Sell food to customers." },
  ];

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: "#f9f9f9" }}>
      {/* Back Button and Title on the Same Line */}
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 30 }}>
        <IconButton 
          icon="arrow-left"
          size={24}
          onPress={() => router.back()} 
        />
        <Text variant="headlineMedium" style={{ marginLeft: 10 }}>
          Sign Up As
        </Text>
      </View>
      {/* 3 cards to pick the signup user type */}
      {options.map((option) => (
        <TouchableOpacity key={option.type} onPress={() => {
          router.push(`/signup/${option.type}`);
        }}>
          <Card style={{ padding: 20, marginBottom: 35, alignItems: "start" }}>
            <MaterialIcons name={option.icon} size={40} color="#007bff" />
            <Text variant="titleLarge" style={{ marginTop: 10 }}>{option.label}</Text>
            <Text variant="bodyMedium" style={{ textAlign: "start", marginTop: 5 }}>{option.description}</Text>
          </Card>
        </TouchableOpacity>
      ))}
    </View>
  );
}