import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { paymentActions } from "../redux/paymentSlice";
import { Link } from "react-router-dom";
import { SlArrowLeft } from "react-icons/sl";
import { Skeleton, Button, Modal, Select, Pagination, message } from "antd";

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
  const [errors, setErrors] = useState({}); // To store validation errors
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [imageUrl, setImageUrl] = useState(null);

  const handleImageModalClose = () => {
    setImageUrl(null);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleImageClick = (url) => {
    setImageUrl(url);
  };

  const paginatedPayments = payments?.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  useEffect(() => {
    dispatch(paymentActions.getPayments());
  }, [dispatch]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setSlip(e.target.files[0]); // Ensure the file is properly captured
    }
  };

  const validateForm = () => {
    const newErrors = {};
    // Validate amount
    if (!amount) {
      newErrors.amount = "Amount is required.";
    } else if (isNaN(amount) || amount <= 0) {
      newErrors.amount = "Amount must be a positive number.";
    }

    // Validate date
    if (!date) {
      newErrors.date = "Date is required.";
    } else if (new Date(date) < new Date()) {
      newErrors.date = "Date cannot be in the past.";
    }

    // Validate slip
    if (!slip) {
      newErrors.slip = "Please upload a slip file.";
    } else if (!["image/png", "image/jpeg"].includes(slip.type)) {
      newErrors.slip = "File type must be PNG or JPEG.";
    }

    if (!remarks) {
      newErrors.remarks = "please eneter your remark for payment";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();

    // Reset errors
    setErrors({});

    // Validate form fields
    if (!validateForm()) {
      return; // If validation fails, exit early
    }

    // Create a FormData object to handle file uploads
    const formData = new FormData();
    formData.append("resident_id", residentId);
    formData.append("amount", amount);
    formData.append("date", date);
    formData.append("slip", slip); // This will append the file
    formData.append("remarks", remarks);
    formData.append("status", status);

    const response = await dispatch(paymentActions.addPayment(formData));

    // Check for errors explicitly from the response
    if (paymentActions.addPayment.fulfilled.match(response)) {
      alert("Payment submitted successfully");
      setSuccessMessage("Payment added successfully!");
      resetPaymentForm();
    } else {
      alert(
        "There was an error",
        response.payload || "Unexpected error. Please try again."
      );
    }
  };

  const resetPaymentForm = () => {
    setAmount("");
    setDate("");
    setSlip(null);
    setRemarks("");
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Confirmed":
        return "bg-green-500";
      case "Pending":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  if (loading) return <div>Loading...</div>;
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
            type="text"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
          {errors.amount && <p className="text-red-500">{errors.amount}</p>}
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
          {errors.date && <p className="text-red-500">{errors.date}</p>}
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
          {errors.slip && <p className="text-red-500">{errors.slip}</p>}
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
          {errors.remarks && <p className="text-red-500">{errors.remarks}</p>}
        </div>
        <button
          type="submit"
          className="bg-[#403F93] text-white flex px-16 py-3 rounded-lg mt-6"
          disabled={updating}
        >
          {updating ? "Adding..." : "Add Payment"}
        </button>
      </form>

      {/* Payment List */}
      <div className="w-full bg-slate-200 p-6 pb-20 rounded-lg shadow-md">
        <h1 className="text-xl font-semibold mb-4">Payment List</h1>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border border-gray-300">ID</th>
                <th className="py-2 px-4 border border-gray-300">Date</th>
                <th className="py-2 px-4 border border-gray-300">Amount</th>
                <th className="py-2 px-4 border border-gray-300">Status</th>
                <th className="py-2 px-4 border border-gray-300">Slip</th>
              </tr>
            </thead>
            <tbody>
              {paginatedPayments?.map((payment) => (
                <tr key={payment.payment.id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border border-gray-300">
                    {payment.payment.id}
                  </td>
                  <td className="py-2 px-4 border border-gray-300">
                    {payment.payment.date}
                  </td>
                  <td className="py-2 px-4 border border-gray-300">
                    Rs.{payment.payment.amount}
                  </td>
                  <td className="py-2 px-4 border border-gray-300">
                    <span
                      className={`text-white px-2 py-1 rounded ${getStatusColor(
                        payment.payment.status
                      )}`}
                    >
                      {payment.payment.status}
                    </span>
                  </td>
                  <td className="py-2 px-4 border border-gray-300">
                    <img
                      src={payment.slip_url}
                      alt="Slip"
                      onClick={() => handleImageClick(payment.slip_url)}
                      className="cursor-pointer h-10 w-10 object-cover"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Component */}
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={payments?.data?.length || 0}
          onChange={handlePageChange}
          className="mt-4 text-center"
        />

        {/* Modal for Image Preview */}
        <Modal
          visible={!!imageUrl}
          onCancel={handleImageModalClose}
          footer={null}
          centered
        >
          {imageUrl && (
            <img src={imageUrl} alt="Slip Preview" className="w-full" />
          )}
        </Modal>
      </div>
    </div>
  );
};

export default UserPaymentList;
