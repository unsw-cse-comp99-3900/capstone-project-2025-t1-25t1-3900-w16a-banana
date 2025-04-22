import React, { useState, useEffect } from "react";
import { View, ScrollView, Image } from "react-native";
import { DataTable, Button, ActivityIndicator, Text } from "react-native-paper";
import { useRouter } from "expo-router";
import useToast from "../hooks/useToast";
import axios from "axios";
import { BACKEND } from "../constants/backend";
import capitalize from "capitalize";

/**
 * UserTableWithType
 *
 * Displays a dynamic user table for a specific user type (customer, driver, restaurant, or admin).
 * Fetches all users of the given type from the backend and renders their profile data in a scrollable table.
 * Includes a "View" button that links to individual user profile pages.
 *
 * userType: the type of user to display ("customer", "driver", "restaurant", or "admin")
 */
export default function UserTableWithType({ userType }) {
  const router = useRouter();
  const { showToast } = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // no token needed for fetching all user profiles
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const url = `${BACKEND}/profile/all/${userType}`;
      const response = await axios.get(url, {
        headers: { Accept: "application/json" },
      });

      setUsers(response.data);
    } catch (error) {
      showToast("Failed to load users", "error");
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [userType]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#6200ee" />
      </View>
    );
  }

  if (!users.length) {
    return (
      <View style={{ padding: 20 }}>
        <DataTable>
          <DataTable.Title>No users found for {userType}.</DataTable.Title>
        </DataTable>
      </View>
    );
  }

  // Get all field keys dynamically
  // const fieldKeys = Object.keys(users[0] || {}).filter(key => key !== "token");
  // configure the fieldKeys for each user type
  let fieldKeys = [];

  if (userType === "customer") {
    fieldKeys = ["id", "url_profile_image", "username", "email", "phone", "suburb", "postcode", "state"];
  } else if (userType === "driver") {
    fieldKeys = ["id", "url_profile_image", "first_name", "last_name", "email", "phone"];
  } else if (userType === "restaurant") {
    fieldKeys = ["id", "url_profile_image", "name", "abn", "email", "phone", "suburb", "postcode", "state"];
  } else if (userType === "admin") {
    fieldKeys = ["id", "url_profile_image", "first_name", "last_name", "email"];
  }

  return (
    <View style={{ marginBottom: 25}}>
      <Text variant="titleMedium" style={{ marginBottom: 5 }}>
        {`${capitalize(userType)}s: Count ${users.length}`}
      </Text>
      <ScrollView horizontal style={{ marginBottom: 10 }}>
        <DataTable>
          {/* Table Header */}
          <DataTable.Header>
            {fieldKeys.map((key, index) => (
              <DataTable.Title key={index} style={{ minWidth: 100 }}>
                {/* when it is the url_profile_image, display as Avatar, else, remove _ and replace with space */}
                {key === "url_profile_image" ? "Avatar" : capitalize(key.replace(/_/g, " "))}
              </DataTable.Title>
            ))}
            <DataTable.Title style={{ minWidth: 120 }}>Actions</DataTable.Title>
          </DataTable.Header>

          {/* Table Rows */}
          {users.map((user, index) => (
            <DataTable.Row key={index}>
              {fieldKeys.map((key, i) => (
                key === "url_profile_image" ? (
                  <DataTable.Cell key={i} style={{ minWidth: 100 }}>
                    <Image
                      source={{ uri: `${BACKEND}/${user[key]}` }}
                      style={{ width: 30, height: 30, borderRadius: "50%" }}
                    />
                  </DataTable.Cell>
                ) : (
                  <DataTable.Cell key={i} style={{ minWidth: 120 }}>
                    {/* if the type is string, display use capitalize.words, else, display as it is */}
                    {typeof user[key] === "string" ? capitalize.words(user[key]) : user[key]}
                  </DataTable.Cell>
                )
              ))}
              <DataTable.Cell style={{ minWidth: 120 }}>
                <Button
                  mode="text"
                  onPress={() => router.push(`/profile?type=${userType}&id=${user.id}`)}
                >
                  View
                </Button>
              </DataTable.Cell>
            </DataTable.Row>
          ))}
        </DataTable>
      </ScrollView>
    </View>
  );
}
