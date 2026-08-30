import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useApp } from "../context/AppContext";
import api from "../services/api";
import { Button } from "./ui/Button";
import { Badge } from "./ui/Badge";

const FoodCard = React.memo(function FoodCard({ food }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { success, error } = useApp();

  const addToCartMutation = useMutation({
    mutationFn: async () => {
      const response = await api.post("/cart", { foodId: food._id, quantity: 1 });
      return response.data.cart;
    },
    onSuccess: (updatedCart) => {
      queryClient.setQueryData(["cart"], updatedCart);
      success(`${food.name} added to cart`);
    },
    onError: (err) => {
      error("Unable to add item to cart. Please try again.");
      console.error("ADD TO CART ERROR:", err.response?.status, err.response?.data, err);
    }
  });

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      return navigate("/login");
    }
    addToCartMutation.mutate();
  };

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-sm transition-all hover:shadow-md">
      <div className="relative aspect-video w-full overflow-hidden bg-muted">
        <img
          src={food.image}
          alt={food.name}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://placehold.co/600x400/f1f5f9/64748b?text=Food+Image";
          }}
        />
        <div className="absolute left-3 top-3 z-10">
          <Badge variant="primary" className="px-3 py-1 shadow-sm">
            {food.category}
          </Badge>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-4">
          <h3 className="font-semibold text-foreground line-clamp-1">{food.name}</h3>
          <span className="shrink-0 font-bold text-primary">₹{food.price}</span>
        </div>

        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground flex-1">
          {food.description}
        </p>

        <div className="mt-5 flex gap-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => navigate(`/food/${food._id}`, { state: { food } })}
          >
            Details
          </Button>

          <Button
            variant="primary"
            className="flex-1"
            onClick={handleAddToCart}
            isLoading={addToCartMutation.isPending}
            disabled={addToCartMutation.isPending}
          >
            {addToCartMutation.isPending ? "Adding..." : "Add to Cart"}
          </Button>
        </div>
      </div>
    </article>
  );
});

export default FoodCard;
