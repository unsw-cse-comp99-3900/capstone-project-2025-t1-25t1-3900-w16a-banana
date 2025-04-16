import React from "react";
import EditProfileForm from "../../../components/EditProfileForm";

/** 
 * EditProfile component renders the Edit Profile form for the customer.
 */
export default function EditProfile() {
  return (
    <EditProfileForm userType="customer" />
  );
}