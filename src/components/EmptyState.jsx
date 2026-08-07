import { Link } from "react-router-dom";

const EmptyState = ({ icon, title, description, actionLabel = "Back to Home", actionTo = "/" }) => {
  return (
    <div className="flex min-h-[50vh] items-center justify-center px-4 py-12">
      <div className="max-w-md rounded-3xl bg-white p-8 text-center shadow-xl ring-1 ring-orange-100">
        <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-orange-100 text-4xl">
          {icon}
        </div>
        <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
        <p className="mt-3 text-sm leading-6 text-slate-600">{description}</p>
        <Link
          to={actionTo}
          className="mt-6 inline-flex items-center justify-center rounded-full bg-orange-500 px-5 py-3 font-semibold text-white transition duration-200 hover:bg-orange-600 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 active:scale-[0.98]"
        >
          {actionLabel}
        </Link>
      </div>
    </div>
  );
};

export default EmptyState;
