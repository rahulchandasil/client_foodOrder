const categories = [
  "All",
  "Pizza",
  "Burger",
  "Biryani",
  "Chinese",
  "Drinks",
  "Desserts",
];

const CategoryFilter = ({ selected, setSelected }) => {
  return (
    <div className="flex flex-wrap gap-3">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => setSelected(category)}
          className={`rounded-full px-4 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-orange-300 focus:ring-offset-2 ${
            selected === category
              ? "bg-orange-500 text-white shadow-sm dark-pill-active"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark-pill"
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;
