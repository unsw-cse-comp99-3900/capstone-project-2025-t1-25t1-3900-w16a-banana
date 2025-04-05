import BottomTabs from "../../../components/BottomTabs";
import useAuth from "../../../hooks/useAuth";

// normal tabs, when the driver's registration_status is not pending
const tabs = [
  { name: "orders", title: "Orders", icon: "clipboard-list", visible: true },
  { name: "index", title: "Menu", icon: "menu", visible: true },
  { name: "notifications", title: "Notifications", icon: "bell", visible: true },
  { name: "profile", title: "Profile", icon: "account", visible: true },
  // Hidden tabs
  { name: "EditProfile", title: "Edit Profile", icon: "account-edit", visible: false },
];

// when the driver application status is pending, use these tabs
const pendingTabs = [
  { name: "index", title: "Home", icon: "home", visible: true },
  { name: "profile", title: "Profile", icon: "account", visible: true },
  // hidden tabs
  { name: "orders", title: "Orders", icon: "clipboard-list", visible: false },
  { name: "notifications", title: "Notifications", icon: "bell", visible: false },
  { name: "EditProfile", title: "Edit Profile", icon: "account-edit", visible: false },
]

export default function TabLayout() {
  const { contextProfile } = useAuth();
  const tabsToShow = contextProfile?.registration_status === "PENDING" ? pendingTabs : tabs;
  return <BottomTabs tabs={tabsToShow} />;
}
