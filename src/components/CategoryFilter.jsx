import { Button } from "./ui/Button";

const CategoryFilter = ({ categories = [], selected, setSelected }) => {
  return (
    <div className="flex flex-nowrap md:flex-wrap gap-2 overflow-x-auto pb-2 -mb-2 scrollbar-hide">
      {categories.map((category) => (
        <Button
          key={category}
          variant={selected === category ? "primary" : "secondary"}
          size="sm"
          className="rounded-full shrink-0"
          onClick={() => setSelected(category)}
        >
          {category}
        </Button>
      ))}
    </div>
  );
};

export default CategoryFilter;
