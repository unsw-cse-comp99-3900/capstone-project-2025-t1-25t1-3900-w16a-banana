import React, { useEffect, useState } from "react";
import BottomTabs from "../../../components/BottomTabs";
import useAuth from "../../../hooks/useAuth";
import axios from "axios";
import { BACKEND, TIME_INTERVAL } from "../../../constants/backend";

export default function TabLayout() {
  const { contextProfile } = useAuth();
  const [hasNewOrders, setHasNewOrders] = useState(false);

  useEffect(() => {
    if (!contextProfile?.token) return;

    const fetchPendingOrders = async () => {
      const url = `${BACKEND}/restaurant-order/pending`;
      const config = { headers: { Authorization: contextProfile.token } };
      try {
        const res = await axios.get(url, config);
        const pending = res.data || [];
        setHasNewOrders(pending.length > 0);
      } catch (err) {
        console.error("Failed to poll pending orders", err);
      }
    };

    // set initial fetch, and re-poll every seconds
    fetchPendingOrders();
    const interval = setInterval(fetchPendingOrders, TIME_INTERVAL);
    return () => clearInterval(interval);
  }, [contextProfile]);

  // Tabs shown when registration is complete
  const normalTabs = [
    {
      name: "orders",
      title: hasNewOrders ? "Orders 🔴" : "Orders",
      icon: hasNewOrders ? "clipboard-alert" : "clipboard-list",
      visible: true,
    },
    { name: "OrderHistory", title: "Order History", icon: "history", visible: true },
    { name: "chats", title: "Chats", icon: "chat", visible: true },
    { name: "menu", title: "Menu", icon: "menu", visible: true },
    { name: "profile", title: "Profile", icon: "account", visible: true },
    // Hidden tab
    { name: "EditProfile", title: "Edit Profile", icon: "account-edit", visible: false },
    { name: "view/order/[orderId]", title: "Order", icon: "map-marker", visible: false },
    { name: "view/chat", title: "Chat", icon: "chat", visible: false },
  ];

  // Tabs shown when registration is still pending
  const pendingTabs = [
    // only show menu and profile pages
    { name: "menu", title: "Home", icon: "home", visible: true },
    { name: "profile", title: "Profile", icon: "account", visible: true },
    // Hidden tabs
    { name: "OrderHistory", title: "Order History", icon: "history", visible: false },
    { name: "EditProfile", title: "Edit Profile", icon: "account-edit", visible: false },
    { name: "orders", title: "Orders", icon: "clipboard-list", visible: false },
    { name: "view/order/[orderId]", title: "Order", icon: "map-marker", visible: false },
    { name: "chats", title: "Chats", icon: "chat", visible: false },
    { name: "view/chat", title: "Chat", icon: "chat", visible: false },
  ];

  const tabsToShow =
    contextProfile?.registration_status === "PENDING" ? pendingTabs : normalTabs;

  return <BottomTabs tabs={tabsToShow} />;
}
