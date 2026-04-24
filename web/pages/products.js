import Navbar from "@/components/navbar";

export default function Products({ products, error }) {
    if (error) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="flex items-center justify-center mt-20">
                    <p className="text-red-500 text-lg">{error}</p>
                </div>
            </div>
        );
    }

    // Separate by category
    const vegetables = products.filter((p) => p.category === "Vegetable");
    const fruits = products.filter((p) => p.category === "Fruit");

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="max-w-6xl mx-auto px-6 py-10">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Available Products</h1>
                    <p className="text-gray-500 mt-1">Fresh vegetables and fruits for bulk ordering</p>
                </div>

                {/* Vegetables Section */}
                <section className="mb-10">
                    <h2 className="text-xl font-semibold text-green-700 mb-4 flex items-center gap-2">
                        🥦 Vegetables
                    </h2>
                    {vegetables.length === 0 ? (
                        <p className="text-gray-400">No vegetables available.</p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                            {vegetables.map((product) => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>
                    )}
                </section>

                {/* Fruits Section */}
                <section>
                    <h2 className="text-xl font-semibold text-orange-500 mb-4 flex items-center gap-2">
                        🍎 Fruits
                    </h2>
                    {fruits.length === 0 ? (
                        <p className="text-gray-400">No fruits available.</p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                            {fruits.map((product) => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}

// Product Card Component
function ProductCard({ product }) {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition">
            <div className="flex items-center justify-between mb-3">
                <span className="text-2xl">
                    {product.category === "Vegetable" ? "🥦" : "🍎"}
                </span>
                <span className="text-xs font-medium bg-green-100 text-green-700 px-2 py-1 rounded-full">
                    {product.category}
                </span>
            </div>
            <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
            <div className="flex items-center justify-between mt-3">
                <p className="text-green-600 font-bold text-lg">
                    ₹{product.price}
                    <span className="text-gray-400 text-sm font-normal"> / {product.unit}</span>
                </p>
                <span className="text-xs text-gray-400 border border-gray-200 px-2 py-1 rounded-lg">
                    {product.unit}
                </span>
            </div>
        </div>
    );
}

// SSR — fetch products on the server before page loads
// REPLACE WITH
export async function getServerSideProps() {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`);
        const data = await res.json();

        // Handle both { products: [...] } and plain array [...]
        // REPLACE WITH
        const products = Array.isArray(data) ? data : [];

        return {
            props: { products, error: null },
        };
    } catch (err) {
        return {
            props: { products: [], error: "Failed to load products." },
        };
    }
}