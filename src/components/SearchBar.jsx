const SearchBar = ({ search, setSearch }) => {
  return (
    <label className="block">
      <span className="sr-only">Search food</span>
      <input
        type="text"
        placeholder="Search food..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full rounded-full border border-orange-100 bg-white px-5 py-3 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-200 md:w-96"
      />
    </label>
  );
};

export default SearchBar;
