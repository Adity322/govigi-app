import { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import axiosInstance from "../lib/axios";

export default function PlaceOrder() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [deliveryDate, setDeliveryDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchingProducts, setFetchingProducts] = useState(true);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  // Generate next 7 days for date selection
  const getNextDays = () => {
    const days = [];
    for (let i = 1; i <= 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      days.push({
        label: date.toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
        }),
        value: date.toISOString().split("T")[0],
        day: date.toLocaleDateString("en-IN", { weekday: "short" }),
      });
    }
    return days;
  };

  const days = getNextDays();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axiosInstance.get("/api/products");
        setProducts(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        setError("Failed to load products.");
      } finally {
        setFetchingProducts(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts =
    activeCategory === "All"
      ? products
      : products.filter((p) => p.category === activeCategory);

  const handleSubmit = async () => {
    if (!selectedProduct) {
      setError("Please select a product.");
      return;
    }
    if (!deliveryDate) {
      setError("Please select a delivery date.");
      return;
    }
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      await axiosInstance.post("/api/orders", {
        productId: selectedProduct._id,
        quantity,
        deliveryDate,
      });
      setSuccess("Order placed successfully! 🎉");
      setSelectedProduct(null);
      setQuantity(1);
      setDeliveryDate("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to place order.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backBtn}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Place Order</Text>
        <View style={{ width: 50 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>

        {/* Success */}
        {success ? (
          <View style={styles.successBox}>
            <Text style={styles.successText}>{success}</Text>
            <TouchableOpacity onPress={() => router.push("/my-orders")}>
              <Text style={styles.successLink}>View My Orders →</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        {/* Error */}
        {error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>❌ {error}</Text>
          </View>
        ) : null}

        {/* Step 1 - Select Product */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Step 1: Select Product</Text>

          {/* Category Filter */}
          <View style={styles.filterRow}>
            {["All", "Vegetable", "Fruit"].map((cat) => (
              <TouchableOpacity
                key={cat}
                onPress={() => setActiveCategory(cat)}
                style={[
                  styles.filterBtn,
                  activeCategory === cat && styles.filterBtnActive,
                ]}
              >
                <Text
                  style={[
                    styles.filterText,
                    activeCategory === cat && styles.filterTextActive,
                  ]}
                >
                  {cat === "All" ? "🌿 All" : cat === "Vegetable" ? "🥦 Veg" : "🍎 Fruit"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {fetchingProducts ? (
            <ActivityIndicator color="#16a34a" style={{ marginTop: 16 }} />
          ) : (
            <View style={styles.productGrid}>
              {filteredProducts.map((product) => (
                <TouchableOpacity
                  key={product._id}
                  onPress={() => setSelectedProduct(product)}
                  style={[
                    styles.productCard,
                    selectedProduct?._id === product._id &&
                      styles.productCardSelected,
                  ]}
                >
                  <Text style={styles.productEmoji}>
                    {product.category === "Vegetable" ? "🥦" : "🍎"}
                  </Text>
                  <Text style={styles.productName}>{product.name}</Text>
                  <Text style={styles.productPrice}>₹{product.price}/{product.unit}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Price Preview */}
        {selectedProduct && (
          <View style={styles.previewBox}>
            <Text style={styles.previewTitle}>
              {selectedProduct.name} selected
            </Text>
            <Text style={styles.previewPrice}>
              ₹{selectedProduct.price} × {quantity} = ₹
              {selectedProduct.price * quantity}
            </Text>
          </View>
        )}

        {/* Step 2 - Quantity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Step 2: Select Quantity</Text>
          <View style={styles.quantityRow}>
            <TouchableOpacity
              onPress={() => setQuantity(Math.max(1, quantity - 1))}
              style={styles.qtyBtn}
            >
              <Text style={styles.qtyBtnText}>−</Text>
            </TouchableOpacity>
            <Text style={styles.qtyValue}>{quantity}</Text>
            <TouchableOpacity
              onPress={() => setQuantity(quantity + 1)}
              style={styles.qtyBtn}
            >
              <Text style={styles.qtyBtnText}>+</Text>
            </TouchableOpacity>
            <Text style={styles.qtyUnit}>
              {selectedProduct ? selectedProduct.unit : "units"}
            </Text>
          </View>
        </View>

        {/* Step 3 - Delivery Date */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Step 3: Select Delivery Date</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.datesRow}>
              {days.map((d) => (
                <TouchableOpacity
                  key={d.value}
                  onPress={() => setDeliveryDate(d.value)}
                  style={[
                    styles.dateCard,
                    deliveryDate === d.value && styles.dateCardSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.dateDay,
                      deliveryDate === d.value && styles.dateTextSelected,
                    ]}
                  >
                    {d.day}
                  </Text>
                  <Text
                    style={[
                      styles.dateLabel,
                      deliveryDate === d.value && styles.dateTextSelected,
                    ]}
                  >
                    {d.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          onPress={handleSubmit}
          disabled={loading}
          style={[styles.submitBtn, loading && styles.submitBtnDisabled]}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitBtnText}>🛒 Place Order</Text>
          )}
        </TouchableOpacity>

      </ScrollView>

      {/* Bottom Nav */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push("/products")}
        >
          <Text style={styles.navEmoji}>🥦</Text>
          <Text style={styles.navText}>Products</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navEmoji}>🛒</Text>
          <Text style={[styles.navText, styles.navActive]}>Order</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push("/my-orders")}
        >
          <Text style={styles.navEmoji}>📦</Text>
          <Text style={styles.navText}>My Orders</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb" },
  header: {
    backgroundColor: "#15803d",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  backBtn: { color: "#fff", fontSize: 15 },
  headerTitle: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  scroll: { padding: 16, paddingBottom: 100 },
  section: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: 12,
  },
  filterRow: { flexDirection: "row", gap: 8, marginBottom: 12 },
  filterBtn: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: "#f3f4f6",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  filterBtnActive: { backgroundColor: "#16a34a", borderColor: "#16a34a" },
  filterText: { fontSize: 12, color: "#6b7280", fontWeight: "500" },
  filterTextActive: { color: "#fff" },
  productGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  productCard: {
    width: "47%",
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#e5e7eb",
  },
  productCardSelected: {
    borderColor: "#16a34a",
    backgroundColor: "#f0fdf4",
  },
  productEmoji: { fontSize: 28, marginBottom: 6 },
  productName: { fontSize: 13, fontWeight: "600", color: "#1f2937" },
  productPrice: { fontSize: 12, color: "#16a34a", marginTop: 2 },
  previewBox: {
    backgroundColor: "#f0fdf4",
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#bbf7d0",
  },
  previewTitle: { fontSize: 14, fontWeight: "600", color: "#15803d" },
  previewPrice: { fontSize: 16, fontWeight: "bold", color: "#16a34a", marginTop: 4 },
  quantityRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  qtyBtn: {
    backgroundColor: "#16a34a",
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  qtyBtnText: { color: "#fff", fontSize: 22, fontWeight: "bold" },
  qtyValue: { fontSize: 24, fontWeight: "bold", color: "#1f2937", minWidth: 40, textAlign: "center" },
  qtyUnit: { fontSize: 14, color: "#6b7280" },
  datesRow: { flexDirection: "row", gap: 10, paddingVertical: 4 },
  dateCard: {
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: "#f3f4f6",
    borderWidth: 2,
    borderColor: "#e5e7eb",
    minWidth: 64,
  },
  dateCardSelected: { backgroundColor: "#16a34a", borderColor: "#16a34a" },
  dateDay: { fontSize: 11, color: "#6b7280", fontWeight: "500" },
  dateLabel: { fontSize: 13, fontWeight: "700", color: "#1f2937", marginTop: 2 },
  dateTextSelected: { color: "#fff" },
  submitBtn: {
    backgroundColor: "#16a34a",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 16,
  },
  submitBtnDisabled: { opacity: 0.6 },
  submitBtnText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  successBox: {
    backgroundColor: "#f0fdf4",
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#bbf7d0",
  },
  successText: { color: "#15803d", fontWeight: "600", fontSize: 14 },
  successLink: { color: "#16a34a", marginTop: 6, fontWeight: "600", textDecorationLine: "underline" },
  errorBox: {
    backgroundColor: "#fef2f2",
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  errorText: { color: "#dc2626", fontSize: 13 },
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