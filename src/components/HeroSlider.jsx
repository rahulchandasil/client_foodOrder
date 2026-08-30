import { useState, useEffect } from "react";
import heroImage from "../assets/hero.png";

const HeroSlider = ({ heroFoods }) => {
  const [heroImageIndex, setHeroImageIndex] = useState(0);

  useEffect(() => {
    if (!heroFoods || heroFoods.length === 0) return;
    const interval = setInterval(() => {
      setHeroImageIndex((prev) => (prev + 1) % heroFoods.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [heroFoods]);

  return (
    <div className="relative min-w-0 flex items-center justify-center">
      <div className="relative w-full max-w-md aspect-square mx-auto lg:max-w-lg">
        <div className="absolute -inset-4 rounded-[3rem] bg-primary/5 blur-3xl" />
        {heroFoods && heroFoods.length > 0 ? (
          heroFoods.map((food, index) => (
            <img
              key={food._id}
              src={food.image}
              alt={food.name}
              className={`absolute inset-0 h-full w-full object-contain transition-all duration-700 ease-in-out ${
                index === heroImageIndex
                  ? "opacity-100 scale-100"
                  : "opacity-0 scale-95"
              }`}
            />
          ))
        ) : (
          <img
            src={heroImage}
            alt="Delicious food platter"
            className="absolute inset-0 h-full w-full object-contain"
          />
        )}
      </div>
    </div>
  );
};

export default HeroSlider;
