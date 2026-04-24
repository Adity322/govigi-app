import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Navbar from "@/components/navbar";
import OrderStatusBadge from "@/components/OrderStatusBadge";
import axiosInstance from "@/lib/axios";
import Cookies from "js-cookie";

export default function MyOrders() {
    const router = useRouter();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Redirect if not logged in
    useEffect(() => {
        const token = Cookies.get("token");
        if (!token) {
            router.push("/login");
        }
    }, []);

    // Fetch orders
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await axiosInstance.get("/api/orders");
                const data = Array.isArray(res.data) ? res.data : [];
                setOrders(data);
            } catch (err) {
                setError("Failed to load orders. Please try again.");
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    // Format date nicely
    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    };
    const handleStatusUpdate = async (orderId, newStatus) => {
        try {
            await axiosInstance.put(`/api/orders/${orderId}`, { status: newStatus });
            // Update the order status locally without refetching
            setOrders((prev) =>
                prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
            );
        } catch (err) {
            alert("Failed to update status. Try again.");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="max-w-4xl mx-auto px-6 py-10">
                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">My Orders</h1>
                        <p className="text-gray-500 mt-1">Track all your bulk orders</p>
                    </div>
                    <button
                        onClick={() => router.push("/place-order")}
                        className="bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-5 py-2 rounded-lg transition"
                    >
                        + New Order
                    </button>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="flex items-center justify-center py-20">
                        <div className="text-center">
                            <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                            <p className="text-gray-500 text-sm">Loading your orders...</p>
                        </div>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                        ❌ {error}
                    </div>
                )}

                {/* Empty State */}
                {!loading && !error && orders.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-5xl mb-4">🛒</p>
                        <h2 className="text-xl font-semibold text-gray-700 mb-2">No orders yet</h2>
                        <p className="text-gray-400 mb-6">You haven't placed any orders yet.</p>
                        <button
                            onClick={() => router.push("/place-order")}
                            className="bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-6 py-2 rounded-lg transition"
                        >
                            Place your first order
                        </button>
                    </div>
                )}

                {/* Orders List */}
                {!loading && orders.length > 0 && (
                    <div className="space-y-4">
                        {/* Summary Bar */}
                        <div className="grid grid-cols-3 gap-4 mb-6">
                            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
                                <p className="text-2xl font-bold text-yellow-500">
                                    {orders.filter((o) => o.status === "Pending").length}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">Pending</p>
                            </div>
                            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
                                <p className="text-2xl font-bold text-blue-500">
                                    {orders.filter((o) => o.status === "Confirmed").length}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">Confirmed</p>
                            </div>
                            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
                                <p className="text-2xl font-bold text-green-500">
                                    {orders.filter((o) => o.status === "Delivered").length}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">Delivered</p>
                            </div>
                        </div>

                        {/* Order Cards */}
                        {orders.map((order) => (
                            <div
                                key={order._id}
                                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition"
                            >
                                <div className="flex items-start justify-between">
                                    {/* Left — Product Info */}
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-2xl">
                                            {order.product?.category === "Fruit" ? "🍎" : "🥦"}
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-800">
                                                {order.product?.name || "Product"}
                                            </h3>
                                            <p className="text-sm text-gray-500">
                                                {order.quantity} {order.product?.unit || "units"} •{" "}
                                                ₹{order.product?.price * order.quantity || "—"}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Right — Status Update */}
                                    <div className="flex flex-col items-end gap-2">
                                        <OrderStatusBadge status={order.status} />
                                        <select
                                            value={order.status}
                                            onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                                            className="text-xs border border-gray-200 rounded-lg px-2 py-1 text-gray-600 focus:outline-none focus:ring-2 focus:ring-green-400 bg-white cursor-pointer"
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="Confirmed">Confirmed</option>
                                            <option value="Delivered">Delivered</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Divider */}
                                <div className="border-t border-gray-100 mt-4 pt-4 flex items-center justify-between text-xs text-gray-400">
                                    <span>📅 Delivery: <span className="font-medium text-gray-600">{formatDate(order.deliveryDate)}</span></span>
                                    <span>🕐 Ordered: <span className="font-medium text-gray-600">{formatDate(order.createdAt)}</span></span>
                                </div>

                                {/* Status Progress Bar */}
                                <div className="mt-4">
                                    <div className="flex items-center gap-2">
                                        {["Pending", "Confirmed", "Delivered"].map((step, index) => {
                                            const statusIndex = ["Pending", "Confirmed", "Delivered"].indexOf(order.status);
                                            const isCompleted = index <= statusIndex;
                                            return (
                                                <div key={step} className="flex items-center gap-2 flex-1">
                                                    <div className={`w-3 h-3 rounded-full flex-shrink-0 ${isCompleted ? "bg-green-500" : "bg-gray-200"
                                                        }`} />
                                                    <span className={`text-xs ${isCompleted ? "text-green-600 font-medium" : "text-gray-400"
                                                        }`}>
                                                        {step}
                                                    </span>
                                                    {index < 2 && (
                                                        <div className={`h-0.5 flex-1 ${index < statusIndex ? "bg-green-400" : "bg-gray-200"
                                                            }`} />
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}