import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { paymentActions } from "../redux/paymentSlice";
import { Link } from "react-router-dom";
import { SlArrowLeft } from "react-icons/sl";
import { NepaliDatePicker } from "nepali-datepicker-reactjs";
import "nepali-datepicker-reactjs/dist/index.css";

const AddPayment = () => {
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
  const [status, setStatus] = useState("Pending");
  const [remarks, setRemarks] = useState(""); // Default status
  const [errors, setErrors] = useState({}); // To store validation errors

  const handleDateChange = (date) => {
    setDate(date);
  };

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

  if (loading) return <div>Loading...</div>;

  return (
    <div className="payment-list p-4 bg-slate-200">
      <div className="flex px-6 py-4">
        <div className="items-center my-auto">
          <Link to="/payment">
            <SlArrowLeft />
          </Link>
        </div>
        <h3 className="font-bold flex justify-center mx-auto text-[22px]">
          Add Payment
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
          <NepaliDatePicker
            options={{ calenderLocale: "en", valueLocale: "en" }}
            value={date}
            onChange={handleDateChange}
            className="w-full custom-date-picker"
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
    </div>
  );
};

export default AddPayment;
