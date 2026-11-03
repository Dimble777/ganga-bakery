
import "./AdminDashboard.css";

function AdminDashboard({
  onOpenProducts,
  onOpenCategories,
  onOpenOffers,
  onOpenOutlets,
  onOpenReviews,
  onLogout,
}) {
  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <div>
          <h1>Ganga Bakery</h1>
          <p>Admin Dashboard</p>
        </div>

        <button
          className="admin-logout"
          onClick={onLogout}
        >
          Logout
        </button>
      </header>

      <main className="admin-content">
        <h2>Welcome, Admin 👋</h2>

        <p className="admin-subtitle">
          Manage your bakery website from here.
        </p>

        <div className="admin-cards">
          <div className="admin-card">
            <h3>Products</h3>
            <p>Manage cakes, pastries, breads, biscuits and more.</p>
            <button onClick={onOpenProducts}>Manage Products</button>
          </div>

          <div className="admin-card">
            <h3>Orders</h3>
            <p>View and manage customer orders.</p>
            <button>View Orders</button>
          </div>

          <div className="admin-card">
            <h3>Categories</h3>
            <p>Manage your bakery product categories.</p>
            <button onClick={onOpenCategories}>Manage Categories</button>
          </div>

          <div className="admin-card">
            <h3>Offers</h3>
            <p>Create and manage special offers.</p>
            <button onClick={onOpenOffers}>Manage Offers</button>
          </div>

          <div className="admin-card">
            <h3>Outlets</h3>
            <p>Manage your bakery outlet information.</p>
            <button onClick={onOpenOutlets}>Manage Outlets</button>
          </div>

          <div className="admin-card">
            <h3>Reviews</h3>
            <p>Review and approve customer feedback.</p>
            <button onClick={onOpenReviews}>Manage Reviews</button>
          </div>

          <div className="admin-card">
            <h3>Website Content</h3>
            <p>Manage banners and featured website content.</p>
            <button>Manage Content</button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;
