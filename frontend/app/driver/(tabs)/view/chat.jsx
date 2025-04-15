import { useLocalSearchParams } from 'expo-router';
import { View, Text } from 'react-native';

export default function ChatPage() {
  const { userType, userId } = useLocalSearchParams();

  return (
    <View>
      <Text>User Type: {userType}</Text>
      <Text>User ID: {userId}</Text>
    </View>
  );
}