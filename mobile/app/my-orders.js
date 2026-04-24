import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axiosInstance from "../lib/axios";

export default function MyOrders() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axiosInstance.get("/api/orders");
      setOrders(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setError("Failed to load orders.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await axiosInstance.put(`/api/orders/${orderId}`, { status: newStatus });
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
      );
    } catch (err) {
      alert("Failed to update status.");
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Pending":
        return { badge: styles.badgePending, text: styles.badgePendingText };
      case "Confirmed":
        return { badge: styles.badgeConfirmed, text: styles.badgeConfirmedText };
      case "Delivered":
        return { badge: styles.badgeDelivered, text: styles.badgeDeliveredText };
      default:
        return { badge: styles.badgePending, text: styles.badgePendingText };
    }
  };

  const renderOrder = ({ item }) => {
    const statusStyle = getStatusStyle(item.status);
    const statusIndex = ["Pending", "Confirmed", "Delivered"].indexOf(item.status);

    return (
      <View style={styles.card}>
        {/* Card Header */}
        <View style={styles.cardHeader}>
          <View style={styles.cardLeft}>
            <Text style={styles.cardEmoji}>
              {item.product?.category === "Fruit" ? "🍎" : "🥦"}
            </Text>
            <View>
              <Text style={styles.productName}>
                {item.product?.name || "Product"}
              </Text>
              <Text style={styles.productDetails}>
                {item.quantity} {item.product?.unit || "units"} • ₹
                {item.product?.price * item.quantity || "—"}
              </Text>
            </View>
          </View>
          <View style={[styles.badge, statusStyle.badge]}>
            <Text style={[styles.badgeText, statusStyle.text]}>
              {item.status}
            </Text>
          </View>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressRow}>
          {["Pending", "Confirmed", "Delivered"].map((step, index) => {
            const isCompleted = index <= statusIndex;
            return (
              <View key={step} style={styles.progressStep}>
                <View
                  style={[
                    styles.progressDot,
                    isCompleted && styles.progressDotActive,
                  ]}
                />
                <Text
                  style={[
                    styles.progressLabel,
                    isCompleted && styles.progressLabelActive,
                  ]}
                >
                  {step}
                </Text>
                {index < 2 && (
                  <View
                    style={[
                      styles.progressLine,
                      index < statusIndex && styles.progressLineActive,
                    ]}
                  />
                )}
              </View>
            );
          })}
        </View>

        {/* Dates */}
        <View style={styles.datesRow}>
          <Text style={styles.dateText}>
            📅 Delivery:{" "}
            <Text style={styles.dateValue}>{formatDate(item.deliveryDate)}</Text>
          </Text>
          <Text style={styles.dateText}>
            🕐 Ordered:{" "}
            <Text style={styles.dateValue}>{formatDate(item.createdAt)}</Text>
          </Text>
        </View>

        {/* Status Update */}
        <View style={styles.statusUpdateRow}>
          <Text style={styles.statusUpdateLabel}>Update Status:</Text>
          <View style={styles.statusButtons}>
            {["Pending", "Confirmed", "Delivered"].map((s) => (
              <TouchableOpacity
                key={s}
                onPress={() => handleStatusUpdate(item._id, s)}
                style={[
                  styles.statusBtn,
                  item.status === s && styles.statusBtnActive,
                ]}
              >
                <Text
                  style={[
                    styles.statusBtnText,
                    item.status === s && styles.statusBtnTextActive,
                  ]}
                >
                  {s}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    );
  };

  // Summary counts
  const pending = orders.filter((o) => o.status === "Pending").length;
  const confirmed = orders.filter((o) => o.status === "Confirmed").length;
  const delivered = orders.filter((o) => o.status === "Delivered").length;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>My Orders</Text>
          <Text style={styles.headerSubtitle}>Track your bulk orders</Text>
        </View>
        <TouchableOpacity
          onPress={() => router.push("/place-order")}
          style={styles.newOrderBtn}
        >
          <Text style={styles.newOrderText}>+ New</Text>
        </TouchableOpacity>
      </View>

      {/* Summary Bar */}
      {orders.length > 0 && (
        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryCount}>{pending}</Text>
            <Text style={styles.summaryLabel}>Pending</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryCount, { color: "#2563eb" }]}>
              {confirmed}
            </Text>
            <Text style={styles.summaryLabel}>Confirmed</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryCount, { color: "#16a34a" }]}>
              {delivered}
            </Text>
            <Text style={styles.summaryLabel}>Delivered</Text>
          </View>
        </View>
      )}

      {/* Loading */}
      {loading && (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#16a34a" />
          <Text style={styles.loadingText}>Loading orders...</Text>
        </View>
      )}

      {/* Error */}
      {error ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>❌ {error}</Text>
        </View>
      ) : null}

      {/* Empty State */}
      {!loading && !error && orders.length === 0 && (
        <View style={styles.centered}>
          <Text style={styles.emptyEmoji}>🛒</Text>
          <Text style={styles.emptyTitle}>No orders yet</Text>
          <Text style={styles.emptySubtitle}>
            You haven't placed any orders yet.
          </Text>
          <TouchableOpacity
            onPress={() => router.push("/place-order")}
            style={styles.emptyBtn}
          >
            <Text style={styles.emptyBtnText}>Place your first order</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Orders List */}
      {!loading && orders.length > 0 && (
        <FlatList
          data={orders}
          renderItem={renderOrder}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Bottom Nav */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push("/products")}
        >
          <Text style={styles.navEmoji}>🥦</Text>
          <Text style={styles.navText}>Products</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push("/place-order")}
        >
          <Text style={styles.navEmoji}>🛒</Text>
          <Text style={styles.navText}>Order</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navEmoji}>📦</Text>
          <Text style={[styles.navText, styles.navActive]}>My Orders</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb" },
  header: {
    backgroundColor: "#15803d",
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: { fontSize: 22, fontWeight: "bold", color: "#fff" },
  headerSubtitle: { fontSize: 13, color: "#bbf7d0", marginTop: 2 },
  newOrderBtn: {
    backgroundColor: "#fff",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
  },
  newOrderText: { color: "#15803d", fontWeight: "600", fontSize: 13 },
  summaryRow: {
    flexDirection: "row",
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    elevation: 2,
  },
  summaryItem: { flex: 1, alignItems: "center" },
  summaryCount: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#f59e0b",
  },
  summaryLabel: { fontSize: 12, color: "#6b7280", marginTop: 2 },
  summaryDivider: { width: 1, backgroundColor: "#e5e7eb" },
  list: { padding: 16, paddingBottom: 100 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  cardLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  cardEmoji: { fontSize: 32 },
  productName: { fontSize: 16, fontWeight: "600", color: "#1f2937" },
  productDetails: { fontSize: 13, color: "#6b7280", marginTop: 2 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  badgeText: { fontSize: 12, fontWeight: "600" },
  badgePending: { backgroundColor: "#fef9c3" },
  badgePendingText: { color: "#854d0e" },
  badgeConfirmed: { backgroundColor: "#dbeafe" },
  badgeConfirmedText: { color: "#1d4ed8" },
  badgeDelivered: { backgroundColor: "#dcfce7" },
  badgeDeliveredText: { color: "#15803d" },
  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  progressStep: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  progressDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#e5e7eb",
    marginRight: 4,
  },
  progressDotActive: { backgroundColor: "#16a34a" },
  progressLabel: { fontSize: 10, color: "#9ca3af" },
  progressLabelActive: { color: "#16a34a", fontWeight: "600" },
  progressLine: {
    flex: 1,
    height: 2,
    backgroundColor: "#e5e7eb",
    marginHorizontal: 4,
  },
  progressLineActive: { backgroundColor: "#16a34a" },
  datesRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 14,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#f3f4f6",
  },
  dateText: { fontSize: 12, color: "#9ca3af" },
  dateValue: { color: "#4b5563", fontWeight: "500" },
  statusUpdateRow: { borderTopWidth: 1, borderTopColor: "#f3f4f6", paddingTop: 12 },
  statusUpdateLabel: { fontSize: 12, color: "#6b7280", marginBottom: 8 },
  statusButtons: { flexDirection: "row", gap: 8 },
  statusBtn: {
    flex: 1,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    alignItems: "center",
  },
  statusBtnActive: { backgroundColor: "#16a34a", borderColor: "#16a34a" },
  statusBtnText: { fontSize: 11, color: "#6b7280", fontWeight: "500" },
  statusBtnTextActive: { color: "#fff" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { marginTop: 10, color: "#6b7280", fontSize: 14 },
  errorBox: {
    margin: 16,
    backgroundColor: "#fef2f2",
    padding: 12,
    borderRadius: 10,
  },
  errorText: { color: "#dc2626", fontSize: 13 },
  emptyEmoji: { fontSize: 48, marginBottom: 12 },
  emptyTitle: { fontSize: 18, fontWeight: "600", color: "#1f2937" },
  emptySubtitle: { fontSize: 14, color: "#9ca3af", marginTop: 4 },
  emptyBtn: {
    marginTop: 16,
    backgroundColor: "#16a34a",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
  },
  emptyBtnText: { color: "#fff", fontWeight: "600" },
  bottomNav: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    paddingVertical: 10,
  },
  navItem: { flex: 1, alignItems: "center" },
  navEmoji: { fontSize: 20 },
  navText: { fontSize: 11, color: "#6b7280", marginTop: 2 },
  navActive: { color: "#16a34a", fontWeight: "600" },
});