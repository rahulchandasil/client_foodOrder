import { Input } from "./ui/Input";

const SearchBar = ({ search, setSearch }) => {
  return (
    <div className="w-full md:w-80">
      <Input
        type="search"
        placeholder="Search menu..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        aria-label="Search food"
        className="rounded-full bg-surface"
      />
    </div>
  );
};

export default SearchBar;
