import React, { useState, useEffect } from "react";
import {
  Store,
  Plus,
  Package,
  BarChart3,
  Settings,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";
import useAuthStore from "../hooks/useAuthStore";
import { axiosInstance } from "../lib/axios.js";
import CreateBookForm from "../components/CreateBookForm";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const ShopPage = () => {
  const navigate = useNavigate();
  const { authUser } = useAuthStore();
  const [activeTab, setActiveTab] = useState("overview");
  const [isCreateBookOpen, setIsCreateBookOpen] = useState(false);
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated and has a shop
    if (!authUser || !authUser.user || !authUser.shopId) {
      toast.error("Please login as a shop owner to access this page");
      navigate("/login");
      return;
    }

    fetchBooks();
  }, [authUser, navigate]);

  const fetchBooks = async () => {
    if (!authUser?.shopId) return;

    try {
      const response = await axiosInstance.get(`/books/${authUser.shopId}`);
      setBooks(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching books:", error);
      toast.error(error.response?.data?.message || "Failed to load books");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateBook = (newBook) => {
    setBooks((prev) => [newBook, ...prev]);
  };

  // If not authenticated or no shop ID, don't render the page
  if (!authUser?.shopId) {
    return null;
  }

  const totalBooks = books?.length;
  const totalSold = books?.reduce((sum, book) => sum + (book.sold || 0), 0);
  const totalRevenue =
    books?.reduce((sum, book) => sum + book.price * (book.sold || 0), 0) || 0;

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="stat bg-base-100 shadow rounded-lg">
          <div className="stat-title">Total Books</div>
          <div className="stat-value text-primary">{totalBooks}</div>
        </div>
        <div className="stat bg-base-100 shadow rounded-lg">
          <div className="stat-title">Total Sold</div>
          <div className="stat-value text-success">{totalSold}</div>
          <div className="stat-desc">This month</div>
        </div>
        <div className="stat bg-base-100 shadow rounded-lg">
          <div className="stat-title">Revenue</div>
          <div className="stat-value text-warning">
            ${totalRevenue.toFixed(2)}
          </div>
          <div className="stat-desc">This month</div>
        </div>
        <div className="stat bg-base-100 shadow rounded-lg">
          <div className="stat-title">Shop Rating</div>
          <div className="stat-value text-info">4.8</div>
          <div className="stat-desc">⭐⭐⭐⭐⭐</div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h3 className="card-title">Recent Activity</h3>
          <div className="space-y-3">
            {books?.slice(0, 3).map((book) => (
              <div
                key={book.id}
                className="flex items-center justify-between p-3 bg-base-200 rounded"
              >
                <span>New book added: {book.abstraction}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderProducts = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">My Books</h3>
        <button
          className="btn btn-primary"
          onClick={() => setIsCreateBookOpen(true)}
        >
          <Plus className="h-4 w-4" />
          Add Book
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-32">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>Book</th>
                <th>Price</th>
                <th>Genre</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {books?.map((book) => (
                <tr key={book.id}>
                  <td>
                    <div>
                      <div className="font-bold">{book.abstraction}</div>
                    </div>
                  </td>
                  <td>${book.price}</td>
                  <td>{book.genre}</td>
                  <td>
                    <div className="flex gap-2">
                      <button className="btn btn-ghost btn-xs">
                        <Eye className="h-3 w-3" />
                      </button>
                      <button className="btn btn-ghost btn-xs">
                        <Edit className="h-3 w-3" />
                      </button>
                      <button className="btn btn-ghost btn-xs text-error">
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">Analytics</h3>
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h4 className="card-title">Sales Overview</h4>
          <div className="h-64 flex items-center justify-center bg-base-200 rounded">
            <p className="text-base-content/50">
              Chart placeholder - Analytics coming soon
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h4 className="card-title">Top Selling Books</h4>
            <div className="space-y-2">
              {books
                ?.sort((a, b) => (b.sold || 0) - (a.sold || 0))
                .slice(0, 3)
                .map((book) => (
                  <div
                    key={book.id}
                    className="flex justify-between items-center"
                  >
                    <span>{book.abstraction}</span>
                    <span className="text-sm text-base-content/50">
                      {book.sold || 0} sold
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-base-200 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <div className="h-16 w-16 rounded-full bg-primary text-primary-content flex items-center justify-center">
            <Store className="h-8 w-8" />
          </div>
          <div>
            <p className="text-base-content/70">Manage your book shop</p>
          </div>
        </div>

        <div className="tabs tabs-boxed mb-6">
          <button
            className={`tab ${activeTab === "overview" ? "tab-active" : ""}`}
            onClick={() => setActiveTab("overview")}
          >
            <Package className="h-4 w-4 mr-2" />
            Overview
          </button>
          <button
            className={`tab ${activeTab === "products" ? "tab-active" : ""}`}
            onClick={() => setActiveTab("products")}
          >
            <Package className="h-4 w-4 mr-2" />
            Books
          </button>
          <button
            className={`tab ${activeTab === "analytics" ? "tab-active" : ""}`}
            onClick={() => setActiveTab("analytics")}
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
          </button>
          <button
            className={`tab ${activeTab === "settings" ? "tab-active" : ""}`}
            onClick={() => setActiveTab("settings")}
          >
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </button>
        </div>

        {activeTab === "overview" && renderOverview()}
        {activeTab === "products" && renderProducts()}
        {activeTab === "analytics" && renderAnalytics()}
        {activeTab === "settings" && (
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h3 className="card-title">Shop Settings</h3>
              <p className="text-base-content/70">
                Settings page coming soon...
              </p>
            </div>
          </div>
        )}
      </div>

      <CreateBookForm
        isOpen={isCreateBookOpen}
        onClose={() => setIsCreateBookOpen(false)}
        onSuccess={handleCreateBook}
      />
    </div>
  );
};

export default ShopPage;
