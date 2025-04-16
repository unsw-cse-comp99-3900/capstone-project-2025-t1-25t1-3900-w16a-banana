/**
 * Calculates the delivery fee based on the distance (in kilometers).
 *
 * Fee rules:
 * - ≤ 5km: $5
 * - ≤ 10km: $10
 * - ≤ 15km: $15
 * - > 15km: $20
 *
 * @param {number} distance - The delivery distance in kilometers.
 * @returns {number} - The delivery fee in dollars.
 */
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