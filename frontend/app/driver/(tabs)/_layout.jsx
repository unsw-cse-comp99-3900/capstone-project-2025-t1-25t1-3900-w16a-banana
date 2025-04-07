import React, { useEffect, useState } from "react";
import BottomTabs from "../../../components/BottomTabs";
import useAuth from "../../../hooks/useAuth";
import axios from "axios";
import { BACKEND, TIME_INTERVAL } from "../../../constants/backend";

export default function TabLayout() {
  const { contextProfile } = useAuth();
  const [hasNewOrders, setHasNewOrders] = useState(false);

  const isPendingDriver = contextProfile?.registration_status === "PENDING";

  useEffect(() => {
    if (!contextProfile?.token || isPendingDriver) return;

    const fetchNewOrders = async () => {
      const url = `${BACKEND}/driver-order/new`;
      const config = { headers: { Authorization: contextProfile.token } };
      try {
        const res = await axios.get(url, config);
        const newOrders = res.data || [];
        setHasNewOrders(newOrders.length > 0);
      } catch (err) {
        console.error("Failed to poll driver new orders", err);
      }
    };

    // set initial fetch, and re-poll every seconds
    fetchNewOrders();
    const interval = setInterval(fetchNewOrders, TIME_INTERVAL); 
    return () => clearInterval(interval);
  }, [contextProfile, isPendingDriver]);

  const normalTabs = [
    {
      name: "orders",
      title: hasNewOrders ? "Orders 🔴" : "Orders",
      icon: hasNewOrders ? "clipboard-alert" : "clipboard-list",
      visible: true,
    },
    { name: "history", title: "History", icon: "history", visible: true },
    { name: "notifications", title: "Notifications", icon: "bell", visible: true },
    { name: "profile", title: "Profile", icon: "account", visible: true },
    // hidden tabs
    { name: "PendingProfile", title: "Home", icon: "home", visible: false },
    { name: "EditProfile", title: "Edit Profile", icon: "account-edit", visible: false },
    { name: "view/restaurant/[restaurantId]", title: "Restaurant", icon: "store", visible: false },
    { name: "view/order/[orderId]", title: "Order", icon: "map-marker", visible: false },
  ];

  const pendingTabs = [
    { name: "PendingProfile", title: "Home", icon: "home", visible: true },
    { name: "profile", title: "Profile", icon: "account", visible: true },
    // hidden tabs
    { name: "history", title: "History", icon: "history", visible: false },
    { name: "orders", title: "Orders", icon: "clipboard-list", visible: false },
    { name: "notifications", title: "Notifications", icon: "bell", visible: false },
    { name: "EditProfile", title: "Edit Profile", icon: "account-edit", visible: false },
    { name: "view/restaurant/[restaurantId]", title: "Restaurant", icon: "store", visible: false },
    { name: "view/order/[orderId]", title: "Order", icon: "map-marker", visible: false },
  ];

  const tabsToShow = isPendingDriver ? pendingTabs : normalTabs;

  return <BottomTabs tabs={tabsToShow} />;
}
