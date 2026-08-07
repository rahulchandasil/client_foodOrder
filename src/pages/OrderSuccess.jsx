import { Link } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";
import Navbar from "../components/Navbar";

const OrderSuccess = () => {
  return (
    <>
      <Navbar />

      <div className="min-h-[80vh] flex items-center justify-center bg-gray-100 px-4">
        <div className="bg-white shadow-xl rounded-2xl p-10 max-w-md w-full text-center">

          <FaCheckCircle
            className="text-green-500 mx-auto mb-6"
            size={80}
          />

          <h1 className="text-3xl font-bold mb-4">
            Order Placed Successfully!
          </h1>

          <p className="text-gray-600 mb-8">
            Thank you for your order. Your delicious food is being prepared and will be delivered soon.
          </p>

          <Link
            to="/"
            className="block w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-semibold transition"
          >
            Continue Shopping
          </Link>

        </div>
      </div>
    </>
  );
};

export default OrderSuccess;