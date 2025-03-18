import BottomTabs from "../../../components/BottomTabs";
import useAuth from "../../../hooks/useAuth";

// normal tabs, when the driver's registration_status is not pending
const tabs = [
  { name: "index", title: "Home", icon: "home", visible: true },
  { name: "orders", title: "Orders", icon: "clipboard-list", visible: true },
  { name: "history", title: "History", icon: "history", visible: true },
  { name: "notifications", title: "Notifications", icon: "bell", visible: true },
  { name: "profile", title: "Profile", icon: "account", visible: true },
  // Hidden tabs
  { name: "EditNonApproval", title: "Edit Without Approval", icon: "account-edit", visible: false },
  { name: "EditRequireApproval", title: "Edit With Approval", icon: "account-check", visible: false },
];

// when the driver application status is pending, use these tabs
const pendingTabs = [
  { name: "index", title: "Home", icon: "home", visible: true },
  { name: "profile", title: "Profile", icon: "account", visible: true },
  // hidden tabs
  { name: "orders", title: "Orders", icon: "clipboard-list", visible: false },
  { name: "history", title: "History", icon: "history", visible: false },
  { name: "notifications", title: "Notifications", icon: "bell", visible: false },
  { name: "EditNonApproval", title: "Edit Without Approval", icon: "account-edit", visible: false },
  { name: "EditRequireApproval", title: "Edit With Approval", icon: "account-check", visible: false },
]

export default function TabLayout() {
  const { contextProfile } = useAuth();
  const tabsToShow = contextProfile?.registration_status === "PENDING" ? pendingTabs : tabs;
  return <BottomTabs tabs={tabsToShow} />;
}
