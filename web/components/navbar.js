import Link from "next/link";
import { useRouter } from "next/router";
import Cookies from "js-cookie";

export default function Navbar() {
  const router = useRouter();

  const handleLogout = () => {
  Cookies.remove("token");
  router.push("/");
};

  return (
    <nav className="bg-green-700 text-white px-6 py-4 flex items-center justify-between shadow-md">
      {/* Logo */}
      <Link href="/products" className="text-2xl font-bold tracking-wide hover:text-green-200 transition">
        🥦 GoVigi
      </Link>

      {/* Nav Links */}
      <div className="flex items-center gap-6">
        <Link
          href="/products"
          className={`text-sm font-medium hover:text-green-200 transition ${
            router.pathname === "/products" ? "underline underline-offset-4" : ""
          }`}
        >
          Products
        </Link>
        <Link
          href="/place-order"
          className={`text-sm font-medium hover:text-green-200 transition ${
            router.pathname === "/place-order" ? "underline underline-offset-4" : ""
          }`}
        >
          Place Order
        </Link>
        <Link
          href="/my-orders"
          className={`text-sm font-medium hover:text-green-200 transition ${
            router.pathname === "/my-orders" ? "underline underline-offset-4" : ""
          }`}
        >
          My Orders
        </Link>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="bg-white text-green-700 text-sm font-semibold px-4 py-1.5 rounded-lg hover:bg-green-100 transition"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}