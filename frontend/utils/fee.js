// calculate the fee based on the distance
export function calculateDeliveryFee(distance) {
  // <= 5km, $5
  // <= 10km, $10
  // <= 15km, $15,
  // > 15km, $20

  if (distance <= 5) return 5;
  if (distance <= 10) return 10;
  if (distance <= 15) return 15;
  return 20;
}