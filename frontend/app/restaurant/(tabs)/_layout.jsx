import React, { useEffect, useState } from "react";
import BottomTabs from "../../../components/BottomTabs";
import useAuth from "../../../hooks/useAuth";
import axios from "axios";
import { BACKEND } from "../../../constants/backend";

export default function TabLayout() {
  const { contextProfile } = useAuth();
  const [hasNewOrders, setHasNewOrders] = useState(false);

  useEffect(() => {
    if (!contextProfile?.token) return;

    const fetchPendingOrders = async () => {
      const config = { headers: { Authorization: contextProfile.token } };
      try {
        const res = await axios.get(`${BACKEND}/restaurant-order/pending`, config);
        const pending = res.data || [];
        setHasNewOrders(pending.length > 0);
      } catch (err) {
        console.error("Failed to poll pending orders", err);
      }
    };

    fetchPendingOrders();

    // set up polling for every 10 seconds
    const interval = setInterval(fetchPendingOrders, 10000);
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
    { name: "index", title: "Menu", icon: "menu", visible: true },
    { name: "notifications", title: "Notifications", icon: "bell", visible: true },
    { name: "profile", title: "Profile", icon: "account", visible: true },
    // Hidden tab
    { name: "EditProfile", title: "Edit Profile", icon: "account-edit", visible: false },
  ];

  // Tabs shown when registration is still pending
  const pendingTabs = [
    { name: "index", title: "Home", icon: "home", visible: true },
    { name: "profile", title: "Profile", icon: "account", visible: true },
    { name: "orders", title: "Orders", icon: "clipboard-list", visible: false },
    { name: "notifications", title: "Notifications", icon: "bell", visible: false },
    { name: "EditProfile", title: "Edit Profile", icon: "account-edit", visible: false },
  ];

  const tabsToShow =
    contextProfile?.registration_status === "PENDING" ? pendingTabs : normalTabs;

  return <BottomTabs tabs={tabsToShow} />;
}
