import React from 'react';
import { View, Text } from 'react-native';
import useAuth from '../../../hooks/useAuth';

export default function Profile() {
  const { contextProfile } = useAuth();
  console.log(contextProfile);


  return (
    <View>
      <Text>Profile</Text>
    </View>
  );
}