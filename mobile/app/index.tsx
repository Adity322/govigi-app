import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Index() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [showSplash, setShowSplash] = useState(true);
  const fadeAnim = new Animated.Value(0);
  const slideAnim = new Animated.Value(30);

  useEffect(() => {
    // Fade in animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // Check if already logged in
    const checkToken = async () => {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        // Already logged in — skip splash and go to products
        // @ts-ignore
        router.replace("/products");
      } else {
        // Not logged in — show splash
        setChecking(false);
      }
    };
    checkToken();
  }, []);

  if (checking) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingLogo}>🥦</Text>
        <ActivityIndicator color="#fff" style={{ marginTop: 16 }} />
      </View>
    );
  }

  return (
    <View style={styles.container}>

      {/* Background circles for design */}
      <View style={styles.circle1} />
      <View style={styles.circle2} />

      {/* Main Content */}
      <Animated.View
        style={[
          styles.content,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
        ]}
      >
        {/* Logo */}
        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoEmoji}>🥦</Text>
          </View>
          <Text style={styles.logoText}>GoVigi</Text>
          <Text style={styles.tagline}>Fresh Produce, Ordered Smart</Text>
        </View>

        {/* Features */}
        <View style={styles.featuresContainer}>
          <View style={styles.featureItem}>
            <Text style={styles.featureEmoji}>🛒</Text>
            <Text style={styles.featureText}>Easy Bulk Ordering</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureEmoji}>📦</Text>
            <Text style={styles.featureText}>Real-Time Tracking</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureEmoji}>🍎</Text>
            <Text style={styles.featureText}>Fresh Produce Catalogue</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureEmoji}>🔐</Text>
            <Text style={styles.featureText}>Secure Retailer Access</Text>
          </View>
        </View>
      </Animated.View>

      {/* Bottom Buttons */}
      <Animated.View
        style={[styles.buttonsContainer, { opacity: fadeAnim }]}
      >
        <TouchableOpacity
          style={styles.registerBtn}
          // @ts-ignore
          onPress={() => router.push("/register")}
        >
          <Text style={styles.registerBtnText}>Create Free Account</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.loginBtn}
          // @ts-ignore
          onPress={() => router.push("/login")}
        >
          <Text style={styles.loginBtnText}>Login</Text>
        </TouchableOpacity>

        <Text style={styles.footerText}>
          For retailers who mean business 🥦
        </Text>
      </Animated.View>

    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: "#15803d",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingLogo: {
    fontSize: 60,
  },
  container: {
    flex: 1,
    backgroundColor: "#15803d",
    justifyContent: "space-between",
    paddingVertical: 60,
    paddingHorizontal: 24,
  },
  // Decorative circles
  circle1: {
    position: "absolute",
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: "rgba(255,255,255,0.05)",
    top: -80,
    right: -80,
  },
  circle2: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "rgba(255,255,255,0.05)",
    bottom: 100,
    left: -60,
  },
  content: {
    flex: 1,
    justifyContent: "center",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 48,
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  logoEmoji: {
    fontSize: 52,
  },
  logoText: {
    fontSize: 42,
    fontWeight: "800",
    color: "#fff",
    letterSpacing: 1,
  },
  tagline: {
    fontSize: 15,
    color: "#bbf7d0",
    marginTop: 6,
    textAlign: "center",
  },
  featuresContainer: {
    gap: 14,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 14,
    gap: 14,
  },
  featureEmoji: {
    fontSize: 24,
  },
  featureText: {
    fontSize: 15,
    color: "#fff",
    fontWeight: "500",
  },
  buttonsContainer: {
    gap: 12,
  },
  registerBtn: {
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
  },
  registerBtnText: {
    color: "#15803d",
    fontSize: 16,
    fontWeight: "700",
  },
  loginBtn: {
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.5)",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
  },
  loginBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  footerText: {
    textAlign: "center",
    color: "rgba(255,255,255,0.5)",
    fontSize: 12,
    marginTop: 4,
  },
});