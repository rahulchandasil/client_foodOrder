import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { useApp } from "../context/AppContext";

const Register = () => {
  const navigate = useNavigate();
  const { success, error } = useApp();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const next = {};
    if (!formData.name.trim()) next.name = "Name is required";
    if (!formData.email) next.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) next.email = "Enter a valid email";
    if (!formData.password) next.password = "Password is required";
    else if (formData.password.length < 6) next.password = "Password must be at least 6 characters";
    if (!formData.confirmPassword) next.confirmPassword = "Confirm your password";
    else if (formData.password !== formData.confirmPassword) next.confirmPassword = "Passwords do not match";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      setLoading(true);
      const res = await api.post("/auth/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      success(res.data.message || "Registration successful");
      navigate("/login");
    } catch (err) {
      error(err.response?.data?.message || "Registration Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 px-4 py-10">
      <div className="mx-auto flex max-w-6xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-[2rem] bg-white shadow-2xl ring-1 ring-orange-100 md:grid-cols-2">
          <div className="hidden bg-gradient-to-br from-orange-500 to-amber-400 p-10 text-white md:flex md:flex-col md:justify-center">
            <span className="text-sm font-semibold uppercase tracking-[0.2em]">Join Foodie</span>
            <h1 className="mt-4 text-4xl font-black leading-tight">Create an account and start ordering in seconds.</h1>
            <p className="mt-4 text-white/90">Register once and save your details for a smoother, faster checkout experience.</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5 p-6 md:p-10">
            <div>
              <h2 className="text-3xl font-black text-slate-900">Register</h2>
              <p className="mt-2 text-sm text-slate-500">Fill in the details below to create your account.</p>
            </div>
            {["name","email","password","confirmPassword"].map((key) => {
              const labels = { name:"Full Name", email:"Email", password:"Password", confirmPassword:"Confirm Password" };
              const type = key.includes("password") ? "password" : key === "email" ? "email" : "text";
              return (
                <div key={key}>
                  <label htmlFor={key} className="mb-2 block text-sm font-medium text-slate-700">{labels[key]}</label>
                  <input id={key} type={type} name={key} value={formData[key]} onChange={(e) => setFormData({ ...formData, [key]: e.target.value })} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-200" />
                  {errors[key] && <p className="mt-1 text-sm text-red-600">{errors[key]}</p>}
                </div>
              );
            })}
            <button disabled={loading} className="w-full rounded-full bg-gradient-to-r from-orange-500 to-amber-500 py-3 font-semibold text-white transition hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70">
              {loading ? "Creating account..." : "Register"}
            </button>
            <p className="text-center text-sm text-slate-600">
              Already have an account? <Link to="/login" className="font-semibold text-orange-600">Login</Link>
            </p>
          </form>
        </div>
      </div>
    </main>
  );
};

export default Register;
