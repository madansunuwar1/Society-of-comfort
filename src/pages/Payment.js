import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { paymentActions } from "../redux/paymentSlice";
import { Link } from "react-router-dom";
import { SlArrowLeft } from "react-icons/sl";
import { Skeleton } from "antd";

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
    return (
      <div className="p-12">
        <Skeleton active />
      </div>
    );
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

        <div className="flex justify-center bg-gray-200 w-full py-5">
          <div className="w-[390px] bg-white p-4 border border-gray-300 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-center mb-2">
              Society of comfort SMD
            </h2>
            <h2 className="text-2xl font-bold text-center mb-6">
              {" "}
              This Month Invoice
            </h2>

            <div className="text-sm font-mono border-b border-gray-400 pb-2 mb-4">
              <strong>Bill To:</strong>
              <p>House No: 20</p>
              <p>Owner: ramesh</p>
            </div>

            <div className="text-sm font-mono border-b border-gray-400 pb-2 mb-4">
              <strong>Payment Details:</strong>
              <p>
                Monthly Charge: <span className="float-right">$ 2000</span>
              </p>
              <p>
                Water Charges: <span className="float-right">$ 24323</span>
              </p>
              <p>
                Other Charges: <span className="float-right">$ 44545</span>
              </p>
            </div>

            <div className="text-sm font-mono border-b border-gray-400 pb-2 mb-4">
              <p>
                <strong>Total Amount: </strong>{" "}
                <span className="float-right">$ 345345345</span>
              </p>
            </div>

            <div className="text-sm font-mono border-b border-gray-400 pb-2 mb-4">
              <p>
                <strong>Payment Date:</strong> 2024-31-2
              </p>
            </div>

            <div className="text-sm font-mono mb-4">
              <strong>Remarks:</strong>
              <p>{"ok" || "No remarks"}</p>
            </div>

            <div className="text-center text-xs font-mono border-t pt-4 mt-4">
              <p>Thank you for your payment!</p>
              <p>Payment slip attached for verification.</p>
            </div>
          </div>
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
