
import { Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "./utils/supabase";

import TopBar from "./components/TopBar/TopBar";
import Navbar from "./components/Navbar/Navbar";
import PremiumHero from "./components/PremiumHero/PremiumHero";
import BestSellers from "./components/BestSellers/BestSellers";
import Outlets from "./components/Outlets/Outlets";
import CustomerReviews from "./components/CustomerReviews/CustomerReviews";
import OrderCTA from "./components/OrderCTA/OrderCTA";
import Footer from "./components/Footer/Footer";

import AdminLogin from "./admin/AdminLogin/AdminLogin";
import AdminDashboard from "./admin/AdminDashboard/AdminDashboard";
import AdminProducts from "./admin/AdminProducts/AdminProducts";
import AdminCategories from "./admin/AdminCategories/AdminCategories";
import AdminOffers from "./admin/AdminOffers/AdminOffers";
import AdminOutlets from "./admin/AdminOutlets/AdminOutlets";
import AdminReviews from "./admin/AdminReviews/AdminReviews";

import OutletDetails from "./pages/OutletDetails/OutletDetails";
import CategoryPage from "./pages/CategoryPage/CategoryPage";
import ProductDetails from "./pages/ProductDetails/ProductDetails";
import Cart from "./pages/Cart/Cart";
import Products from "./pages/Products/Products";
import Offers from "./components/Offers/Offers";

function App() {
  const [session, setSession] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [adminPage, setAdminPage] = useState("dashboard");

  const isAdminPage = window.location.pathname === "/admin";
const ADMIN_UID = "1a190000-04af-4cda-b057-7112fc6a9d83";

const isLoggedIn =
  session?.user?.id === ADMIN_UID;

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data, error }) => {
      if (error) {
        console.error("Could not restore Supabase session:", error);
      }

      if (mounted) {
        setSession(data?.session ?? null);
        setAuthLoading(false);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setAuthLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Admin logout error:", error);
      alert("Could not log out. Please try again.");
      return;
    }

    setAdminPage("dashboard");
  };

  if (isAdminPage) {
    if (authLoading) {
      return <p>Checking admin session...</p>;
    }

    if (!isLoggedIn) {
      return (
        <AdminLogin
          onLogin={() => setAdminPage("dashboard")}
        />
      );
    }

    if (adminPage === "products") {
      return <AdminProducts onBack={() => setAdminPage("dashboard")} />;
    }

    if (adminPage === "categories") {
      return <AdminCategories onBack={() => setAdminPage("dashboard")} />;
    }

    if (adminPage === "offers") {
      return <AdminOffers onBack={() => setAdminPage("dashboard")} />;
    }

    if (adminPage === "outlets") {
      return <AdminOutlets onBack={() => setAdminPage("dashboard")} />;
    }

    if (adminPage === "reviews") {
      return <AdminReviews onBack={() => setAdminPage("dashboard")} />;
    }

    return (
      <AdminDashboard
        onOpenProducts={() => setAdminPage("products")}
        onOpenCategories={() => setAdminPage("categories")}
        onOpenOffers={() => setAdminPage("offers")}
        onOpenOutlets={() => setAdminPage("outlets")}
        onOpenReviews={() => setAdminPage("reviews")}
        onLogout={handleLogout}
      />
    );
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          <>
            <TopBar />
            <Navbar />
            <PremiumHero />
           <Offers />
            <BestSellers />
            <Outlets />
            <CustomerReviews />
            <OrderCTA />
            <Footer />
          </>
        }
      />
      <Route path="/products" element={<Products />} />
      <Route path="/category/:category" element={<CategoryPage />} />
      <Route path="/outlets/:id" element={<OutletDetails />} />
      <Route path="/product/:id" element={<ProductDetails />} />
      <Route path="/cart" element={<Cart />} />
    </Routes>
  );
}

export default App;
