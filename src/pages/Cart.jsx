import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FaTrash, FaPlus, FaMinus } from "react-icons/fa";
import api from "../services/api";
import Navbar from "../components/Navbar";
import { useApp } from "../context/AppContext";

import { Container } from "../components/ui/Container";
import { SectionHeading } from "../components/ui/SectionHeading";
import { Button } from "../components/ui/Button";
import { IconButton } from "../components/ui/IconButton";
import { Badge } from "../components/ui/Badge";
import { EmptyState } from "../components/ui/EmptyState";
import { ErrorState } from "../components/ui/ErrorState";
import { Skeleton } from "../components/ui/Skeleton";

const fetchCartData = async () => {
  const response = await api.get(`/cart`);
  return response.data.cart || { items: [] };
};

const Cart = () => {
  const navigate = useNavigate();
  const { user } = useApp();
  const queryClient = useQueryClient();

  const { data: cart, isLoading: loading, isError, refetch } = useQuery({
    queryKey: ["cart"],
    queryFn: fetchCartData,
    enabled: !!user,
  });

  const updateQuantityMutation = useMutation({
    mutationFn: async ({ itemId, quantity }) => {
      const response = await api.put(`/cart/${itemId}`, { quantity });
      return response.data.cart;
    },
    onSuccess: (updatedCart) => {
      queryClient.setQueryData(["cart"], updatedCart);
    },
  });

  const removeItemMutation = useMutation({
    mutationFn: async (itemId) => {
      const response = await api.delete(`/cart/${itemId}`);
      return response.data.cart;
    },
    onSuccess: (updatedCart) => {
      queryClient.setQueryData(["cart"], updatedCart);
    },
  });

  const updateQuantity = (itemId, quantity) => {
    if (quantity < 1) return;
    updateQuantityMutation.mutate({ itemId, quantity });
  };

  const removeItem = (itemId) => {
    removeItemMutation.mutate(itemId);
  };

  const total = useMemo(() => cart?.items.reduce((sum, item) => sum + item.foodId.price * item.quantity, 0) || 0, [cart]);

  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <>
      <Navbar />
      <main className="pb-16 pt-8">
        <Container>
          <SectionHeading title="Your Cart" eyebrow="Checkout" className="mb-8" />
          
          {isError ? (
            <ErrorState 
              title="Unable to load your cart" 
              description="There was an error fetching your cart details." 
              onRetry={() => refetch()} 
            />
          ) : loading ? (
            <div className="grid gap-8 lg:grid-cols-3 items-start">
              <div className="space-y-4 lg:col-span-2">
                {[1, 2].map((i) => (
                  <div key={i} className="flex flex-col sm:flex-row gap-5 rounded-2xl border border-border bg-surface p-4 shadow-sm">
                    <Skeleton className="aspect-video sm:aspect-square h-40 sm:h-32 w-full sm:w-32 shrink-0 rounded-xl" />
                    <div className="flex-1 space-y-3 py-2">
                      <Skeleton className="h-6 w-1/2" />
                      <Skeleton className="h-4 w-1/4" />
                      <div className="mt-4 flex gap-4">
                        <Skeleton className="h-10 w-28 rounded-full" />
                        <Skeleton className="h-10 w-20" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="lg:col-span-1">
                <Skeleton className="h-64 w-full rounded-2xl" />
              </div>
            </div>
          ) : !cart || cart.items.length === 0 ? (
            <EmptyState 
              icon="🛒" 
              title="Your cart is empty" 
              description="Looks like you haven't added anything yet." 
              actionText="Browse Menu"
              onAction={() => navigate("/")}
            />
          ) : (
            <div className="grid gap-8 lg:grid-cols-3 items-start">
              <div className="space-y-4 lg:col-span-2">
                {cart.items.map((item) => (
                  <div key={item._id} className="flex flex-col sm:flex-row gap-5 rounded-2xl border border-border bg-surface p-4 shadow-sm transition-shadow hover:shadow-md">
                    <div className="relative aspect-video sm:aspect-square h-48 sm:h-32 w-full sm:w-32 shrink-0 overflow-hidden rounded-xl bg-muted">
                      <img 
                        src={item.foodId.image} 
                        alt={item.foodId.name} 
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          e.target.src = "https://placehold.co/600x400/f1f5f9/64748b?text=Food+Image";
                        }}
                      />
                      <div className="absolute left-2 top-2 z-10">
                        <Badge variant="primary" className="px-2.5 py-0.5 shadow-sm text-[10px]">
                          {item.foodId.category}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex flex-1 flex-col justify-between py-1">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h2 className="text-lg font-bold text-foreground line-clamp-1">{item.foodId.name}</h2>
                          <p className="mt-1 font-semibold text-primary">₹{item.foodId.price}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-black text-foreground">₹{item.foodId.price * item.quantity}</p>
                        </div>
                      </div>
                      
                      <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-3 rounded-full border border-border bg-muted/30 p-1">
                          <IconButton
                            variant="ghost"
                            size="sm"
                            aria-label={`Decrease quantity of ${item.foodId.name}`}
                            onClick={() => updateQuantity(item._id, item.quantity - 1)}
                            disabled={updateQuantityMutation.isPending || removeItemMutation.isPending}
                            className="h-8 w-8 rounded-full bg-surface shadow-sm text-foreground hover:bg-muted"
                          >
                            <FaMinus className="text-xs" />
                          </IconButton>
                          <span className="min-w-6 text-center text-sm font-semibold text-foreground">
                            {item.quantity}
                          </span>
                          <IconButton
                            variant="ghost"
                            size="sm"
                            aria-label={`Increase quantity of ${item.foodId.name}`}
                            onClick={() => updateQuantity(item._id, item.quantity + 1)}
                            disabled={updateQuantityMutation.isPending || removeItemMutation.isPending}
                            className="h-8 w-8 rounded-full bg-surface shadow-sm text-foreground hover:bg-muted"
                          >
                            <FaPlus className="text-xs" />
                          </IconButton>
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          aria-label={`Remove ${item.foodId.name} from cart`}
                          onClick={() => removeItem(item._id)}
                          disabled={updateQuantityMutation.isPending || removeItemMutation.isPending}
                          className="text-error hover:bg-error/10 hover:text-error"
                        >
                          <FaTrash className="mr-2 text-xs" />
                          Remove
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <aside className="sticky top-24 rounded-2xl border border-border bg-surface p-6 shadow-sm lg:col-span-1">
                <h2 className="text-xl font-bold text-foreground">Order Summary</h2>
                
                <div className="mt-6 space-y-4 text-sm text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-semibold text-foreground">₹{total}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery</span>
                    <span className="font-semibold text-success">Free</span>
                  </div>
                </div>
                
                <div className="my-6 h-px w-full bg-border" />
                
                <div className="flex justify-between text-lg font-black text-foreground">
                  <span>Total</span>
                  <span>₹{total}</span>
                </div>
                
                <Button 
                  variant="primary" 
                  size="lg" 
                  className="mt-8 w-full"
                  onClick={() => navigate("/checkout")}
                  disabled={updateQuantityMutation.isPending || removeItemMutation.isPending || cart.items.length === 0}
                >
                  Proceed to Checkout
                </Button>
              </aside>
            </div>
          )}
        </Container>
      </main>
    </>
  );
};

export default Cart;
