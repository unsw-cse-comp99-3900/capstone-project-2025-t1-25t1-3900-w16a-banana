import { MaterialCommunityIcons } from "@expo/vector-icons";
import { View } from "react-native";
import { Text } from "react-native-paper";

export default function OrderRatingStar({ rating }) {
  const filledStars = Math.floor(rating);
  const halfStar = rating - filledStars >= 0.5;
  const totalStars = 5;

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 4 }}>
      {[...Array(filledStars)].map((_, i) => (
        <MaterialCommunityIcons key={i} name="star" size={20} color="#fbc02d" />
      ))}
      {halfStar && <MaterialCommunityIcons name="star-half-full" size={20} color="#fbc02d" />}
      {[...Array(totalStars - filledStars - (halfStar ? 1 : 0))].map((_, i) => (
        <MaterialCommunityIcons key={i} name="star-outline" size={20} color="#fbc02d" />
      ))}
      <Text style={{ marginLeft: 6 }}>{rating.toFixed(1)}</Text>
    </View>
  );
}