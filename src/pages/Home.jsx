import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";
import SearchBar from "../components/SearchBar";
import CategoryFilter from "../components/CategoryFilter";
import FoodCard from "../components/FoodCard";
import LoadingSpinner from "../components/LoadingSpinner";
import EmptyState from "../components/EmptyState";

const Home = () => {
  const [foods, setFoods] = useState([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFoods();
  }, []);

  const fetchFoods = async () => {
    try {
      const res = await api.get("/foods");
      setFoods(res.data.foods || []);
    } catch (error) {
      console.log(error);
      setFoods([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredFoods = foods.filter((food) => {
    const matchesSearch = food.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selected === "All" || food.category === selected;
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <Navbar />

      <main className="mx-auto max-w-7xl px-5 py-6">
        <section className="mb-10 overflow-hidden rounded-[2rem] bg-gradient-to-r from-orange-500 via-orange-500 to-amber-400 px-6 py-10 text-white shadow-2xl dark-surface md:px-10 md:py-14">
          <div className="grid gap-8 md:grid-cols-2 md:items-center">
            <div>
              <span className="inline-flex rounded-full bg-white/15 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white">
                Fast food delivery
              </span>
              <h1 className="mt-4 max-w-xl text-4xl font-black leading-tight text-white md:text-6xl">
                Delicious meals, delivered with a modern ordering experience.
              </h1>
              <p className="mt-4 max-w-xl text-base leading-7 text-white/90 md:text-lg">
                Discover fresh dishes, add favorites to cart in one tap, and checkout with ease.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  to="#menu"
                  className="inline-flex items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-orange-600 transition hover:bg-orange-50 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-white/70 active:scale-[0.98]"
                >
                  Explore Menu
                </Link>
                <Link
                  to="/cart"
                  className="inline-flex items-center justify-center rounded-full border border-white/30 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/70 active:scale-[0.98]"
                >
                  View Cart
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 rounded-[2rem] bg-white/10 blur-2xl" />
              <img
                src="/src/assets/hero.png"
                alt="Food platter"
                className="relative mx-auto w-full max-w-lg rounded-[2rem] object-cover shadow-xl"
              />
            </div>
          </div>
        </section>

        <section id="menu">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-600">
                Menu
              </p>
              <h2 className="mt-2 text-3xl font-black text-slate-900 dark-text">Choose your meal</h2>
            </div>
            <SearchBar search={search} setSearch={setSearch} />
          </div>

          <div className="my-6">
            <CategoryFilter selected={selected} setSelected={setSelected} />
          </div>

          {loading ? (
            <LoadingSpinner label="Loading dishes..." />
          ) : filteredFoods.length === 0 ? (
            search ? (
              <EmptyState
                icon="🔎"
                title="No search results"
                description="We couldn’t find a dish that matches your search. Try a different keyword or clear the filters."
              />
            ) : (
              <EmptyState
                icon="🍽️"
                title="No products available"
                description="There are no items to show right now. Please check back soon."
              />
            )
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
              {filteredFoods.map((food) => (
                <FoodCard key={food._id} food={food} />
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  );
};

export default Home;
