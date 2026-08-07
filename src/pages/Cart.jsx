import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";
import LoadingSpinner from "../components/LoadingSpinner";
import EmptyState from "../components/EmptyState";
import { useApp } from "../context/AppContext";

const Cart = () => {
  const navigate = useNavigate();
  const { user } = useApp();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return navigate("/login");
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const response = await api.get(`/cart?userId=${user._id}`);
      setCart(response.data.cart || { items: [] });
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    if (quantity < 1) return;
    await api.put(`/cart/${itemId}`, { quantity });
    fetchCart();
  };

  const removeItem = async (itemId) => {
    await api.delete(`/cart/${itemId}`);
    fetchCart();
  };

  const total = useMemo(() => cart?.items.reduce((sum, item) => sum + item.foodId.price * item.quantity, 0) || 0, [cart]);

  if (loading) {
    return <>
      <Navbar />
      <LoadingSpinner label="Loading cart..." />
    </>;
  }

  if (!cart || cart.items.length === 0) {
    return <>
      <Navbar />
      <EmptyState icon="🛒" title="Your cart is empty" description="Your selected foods will appear here once you add them." />
    </>;
  }

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-6xl px-5 py-10">
        <h1 className="text-4xl font-black text-slate-900">My Cart</h1>
        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          <div className="space-y-5 lg:col-span-2">
            {cart.items.map((item) => (
              <div key={item._id} className="flex flex-col gap-5 rounded-3xl bg-white p-5 shadow-xl ring-1 ring-orange-100 md:flex-row">
                <img src={item.foodId.image} alt={item.foodId.name} className="h-44 w-full rounded-2xl object-cover md:w-44" />
                <div className="flex-1">
                  <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">{item.foodId.category}</span>
                  <h2 className="mt-3 text-2xl font-bold text-slate-900">{item.foodId.name}</h2>
                  <p className="mt-2 text-sm text-slate-600">₹{item.foodId.price}</p>
                  <div className="mt-5 flex items-center gap-3">
                    <button onClick={() => updateQuantity(item._id, item.quantity - 1)} className="h-10 w-10 rounded-full bg-slate-100 font-bold transition hover:bg-slate-200">-</button>
                    <span className="min-w-8 text-center text-lg font-semibold">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item._id, item.quantity + 1)} className="h-10 w-10 rounded-full bg-slate-100 font-bold transition hover:bg-slate-200">+</button>
                  </div>
                  <button onClick={() => removeItem(item._id)} className="mt-5 text-sm font-semibold text-red-500 transition hover:text-red-600">Remove</button>
                </div>
                <div className="text-right text-xl font-black text-slate-900">₹{item.foodId.price * item.quantity}</div>
              </div>
            ))}
          </div>
          <aside className="h-fit rounded-3xl bg-white p-6 shadow-xl ring-1 ring-orange-100">
            <h2 className="text-2xl font-bold">Order Summary</h2>
            <div className="mt-5 space-y-3 text-sm">
              <div className="flex justify-between"><span>Subtotal</span><span>₹{total}</span></div>
              <div className="flex justify-between"><span>Delivery</span><span className="text-emerald-600">Free</span></div>
            </div>
            <hr className="my-5" />
            <div className="flex justify-between text-2xl font-black"><span>Total</span><span>₹{total}</span></div>
            <button onClick={() => navigate("/checkout")} className="mt-6 w-full rounded-full bg-gradient-to-r from-orange-500 to-amber-500 py-3 font-semibold text-white transition hover:shadow-lg">
              Proceed To Checkout
            </button>
          </aside>
        </div>
      </main>
    </>
  );
};

export default Cart;
