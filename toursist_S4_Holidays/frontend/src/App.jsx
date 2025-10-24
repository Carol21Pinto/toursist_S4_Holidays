// src/App.jsx
import { Routes, Route } from "react-router-dom";

// Public site
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";  // Import Footer
import Home from "./pages/Home.jsx";
import International from "./pages/International.jsx";
import GroupTrip from "./pages/GroupTrip.jsx";
import Domestic from "./pages/Domestic.jsx";
import Pilgrimage from "./pages/Pilgrimage.jsx";
import StatePackages from "./pages/StatePackages.jsx";
import ContinentPackages from "./pages/ContinentPackages.jsx";

// Admin
import ProtectedRoute from "./components/admin/ProtectedRoute";
import AdminLayout from "./layouts/AdminLayout";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AddPackage from "./pages/admin/AddPackage";
import PackagesList from "./pages/admin/PackagesList";
import PackageDetail from './pages/PackageDetail';
import EditPackage from './pages/admin/EditPackage';
import ForgotPassword from "./pages/admin/ForgotPassword.jsx";
import About from "./pages/About.jsx";

const Destination = () => <div style={{ paddingTop: "80px", textAlign: "center", minHeight: "100vh", background: "#f5f5f5" }}><h1>Destination Page - Coming Soon</h1></div>;
const Hotel = () => <div style={{ paddingTop: "80px", textAlign: "center", minHeight: "100vh", background: "#f5f5f5" }}><h1>Hotel Page - Coming Soon</h1></div>;
const Blog = () => <div style={{ paddingTop: "80px", textAlign: "center", minHeight: "100vh", background: "#f5f5f5" }}><h1>Blog Page - Coming Soon</h1></div>;
const Contact = () => <div style={{ paddingTop: "80px", textAlign: "center", minHeight: "100vh", background: "#f5f5f5" }}><h1>Contact Page - Coming Soon</h1></div>;

function PublicLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />  {/* Footer added here */}
    </>
  );
}

export default function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
      <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
      <Route path="/package/:id" element={<PublicLayout><PackageDetail /></PublicLayout>} />
      <Route path="/destination" element={<PublicLayout><Destination /></PublicLayout>} />
      
      {/* International Routes */}
      <Route path="/international" element={<PublicLayout><International /></PublicLayout>} />
      <Route path="/international/:continentName" element={<PublicLayout><ContinentPackages /></PublicLayout>} />
      
      {/* Domestic Routes */}
      <Route path="/domestic" element={<PublicLayout><Domestic /></PublicLayout>} />
      <Route path="/domestic/:stateName" element={<PublicLayout><StatePackages /></PublicLayout>} />
      
      <Route path="/pilgrimage" element={<PublicLayout><Pilgrimage /></PublicLayout>} />
      <Route path="/group-trip" element={<PublicLayout><GroupTrip /></PublicLayout>} />
      <Route path="/hotel" element={<PublicLayout><Hotel /></PublicLayout>} />
      <Route path="/blog" element={<PublicLayout><Blog /></PublicLayout>} />
      <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />

      {/* Admin auth */}
      <Route path="/admin/login" element={<AdminLayout><AdminLogin /></AdminLayout>} />

      {/* Admin protected */}
      <Route element={<ProtectedRoute />}>
        <Route path="/admin" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
        <Route path="/admin/packages" element={<AdminLayout><PackagesList /></AdminLayout>} />
        <Route path="/admin/add" element={<AdminLayout><AddPackage /></AdminLayout>} />
        <Route path="/admin/packages/edit/:id" element={<AdminLayout><EditPackage /></AdminLayout>} />
        <Route path="/admin/forgot-password" element={<AdminLayout><ForgotPassword /></AdminLayout>} />
      </Route>
    </Routes>
  );
}
