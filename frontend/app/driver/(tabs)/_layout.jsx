import BottomTabs from "../../../components/BottomTabs";

const tabs = [
  { name: "orders", title: "Orders", icon: "clipboard-list", visible: true },
  { name: "history", title: "History", icon: "history", visible: true },
  { name: "notifications", title: "Notifications", icon: "bell", visible: true },
  { name: "profile", title: "Profile", icon: "account", visible: true },
  // Hidden tabs
  { name: "EditNonApproval", title: "Edit Without Approval", icon: "account-edit", visible: false },
  { name: "EditRequireApproval", title: "Edit With Approval", icon: "account-check", visible: false },
];

export default function TabLayout() {
  return <BottomTabs tabs={tabs} />;
}
