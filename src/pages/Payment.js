import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { paymentActions } from "../redux/paymentSlice";
import { Link } from "react-router-dom";
import { SlArrowLeft } from "react-icons/sl";

const Payment = () => {
  const dispatch = useDispatch();

  // Accessing payments and loading state from Redux store
  const { payments, loading, error } = useSelector((state) => state.payments);

  useEffect(() => {
    // Dispatch the getPayments action when the component mounts
    dispatch(paymentActions.getPayments());
  }, [dispatch]);

  // Render loading, error, or payment list
  if (loading) {
    return <div className="text-center text-white">Loading...</div>;
  }

  // Function to determine the status color using Tailwind CSS classes
  const getStatusColor = (status) => {
    switch (status) {
      case "Confirmed":
        return "bg-green-500"; // Green for paid
      case "Pending":
        return "bg-yellow-500"; // Yellow for pending
      default:
        return "bg-gray-500"; // Gray for unknown status
    }
  };

  return (
    <div className="flex justify-center bg-slate-800 w-full ">
      <div className="w-[390px] bg-slate-200 p-6 pb-20 rounded-lg shadow-md">
        <div className="flex items-center mb-4">
          <Link to="/userdash" className="text-gray-500 hover:text-gray-700">
            <SlArrowLeft />
          </Link>
          <h3 className="font-bold flex justify-center mx-auto text-lg">
            Payment
          </h3>
        </div>
        <h1 className="text-xl font-semibold mb-4">Payment List</h1>
        <div className="grid grid-cols-1 gap-4">
          {payments?.data?.map((payment) => (
            <div
              key={payment.payment.id}
              className="flex flex-col border border-gray-300 bg-white p-4 rounded-lg shadow-md transition-transform hover:scale-105"
            >
              <div className="flex justify-between">
                <h2 className="font-bold">ID: {payment.payment.id}</h2>
                <h2 className="font-bold">Date: {payment.payment.date}</h2>
                <span
                  className={`text-white px-2 py-1 rounded ${getStatusColor(
                    payment.payment.status
                  )}`}
                >
                  {payment.payment.status}
                </span>
              </div>
              <p className="mt-2">Amount: ${payment.payment.amount}</p>
              {payment.slip_url ? (
                <img
                  src={payment.slip_url}
                  alt="Payment Slip"
                  className="h-20 w-20 object-cover rounded pt-2"
                />
              ) : (
                <span className="text-gray-500">No Image</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Payment;
