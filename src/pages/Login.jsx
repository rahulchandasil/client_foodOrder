import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { useApp } from "../context/AppContext";

const Login = () => {
  const navigate = useNavigate();
  const { setUser, success, error } = useApp();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const next = {};
    if (!formData.email) next.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) next.email = "Enter a valid email";
    if (!formData.password) next.password = "Password is required";
    else if (formData.password.length < 6) next.password = "Password must be at least 6 characters";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      setLoading(true);
      const response = await api.post("/auth/login", formData);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      setUser(response.data.user);
      success(response.data.message || "Login successful");
      navigate("/");
    } catch (err) {
      error(err.response?.data?.message || "Login Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 px-4 py-10">
      <div className="mx-auto flex max-w-6xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-[2rem] bg-white shadow-2xl ring-1 ring-orange-100 md:grid-cols-2">
          <div className="hidden bg-gradient-to-br from-orange-500 to-amber-400 p-10 text-white md:flex md:flex-col md:justify-center">
            <span className="text-sm font-semibold uppercase tracking-[0.2em]">Welcome back</span>
            <h1 className="mt-4 text-4xl font-black leading-tight">Order faster with your saved account.</h1>
            <p className="mt-4 text-white/90">Sign in to continue browsing dishes, managing your cart, and checking out seamlessly.</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5 p-6 md:p-10">
            <div>
              <h2 className="text-3xl font-black text-slate-900">Login</h2>
              <p className="mt-2 text-sm text-slate-500">Use your registered email and password.</p>
            </div>
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-700">Email</label>
              <input id="email" type="email" name="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-200" />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>
            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-700">Password</label>
              <input id="password" type="password" name="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-200" />
              {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
            </div>
            <button disabled={loading} className="w-full rounded-full bg-gradient-to-r from-orange-500 to-amber-500 py-3 font-semibold text-white transition hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70">
              {loading ? "Logging in..." : "Login"}
            </button>
            <p className="text-center text-sm text-slate-600">
              Don't have an account? <Link to="/register" className="font-semibold text-orange-600">Register</Link>
            </p>
          </form>
        </div>
      </div>
    </main>
  );
};

export default Login;
