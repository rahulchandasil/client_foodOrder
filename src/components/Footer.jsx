import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="mt-16 border-t border-orange-100 bg-white/90 text-slate-700 backdrop-blur dark-surface">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <h3 className="text-2xl font-black text-orange-500">Foodie</h3>
            <p className="mt-3 max-w-sm text-sm leading-6 text-slate-600 dark-text-muted">
              Fresh food ordering made simple, fast, and beautifully organized.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 dark-text">About</h4>
            <ul className="mt-3 space-y-2 text-sm text-slate-600 dark-text-muted">
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/cart">Cart</Link>
              </li>
              <li>
                <Link to="/checkout">Checkout</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 dark-text">Contact</h4>
            <ul className="mt-3 space-y-2 text-sm text-slate-600 dark-text-muted">
              <li>support@foodie.local</li>
              <li>+91 98765 43210</li>
              <li>
                <Link to="/">Privacy Policy</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-orange-100 pt-4 text-center text-sm text-slate-500 dark-text-muted">
          Copyright © 2026 Foodie. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
