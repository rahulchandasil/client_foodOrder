import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "../services/api";
import Navbar from "../components/Navbar";
import SearchBar from "../components/SearchBar";
import CategoryFilter from "../components/CategoryFilter";
import FoodCard from "../components/FoodCard";
import HeroSlider from "../components/HeroSlider";
import useDebounce from "../hooks/useDebounce";
import { Container } from "../components/ui/Container";
import { SectionHeading } from "../components/ui/SectionHeading";
import { EmptyState } from "../components/ui/EmptyState";
import { ErrorState } from "../components/ui/ErrorState";
import { Skeleton } from "../components/ui/Skeleton";
import { Button } from "../components/ui/Button";

const fetchFoods = async () => {
  const res = await api.get("/foods");
  return res.data.foods || [];
};

const Home = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState("All");

  const debouncedSearch = useDebounce(search, 300);

  const { data: foods = [], isLoading, isError, refetch } = useQuery({
    queryKey: ["foods"],
    queryFn: fetchFoods,
  });

  const categories = useMemo(() => {
    const cats = foods.map((food) => food.category).filter(Boolean);
    return ["All", ...new Set(cats)];
  }, [foods]);

  const filteredFoods = useMemo(() => {
    return foods.filter((food) => {
      const matchesSearch = food.name.toLowerCase().includes(debouncedSearch.toLowerCase());
      const matchesCategory = selected === "All" || food.category === selected;
      return matchesSearch && matchesCategory;
    });
  }, [foods, debouncedSearch, selected]);

  const handleResetFilters = () => {
    setSearch("");
    setSelected("All");
  };

  const heroFoods = useMemo(() => foods.slice(0, 5), [foods]);

  return (
    <>
      <Navbar />

      <main className="pb-16 overflow-x-hidden">
        <Container className="mt-6 md:mt-10">
          <section className="mb-12 overflow-hidden rounded-3xl bg-surface px-6 py-10 shadow-sm border border-border md:px-12 md:py-16">
            <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
              <div className="min-w-0">
                <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
                  Fast food delivery
                </span>
                <h1 className="mt-4 text-4xl font-bold leading-tight text-foreground md:text-5xl lg:text-6xl">
                  Delicious meals, delivered with a modern ordering experience.
                </h1>
                <p className="mt-4 text-lg text-muted-foreground">
                  Discover fresh dishes, add favorites to cart in one tap, and checkout with ease.
                </p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <Button size="lg" onClick={() => document.getElementById("menu").scrollIntoView({ behavior: "smooth" })}>
                    Explore Menu
                  </Button>
                  <Button variant="outline" size="lg" onClick={() => navigate("/cart")}>
                    View Cart
                  </Button>
                </div>
              </div>
              
              <HeroSlider heroFoods={heroFoods} />
            </div>
          </section>

          <section id="menu" className="scroll-mt-24">
            <SectionHeading
              eyebrow="Menu"
              title="Choose your meal"
              className="mb-6"
              action={<SearchBar search={search} setSearch={setSearch} />}
            />

            <div className="mb-8 overflow-x-auto pb-2">
              <CategoryFilter categories={categories} selected={selected} setSelected={setSelected} />
            </div>

            {isError ? (
              <ErrorState 
                title="Failed to load menu" 
                description="We couldn't reach the server. Please try again." 
                onRetry={() => refetch()} 
              />
            ) : isLoading ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
                    <Skeleton className="aspect-video w-full rounded-none" />
                    <div className="flex flex-1 flex-col p-5">
                      <Skeleton className="h-6 w-3/4 mb-4" />
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-5/6 mb-6" />
                      <div className="mt-auto flex gap-3">
                        <Skeleton className="h-10 flex-1" />
                        <Skeleton className="h-10 flex-1" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredFoods.length === 0 ? (
              search || selected !== "All" ? (
                <EmptyState
                  icon="🔎"
                  title="No dishes found"
                  description="We couldn’t find a dish matching your criteria. Try adjusting your filters."
                  actionText="Clear Filters"
                  onAction={handleResetFilters}
                />
              ) : (
                <EmptyState
                  icon="🍽️"
                  title="No products available"
                  description="There are no items to show right now. Please check back soon."
                />
              )
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredFoods.map((food) => (
                  <FoodCard key={food._id} food={food} />
                ))}
              </div>
            )}
          </section>
        </Container>
      </main>
    </>
  );
};

export default Home;
