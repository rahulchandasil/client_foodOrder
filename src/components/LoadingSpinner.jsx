const LoadingSpinner = ({ label = "Loading..." }) => {
  return (
    <div
      className="flex min-h-[40vh] items-center justify-center"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="flex flex-col items-center gap-4 rounded-2xl bg-white/80 px-8 py-10 shadow-lg ring-1 ring-orange-100 backdrop-blur">
        <div className="h-14 w-14 animate-spin rounded-full border-4 border-orange-200 border-t-orange-500" />
        <p className="text-sm font-medium text-slate-600">{label}</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
