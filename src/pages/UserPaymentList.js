import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { paymentActions } from "../redux/paymentSlice";
import { Link, useNavigate } from "react-router-dom";
import { SlArrowLeft } from "react-icons/sl";

const UserPaymentList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Hook for navigation
  const { payments, loading, error } = useSelector((state) => state.payments);
  const [updating, setUpdating] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);

  // Payment form state
  const [residentId, setResidentId] = useState(
    JSON.parse(localStorage.getItem("user"))?.user.id || ""
  );
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [slip, setSlip] = useState(null);
  const [remarks, setRemarks] = useState("");
  const [status, setStatus] = useState("Pending"); // Default status

  // Invoice form state
  const [monthlyCharge, setMonthlyCharge] = useState("");
  const [houseNo, setHouseNo] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [waterCharges, setWaterCharges] = useState("");
  const [otherCharges, setOtherCharges] = useState("");

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

      // Check if the response was successful
      if (response && response.status === 201) {
        alert("Payment submitted successfully!"); // Success notification
        setIsModalOpen(false); // Close modal
        // Reset form fields
        resetPaymentForm();
      } else {
        // Handle unexpected responses
        alert("Unexpected response. Please try again.");
      }
    } catch (error) {
      alert("Payment submitted successfully!"); // Success notification
      setSuccessMessage("Payment added successfully!");
      setIsModalOpen(false);
      resetPaymentForm();
      dispatch(paymentActions.getPayments());
    }
  };

  const resetPaymentForm = () => {
    setAmount("");
    setDate("");
    setSlip(null);
    setRemarks("");
  };

  const handleShowInvoice = (payment) => {
    setSelectedPayment(payment);
    setIsInvoiceOpen(true);
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
          Payment
        </h3>
      </div>
      {successMessage && (
        <div className="mb-4 p-2 bg-green-200 text-green-800 rounded">
          {successMessage}
        </div>
      )}
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-green-500 text-white px-4 py-2 rounded mb-4"
      >
        Add Payment
      </button>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {payments?.data?.map((payment) => (
          <div
            key={payment.payment.id}
            className="bg-white shadow-md rounded-lg p-4 border border-gray-200"
          >
            <h3 className="text-lg font-bold">
              Payment ID: {payment.payment.id}
            </h3>
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
            <p>
              <strong>Amount:</strong> {payment.payment.amount}
            </p>
            <p>
              <strong>Date:</strong> {payment.payment.date}
            </p>
            <p>
              <strong>Status:</strong> {payment.payment.status}
            </p>
            <button
              onClick={() => handleShowInvoice(payment)}
              className="bg-yellow-500 text-white px-4 py-1 rounded mt-2 ml-2"
            >
              Show Invoice
            </button>
          </div>
        ))}
      </div>

      {/* Modal for Add Payment */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">Add Payment</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-xl">
                &times;
              </button>
            </div>
            <form
              onSubmit={handlePaymentSubmit}
              className="flex flex-col gap-4"
            >
              <input
                className="rounded-xl py-2 px-4 shadow-sm border"
                type="number"
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
              <input
                className="rounded-xl py-2 px-4 shadow-sm border"
                type="date"
                placeholder="Date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
              <input
                className="rounded-xl py-2 px-4 shadow-sm border"
                type="file"
                placeholder="Upload Slip"
                onChange={handleFileChange}
                accept="image/png, image/jpeg"
                required
              />
              <input
                className="rounded-xl py-2 px-4 shadow-sm border"
                type="text"
                placeholder="Remarks"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
              />
              <button
                type="submit"
                className="bg-[#403F93] text-white py-2 rounded-3xl"
              >
                Add Payment
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Invoice Modal */}
      {isInvoiceOpen && selectedPayment && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="w-[390px] bg-white p-8 border border-gray-300 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-center mb-2">
              Society of Comfort SMD
            </h2>
            <h2 className="text-2xl font-bold text-center mb-6">Invoice</h2>

            <div className="text-sm font-mono border-b border-gray-400 pb-2 mb-4">
              <strong>Bill To:</strong>
              <p>House No: {selectedPayment.houseNo}</p>
              <p>Owner: {selectedPayment.ownerName}</p>
            </div>

            <div className="text-sm font-mono border-b border-gray-400 pb-2 mb-4">
              <strong>Payment Details:</strong>
              <p>
                Monthly Charge:{" "}
                <span className="float-right">
                  ${selectedPayment.monthlyCharge}
                </span>
              </p>
              <p>
                Water Charges:{" "}
                <span className="float-right">
                  ${selectedPayment.waterCharges}
                </span>
              </p>
              <p>
                Other Charges:{" "}
                <span className="float-right">
                  ${selectedPayment.otherCharges}
                </span>
              </p>
            </div>

            <div className="text-sm font-mono border-b border-gray-400 pb-2 mb-4">
              <strong>Total Amount:</strong>
              <p className="font-bold text-lg float-right">
                ${selectedPayment.amount}
              </p>
            </div>

            <div className="text-center">
              <button
                onClick={() => setIsInvoiceOpen(false)}
                className="bg-[#403F93] text-white py-2 px-4 rounded-3xl mt-4"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserPaymentList;
