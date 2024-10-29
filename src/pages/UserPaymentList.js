import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { paymentActions } from "../redux/paymentSlice";
import { Link } from "react-router-dom";
import { SlArrowLeft } from "react-icons/sl";

const UserPaymentList = () => {
  const dispatch = useDispatch();
  const { payments, loading, error } = useSelector((state) => state.payments);
  const [updating, setUpdating] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Payment form state
  const [residentId, setResidentId] = useState(
    JSON.parse(localStorage.getItem("user"))?.user.id || ""
  );
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [slip, setSlip] = useState(null);
  const [remarks, setRemarks] = useState("");
  const [status, setStatus] = useState("Pending"); // Default status

  useEffect(() => {
    dispatch(paymentActions.getPayments());
  }, [dispatch]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setSlip(e.target.files[0]); // Ensure the file is properly captured
    }
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();

    // Validation to ensure slip is selected
    if (!slip) {
      alert("Please upload a slip file.");
      return;
    }

    // Create a FormData object to handle file uploads
    const formData = new FormData();
    formData.append("resident_id", residentId);
    formData.append("amount", amount);
    formData.append("date", date);
    formData.append("slip", slip); // This will append the file
    formData.append("remarks", remarks);
    formData.append("status", status);

    try {
      const response = await dispatch(paymentActions.addPayment(formData));

      if (response && response.status === 201) {
        alert("Payment submitted successfully!"); // Success notification
        setSuccessMessage("Payment added successfully!");
        resetPaymentForm();
      } else {
        alert("Unexpected response. Please try again.");
      }
    } catch (error) {
      alert("Payment submission failed."); // Failure notification
    }
  };

  const resetPaymentForm = () => {
    setAmount("");
    setDate("");
    setSlip(null);
    setRemarks("");
  };

  if (loading || updating) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="payment-list p-4 bg-slate-200">
      <div className="flex px-6 py-4">
        <div className="items-center my-auto">
          <Link to="/userdash">
            <SlArrowLeft />
          </Link>
        </div>
        <h3 className="font-bold flex justify-center mx-auto text-[22px]">
          Payment Detail
        </h3>
      </div>

      {successMessage && (
        <div className="mb-4 p-2 bg-green-200 text-green-800 rounded">
          {successMessage}
        </div>
      )}

      {/* Add Payment Form */}
      <form
        onSubmit={handlePaymentSubmit}
        className="bg-white p-6 rounded-lg shadow-lg mb-6 flex flex-col gap-2"
      >
        <h3 className="text-xl font-bold mb-4">Add Payment</h3>
        <div>
          <label className="font-bold text-md">Amount</label>
          <input
            className="rounded-md py-3 px-4 w-full border-[2px] border-gray-400 mt-2"
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="font-bold text-md">Date</label>
          <input
            className="rounded-md py-2 px-4 w-full border-[2px] border-gray-400 mt-2"
            type="date"
            placeholder="Date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="font-bold text-md">Screenshot</label>
          <input
            className="rounded-md py-2 px-4 w-full border-[2px] border-gray-400 mt-2"
            type="file"
            placeholder="Upload Slip"
            onChange={handleFileChange}
            accept="image/png, image/jpeg"
            required
          />
        </div>
        <div>
          <label className="font-bold text-md">Remarks</label>
          <textarea
            className="rounded-md py-2 px-4 w-full border-[2px] border-gray-400 mt-2"
            type="text"
            placeholder="Remarks"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="bg-[#403F93] text-white flex px-16 py-3 rounded-lg mt-6"
        >
          Add Payment
        </button>
      </form>

      {/* Payment List */}
      <h1 className="text-xl font-bold mb-4">Payment List</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {payments?.data?.map((payment) => (
          <div
            key={payment.payment.id}
            className="bg-white flex gap-4 shadow-md rounded-lg p-4 border border-gray-200"
          >
            <div className="flex items-center my-2">
              {payment.slip_url ? (
                <img
                  src={payment.slip_url}
                  alt="Payment Slip"
                  className="h-20 w-20 object-cover rounded"
                />
              ) : (
                <span className="text-gray-500">No Image</span>
              )}
            </div>
            <div>
              <h3 className="text-md font-bold">
                Payment ID: {payment.payment.id}
              </h3>

              <p>
                <strong>Amount:</strong> {payment.payment.amount}
              </p>
              <p>
                <strong>Date:</strong> {payment.payment.date}
              </p>
              <p>
                <strong>Status:</strong> {payment.payment.status}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserPaymentList;
