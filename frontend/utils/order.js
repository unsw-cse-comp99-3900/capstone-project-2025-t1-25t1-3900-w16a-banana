/**
 * Constants and mappings for handling order status display in the application.
 *
 * STATUS_LIST:
 * - An ordered list of all possible order statuses.
 *
 * STATUS_CONTENT:
 * - A mapping from each order status to a corresponding display configuration, including:
 *   - title: A user-friendly description of the status.
 *   - gif: An animation image (GIF) associated with the status.
 *   - color: A hex code representing the color theme for this status in the UI.
 */
import ApprovedGIF from "../assets/images/approved.gif";
import DeliveryGIF from "../assets/images/delivery.gif";
import PendingGIF from "../assets/images/pending.gif";
import PickupGIF from "../assets/images/pickup.gif";
import DeliveredGIF from "../assets/images/delivered.gif";

export const STATUS_LIST = [
  "PENDING",
  "RESTAURANT_ACCEPTED",
  "READY_FOR_PICKUP",
  "PICKED_UP",
  "DELIVERED",
  "CANCELLED",
];

export const STATUS_CONTENT = {
  "PENDING": {
    title: "Confirming Order",
    gif: PendingGIF,
    color: "#FFA500",
  },
  "RESTAURANT_ACCEPTED": {
    title: "Cooking",
    gif: ApprovedGIF,
    color: "#2196F3",
  },
  "READY_FOR_PICKUP": {
    title: "Ready for Pickup",
    gif: PickupGIF,
    color: "#00BCD4",
  },
  "PICKED_UP": {
    title: "On the Way",
    gif: DeliveryGIF,
    color: "#9977d4",
  },
  "DELIVERED": {
    title: "Delivered",
    gif: DeliveredGIF,
    color: "#4CAF50",
  },
  "CANCELLED": {
    title: "Cancelled",
    gif: null,
    color: "#f7776e",
  },
};

