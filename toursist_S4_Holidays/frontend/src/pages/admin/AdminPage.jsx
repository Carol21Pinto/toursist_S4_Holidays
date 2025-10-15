// src/pages/admin/AdminPage.jsx
import { useRef } from "react";
import AddPackage from "./AddPackage";
import AdminDashboard from "./AdminDashboard";

export default function AdminPage() {
  const dashboardRef = useRef();

  const handlePackageAdded = () => {
    // 🔄 tell dashboard to reload without navigation
    dashboardRef.current?.reload();
  };

  return (
    <>
      <AddPackage onPackageAdded={handlePackageAdded} />
      <AdminDashboard ref={dashboardRef} />
    </>
  );
}
