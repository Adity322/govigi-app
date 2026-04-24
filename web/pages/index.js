import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Cookies from "js-cookie";

export default function Landing() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      router.push("/products");
    } else {
      setChecking(false);
    }
  }, []);

  // Show nothing while checking token — prevents flash
  if (checking) return null;

  const features = [
    {
      icon: "🛒",
      title: "Easy Bulk Ordering",
      description:
        "Place bulk orders for vegetables and fruits in just a few clicks with delivery date selection.",
    },
    {
      icon: "📦",
      title: "Real-Time Order Tracking",
      description:
        "Track your orders from Pending to Confirmed to Delivered — all in one place.",
    },
    {
      icon: "🥦",
      title: "Fresh Produce Catalogue",
      description:
        "Browse a wide range of fresh vegetables and fruits with live pricing per kg or piece.",
    },
    {
      icon: "🔐",
      title: "Secure Retailer Access",
      description:
        "Your account and orders are protected with JWT-based authentication.",
    },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col">

      {/* Navbar */}
      <nav className="bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between">
        <span className="text-2xl font-bold text-green-600">🥦 GoVigi</span>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm font-medium text-gray-600 hover:text-green-600 transition px-4 py-2 rounded-lg"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="text-sm font-semibold bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg transition"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center px-6 py-24 bg-green-50">
        <span className="bg-green-100 text-green-700 text-xs font-semibold px-4 py-1 rounded-full mb-6 tracking-wide uppercase">
          For Retailers
        </span>
        <h1 className="text-5xl font-extrabold text-gray-800 leading-tight max-w-2xl">
          Fresh Produce,{" "}
          <span className="text-green-600">Ordered Smart.</span>
        </h1>
        <p className="text-gray-500 mt-5 text-lg max-w-xl">
          GoVigi is a simple and powerful platform for retailers to browse,
          order, and track fresh vegetables and fruits in bulk.
        </p>
        <div className="flex items-center gap-4 mt-8">
          <Link
            href="/register"
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3 rounded-xl transition text-sm"
          >
            Create Free Account
          </Link>
          <Link
            href="/login"
            className="border border-gray-300 hover:border-green-400 text-gray-700 font-semibold px-8 py-3 rounded-xl transition text-sm"
          >
            Login
          </Link>
        </div>

        {/* Stats Row */}
        <div className="flex items-center gap-10 mt-14">
          <div className="text-center">
            <p className="text-3xl font-bold text-green-600">7+</p>
            <p className="text-xs text-gray-400 mt-1">Products Available</p>
          </div>
          <div className="w-px h-10 bg-gray-200" />
          <div className="text-center">
            <p className="text-3xl font-bold text-green-600">100%</p>
            <p className="text-xs text-gray-400 mt-1">Fresh Produce</p>
          </div>
          <div className="w-px h-10 bg-gray-200" />
          <div className="text-center">
            <p className="text-3xl font-bold text-green-600">24/7</p>
            <p className="text-xs text-gray-400 mt-1">Order Anytime</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-8 py-20 max-w-5xl mx-auto w-full">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800">
            Everything you need to manage orders
          </h2>
          <p className="text-gray-400 mt-3 text-sm">
            Built specifically for produce retailers who need a fast and simple ordering system.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-gray-50 border border-gray-100 rounded-2xl p-6 hover:shadow-md transition"
            >
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-2xl shadow-sm mb-4">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-green-600 mx-8 mb-16 rounded-2xl px-10 py-12 text-center max-w-5xl mx-auto w-full">
        <h2 className="text-3xl font-bold text-white mb-3">
          Ready to start ordering?
        </h2>
        <p className="text-green-100 text-sm mb-6">
          Join GoVigi today and simplify your produce ordering process.
        </p>
        <Link
          href="/register"
          className="bg-white text-green-700 font-semibold px-8 py-3 rounded-xl hover:bg-green-50 transition text-sm"
        >
          Create Free Account →
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 px-8 py-6 text-center text-xs text-gray-400">
        © 2026 GoVigi. Built for retailers who mean business. 🥦
      </footer>

    </div>
  );
}