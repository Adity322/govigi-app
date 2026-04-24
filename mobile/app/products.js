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

export default function Products() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axiosInstance.get("/api/products");
      setProducts(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setError("Failed to load products.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    // @ts-ignore
    router.replace("/login");
  };

  const filteredProducts =
    activeCategory === "All"
      ? products
      : products.filter((p) => p.category === activeCategory);

  const renderProduct = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardEmoji}>
          {item.category === "Vegetable" ? "🥦" : "🍎"}
        </Text>
        <View
          style={[
            styles.categoryBadge,
            item.category === "Vegetable"
              ? styles.vegBadge
              : styles.fruitBadge,
          ]}
        >
          <Text
            style={[
              styles.categoryBadgeText,
              item.category === "Vegetable"
                ? styles.vegBadgeText
                : styles.fruitBadgeText,
            ]}
          >
            {item.category}
          </Text>
        </View>
      </View>
      <Text style={styles.productName}>{item.name}</Text>
      <View style={styles.cardFooter}>
        <Text style={styles.price}>
          ₹{item.price}
          <Text style={styles.unit}> / {item.unit}</Text>
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>🥦 GoVigi</Text>
          <Text style={styles.headerSubtitle}>Available Products</Text>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Nav */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push("/products")}
        >
          <Text style={styles.navEmoji}>🥦</Text>
          <Text style={[styles.navText, styles.navActive]}>Products</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push("/place-order")}
        >
          <Text style={styles.navEmoji}>🛒</Text>
          <Text style={styles.navText}>Order</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push("/my-orders")}
        >
          <Text style={styles.navEmoji}>📦</Text>
          <Text style={styles.navText}>My Orders</Text>
        </TouchableOpacity>
      </View>

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

      {/* Loading */}
      {loading && (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#16a34a" />
          <Text style={styles.loadingText}>Loading products...</Text>
        </View>
      )}

      {/* Error */}
      {error ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>❌ {error}</Text>
        </View>
      ) : null}

      {/* Products Grid */}
      {!loading && (
        <FlatList
          data={filteredProducts}
          renderItem={renderProduct}
          keyExtractor={(item) => item._id}
          numColumns={2}
          contentContainerStyle={styles.list}
          columnWrapperStyle={styles.row}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  header: {
    backgroundColor: "#15803d",
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
  },
  headerSubtitle: {
    fontSize: 13,
    color: "#bbf7d0",
    marginTop: 2,
  },
  logoutBtn: {
    backgroundColor: "#fff",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
  },
  logoutText: {
    color: "#15803d",
    fontWeight: "600",
    fontSize: 13,
  },
  filterRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  filterBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  filterBtnActive: {
    backgroundColor: "#16a34a",
    borderColor: "#16a34a",
  },
  filterText: {
    fontSize: 13,
    color: "#6b7280",
    fontWeight: "500",
  },
  filterTextActive: {
    color: "#fff",
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 80,
  },
  row: {
    justifyContent: "space-between",
    marginBottom: 12,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 14,
    width: "48%",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  cardEmoji: {
    fontSize: 28,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
  },
  vegBadge: {
    backgroundColor: "#dcfce7",
  },
  fruitBadge: {
    backgroundColor: "#ffedd5",
  },
  categoryBadgeText: {
    fontSize: 10,
    fontWeight: "600",
  },
  vegBadgeText: {
    color: "#16a34a",
  },
  fruitBadgeText: {
    color: "#ea580c",
  },
  productName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 8,
  },
  cardFooter: {
    marginTop: 4,
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#16a34a",
  },
  unit: {
    fontSize: 12,
    color: "#9ca3af",
    fontWeight: "normal",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    color: "#6b7280",
    fontSize: 14,
  },
  errorBox: {
    margin: 16,
    backgroundColor: "#fef2f2",
    padding: 12,
    borderRadius: 10,
  },
  errorText: {
    color: "#dc2626",
    fontSize: 13,
  },
  bottomNav: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    paddingVertical: 10,
  },
  navItem: {
    flex: 1,
    alignItems: "center",
  },
  navEmoji: {
    fontSize: 20,
  },
  navText: {
    fontSize: 11,
    color: "#6b7280",
    marginTop: 2,
  },
  navActive: {
    color: "#16a34a",
    fontWeight: "600",
  },
});