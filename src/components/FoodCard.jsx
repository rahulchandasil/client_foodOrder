import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

const FoodCard = ({ food }) => {
  const navigate = useNavigate();
  const [adding, setAdding] = useState(false);

  const handleAddToCart = async () => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      return navigate("/login");
    }

    try {
      setAdding(true);
      await api.post("/cart", {
        userId: user._id,
        foodId: food._id,
        quantity: 1,
      });

      navigate("/cart");
    } catch (error) {
      console.log(error);
    } finally {
      setAdding(false);
    }
  };

  return (
    <article className="group overflow-hidden rounded-3xl border border-orange-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-2xl">
      <div className="relative">
        <img
          src={food.image}
          alt={food.name}
          className="h-56 w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-orange-600 shadow">
          {food.category}
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-xl font-bold text-slate-900">{food.name}</h2>
          <span className="shrink-0 text-lg font-black text-orange-600">₹{food.price}</span>
        </div>

        <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">
          {food.description}
        </p>

        <div className="mt-5 flex gap-3">
          <Link
            to={`/food/${food._id}`}
            className="inline-flex flex-1 items-center justify-center rounded-full border border-orange-200 px-4 py-3 text-sm font-semibold text-orange-600 transition duration-200 hover:border-orange-300 hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:ring-offset-2 active:scale-[0.98]"
          >
            View Details
          </Link>

          <button
            onClick={handleAddToCart}
            disabled={adding}
            className="inline-flex flex-1 items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-4 py-3 text-sm font-semibold text-white shadow-sm transition duration-200 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-orange-300 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70 active:scale-[0.98]"
          >
            {adding ? "Adding..." : "Add To Cart"}
          </button>
        </div>
      </div>
    </article>
  );
};

export default FoodCard;
