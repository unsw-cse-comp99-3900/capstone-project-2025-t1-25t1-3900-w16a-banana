import React from "react";
import EditProfileForm from "../../../components/EditProfileForm";

/**
 * Admin Edit Profile Page Component.
 * 
 * Renders the reusable <EditProfileForm /> component with the `userType` set to `"admin"`,
 * allowing admin users to update their profile details.
 */
export default function EditProfile() {
  return (
    <EditProfileForm userType="admin" />
  );
}