import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Navbar from "../components/Navbar";
import api from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";
import EmptyState from "../components/EmptyState";
import { useApp } from "../context/AppContext";

const fetchCartData = async () => {
  const response = await api.get(`/cart`);
  return response.data.cart || { items: [] };
};

const Checkout = () => {
  const navigate = useNavigate();
  const { success, error, user } = useApp();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({ fullName: "", mobile: "", address: "" });
  const [errors, setErrors] = useState({});

  const { data: cart, isLoading: loading } = useQuery({
    queryKey: ["cart"],
    queryFn: fetchCartData,
    enabled: !!user,
  });

  const total = useMemo(() => cart?.items.reduce((sum, item) => sum + item.foodId.price * item.quantity, 0) || 0, [cart]);

  const validate = () => {
    const next = {};
    if (!formData.fullName.trim()) next.fullName = "Full name is required";
    if (!/^\d{10}$/.test(formData.mobile)) next.mobile = "Mobile number must be 10 digits";
    if (!formData.address.trim()) next.address = "Address is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const placeOrderMutation = useMutation({
    mutationFn: async (orderData) => {
      const response = await api.post("/orders", orderData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["cart"]);
      success("Order placed successfully");
      navigate("/success");
    },
    onError: (err) => {
      error(err.response?.data?.message || "Order Failed");
    },
  });

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    if (!validate()) return;
    placeOrderMutation.mutate({ address: formData.address, mobile: formData.mobile });
  };

  if (!user) {
    navigate("/login");
    return null;
  }

  if (loading) {
    return <>
      <Navbar />
      <LoadingSpinner label="Loading checkout..." />
    </>;
  }

  if (!cart || cart.items.length === 0) {
    return <>
      <Navbar />
      <EmptyState icon="🧺" title="Your cart is empty" description="Add some delicious meals before heading to checkout." />
    </>;
  }

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-6xl px-5 py-10">
        <h1 className="text-4xl font-black text-slate-900">Checkout</h1>
        <div className="mt-8 grid gap-8 md:grid-cols-2">
          <form onSubmit={handlePlaceOrder} className="space-y-5 rounded-3xl bg-white p-6 shadow-xl ring-1 ring-orange-100">
            <h2 className="text-2xl font-bold">Delivery Details</h2>
            {["fullName","mobile","address"].map((key) => (
              <div key={key}>
                <label htmlFor={key} className="mb-2 block text-sm font-medium text-slate-700">{key === "fullName" ? "Full Name" : key === "mobile" ? "Mobile Number" : "Delivery Address"}</label>
                {key === "address" ? (
                  <textarea id={key} name={key} rows="4" value={formData[key]} onChange={(e) => setFormData({ ...formData, [key]: e.target.value })} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-200" />
                ) : (
                  <input id={key} type="text" name={key} value={formData[key]} onChange={(e) => setFormData({ ...formData, [key]: e.target.value })} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-200" />
                )}
                {errors[key] && <p className="mt-1 text-sm text-red-600">{errors[key]}</p>}
              </div>
            ))}
            <button 
              disabled={placeOrderMutation.isPending}
              className="w-full rounded-full bg-gradient-to-r from-orange-500 to-amber-500 py-3 font-semibold text-white transition hover:shadow-lg disabled:opacity-70"
            >
              {placeOrderMutation.isPending ? "Placing Order..." : "Place Order"}
            </button>
          </form>
          <div className="rounded-3xl bg-white p-6 shadow-xl ring-1 ring-orange-100">
            <h2 className="text-2xl font-bold">Order Summary</h2>
            <div className="mt-5 space-y-4">
              {cart.items.map((item) => (
                <div key={item._id} className="flex items-center justify-between gap-4 rounded-2xl bg-slate-50 p-4">
                  <div>
                    <h3 className="font-semibold text-slate-900">{item.foodId.name}</h3>
                    <p className="text-sm text-slate-500">{item.quantity} x ₹{item.foodId.price}</p>
                  </div>
                  <p className="font-bold text-slate-900">₹{item.foodId.price * item.quantity}</p>
                </div>
              ))}
            </div>
            <hr className="my-5" />
            <div className="flex justify-between text-xl font-black">
              <span>Total</span>
              <span>₹{total}</span>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Checkout;
