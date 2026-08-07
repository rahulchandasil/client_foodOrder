import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";
import LoadingSpinner from "../components/LoadingSpinner";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [food, setFood] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetchFood();
  }, []);

  const fetchFood = async () => {
    try {
      const response = await api.get(`/foods/${id}`);
      setFood(response.data.food);
    } catch (error) {
      console.log(error);
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return navigate("/login");
    try {
      setAdding(true);
      await api.post("/cart", { userId: user._id, foodId: food._id, quantity: 1 });
      navigate("/cart");
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <LoadingSpinner label="Loading product..." />
      </>
    );
  }

  if (!food) return null;

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-6xl px-5 py-10">
        <div className="grid gap-8 rounded-[2rem] bg-white p-6 shadow-xl ring-1 ring-orange-100 md:grid-cols-2 md:p-8">
          <div>
            <img
              src={food.image}
              alt={food.name}
              className="h-[320px] w-full rounded-3xl object-cover md:h-[520px]"
            />
          </div>
          <div className="flex flex-col justify-center">
            <span className="mb-4 w-fit rounded-full bg-orange-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-orange-700">
              {food.category}
            </span>
            <h1 className="text-3xl font-black text-slate-900 md:text-5xl">{food.name}</h1>
            <p className="mt-4 text-base leading-7 text-slate-600 md:text-lg">{food.description}</p>
            <div className="mt-6 rounded-2xl bg-orange-50 p-4">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-700">Price</p>
              <p className="mt-1 text-3xl font-black text-orange-600">₹{food.price}</p>
            </div>
            <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
              <p className="font-semibold text-slate-900">Delivery information</p>
              <p className="mt-1">Free delivery available. Freshly prepared and packed with care.</p>
            </div>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={handleAddToCart}
                disabled={adding}
                className="inline-flex flex-1 items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-5 py-3 font-semibold text-white transition hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-orange-300 focus:ring-offset-2 disabled:opacity-70"
              >
                {adding ? "Adding..." : "Add To Cart"}
              </button>
              <button
                onClick={() => navigate("/")}
                className="inline-flex flex-1 items-center justify-center rounded-full border border-orange-200 px-5 py-3 font-semibold text-orange-600 transition hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:ring-offset-2"
              >
                Back Home
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default ProductDetails;
