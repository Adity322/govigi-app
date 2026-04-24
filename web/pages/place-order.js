import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Navbar from "@/components/navbar";
import axiosInstance from "@/lib/axios";
import Cookies from "js-cookie";

export default function PlaceOrder() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    product: "",
    quantity: "",
    deliveryDate: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // Redirect if not logged in
  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
      router.push("/login");
    }
  }, []);

  // Fetch products for dropdown
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axiosInstance.get("/api/products");
        setProducts(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        setError("Failed to load products.");
      }
    };
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await axiosInstance.post("/api/orders", {
        productId: form.product,
        quantity: Number(form.quantity),
        deliveryDate: form.deliveryDate,
      });
      setSuccess("Order placed successfully! 🎉");
      setForm({ product: "", quantity: "", deliveryDate: "" });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to place order. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // Get today's date in YYYY-MM-DD format for min date
  const today = new Date().toISOString().split("T")[0];

  // Get selected product details for price preview
  const selectedProduct = products.find((p) => p._id === form.product);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-2xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Place an Order</h1>
          <p className="text-gray-500 mt-1">Select a product and enter your bulk order details</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">

          {/* Success Message */}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 text-sm flex items-center gap-2">
              <span>✅</span> {success}
              <button
                onClick={() => router.push("/my-orders")}
                className="ml-auto text-green-700 underline font-medium"
              >
                View My Orders
              </button>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6 text-sm">
              ❌ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Product Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Product
              </label>
              <select
                name="product"
                value={form.product}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-400 bg-white"
              >
                <option value="">-- Choose a product --</option>
                {/* Vegetables Group */}
                <optgroup label="🥦 Vegetables">
                  {products
                    .filter((p) => p.category === "Vegetable")
                    .map((p) => (
                      <option key={p._id} value={p._id}>
                        {p.name} — ₹{p.price}/{p.unit}
                      </option>
                    ))}
                </optgroup>
                {/* Fruits Group */}
                <optgroup label="🍎 Fruits">
                  {products
                    .filter((p) => p.category === "Fruit")
                    .map((p) => (
                      <option key={p._id} value={p._id}>
                        {p.name} — ₹{p.price}/{p.unit}
                      </option>
                    ))}
                </optgroup>
              </select>
            </div>

            {/* Price Preview */}
            {selectedProduct && (
              <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3 text-sm text-green-800">
                <span className="font-medium">{selectedProduct.name}</span> —
                ₹{selectedProduct.price} per {selectedProduct.unit} •{" "}
                <span className="text-green-600">{selectedProduct.category}</span>
                {form.quantity && (
                  <p className="mt-1 font-semibold">
                    Total Estimate: ₹{selectedProduct.price * Number(form.quantity)}
                  </p>
                )}
              </div>
            )}

            {/* Quantity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quantity ({selectedProduct ? selectedProduct.unit : "unit"})
              </label>
              <input
                type="number"
                name="quantity"
                value={form.quantity}
                onChange={handleChange}
                required
                min="1"
                placeholder="Enter quantity"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>

            {/* Delivery Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Delivery Date
              </label>
              <input
                type="date"
                name="deliveryDate"
                value={form.deliveryDate}
                onChange={handleChange}
                required
                min={today}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50 text-sm"
            >
              {loading ? "Placing Order..." : "🛒 Place Order"}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}