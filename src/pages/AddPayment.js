import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { paymentActions } from "../redux/paymentSlice";
import { invoiceActions } from "../redux/invoiceSlice";
import { Link } from "react-router-dom";
import { SlArrowLeft } from "react-icons/sl";
import { NepaliDatePicker } from "nepali-datepicker-reactjs";
import "nepali-datepicker-reactjs/dist/index.css";
import api from "../utils/api";
import { ADToBS } from "bikram-sambat-js";
import { Button, notification } from "antd";
import { DownloadOutlined, FileImageOutlined } from "@ant-design/icons";
import SyncLoader from "react-spinners/SyncLoader";
import { MdOutlineSpeakerNotes } from "react-icons/md";

const AddPayment = () => {
  const dispatch = useDispatch();
  const user = JSON.parse(localStorage.getItem("user"));
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
  const [dueAmount, setDueAmount] = useState(null);
  const fileInputRef = useRef(null);
  const [isInvoice, setIsInvoice] = useState(true);
  const [slipPreview, setSlipPreview] = useState(null);
  const {
    invoices,
    loading: invoiceLoading,
    error: invoiceError,
  } = useSelector((state) => state.invoices);
  const {
    payments,
    loading: paymentLoading,
    error: paymentError,
  } = useSelector((state) => state.payments);

  const handleDateChange = (date) => {
    setDate(date);
  };

  useEffect(() => {
    if (isInvoice) {
      // Fetch invoice data
      dispatch(invoiceActions.getInvoices());
    } else {
      // Fetch payment data
      dispatch(paymentActions.getPayments());
    }
  }, [isInvoice, dispatch]);

  const handleInvoiceClick = () => {
    setIsInvoice(true);
  };

  const handlePaymentClick = () => {
    setIsInvoice(false);
  };

  useEffect(() => {
    try {
      const today = new Date();
      console.log(today);
      const nepaliDate = ADToBS(today);
      setDate(nepaliDate);
    } catch (error) {
      console.error("Error converting AD to BS:", error);
    }
  }, []);

  useEffect(() => {
    api
      .get("/houses")
      .then((response) => {
        const fetchedHouses = response.data.data;
        const userHouse = fetchedHouses.find(
          (house) => Number(house.id) === user.user.house_id
        );
        if (userHouse) {
          setDueAmount(userHouse.dues);
          if (!amount) {
            setAmount(userHouse.dues);
          }
        }
      })
      .catch((error) => {
        console.error("Error fetching houses:", error);
      });
  }, [user.user.house_id]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSlip(file);
      setSlipPreview(URL.createObjectURL(file)); // Ensure the file is properly captured
    }
    console.log("slip", slip);
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

    dispatch(paymentActions.addPayment(formData))
      .unwrap()
      .then(() => {
        notification.success({
          message: "sucess",
          description: "Payment submitted sucessfully",
        });
      })
      .catch((err) => {
        notification.error({
          message: "Error",
          description: err?.error || "Failed to add payment",
        });
      });
  };

  const resetPaymentForm = () => {
    setAmount("");
    setDate("");
    setSlip(null);
    setRemarks("");
    setRemarks("");
  };

  const triggerFileInput = () => {
    fileInputRef.current.click(); // This triggers the file input click event
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Confirmed":
        return "text-green-500"; // Green for Completed
      case "Pending":
        return "text-yellow-500"; // Yellow for Pending
      case "Rejected":
        return "text-red-500"; // Red for Rejected
      default:
        return "gray-300"; // Default color
    }
  };

  return (
    <div className="payment-list bg-[#F5F5F5]">
      <div className="flex justify-between bg-[#3F3F95] px-4 py-2 w-full rounded-b-lg">
        <div className="items-center my-auto">
          <Link to="/userdash">
            <SlArrowLeft className="text-white" />
          </Link>
        </div>
        <h3 className="font-bold flex justify-center mx-auto text-[22px] text-white">
          Add Payment
        </h3>
      </div>

      {successMessage && (
        <div className="mb-4 p-2 bg-green-200 text-green-800 rounded">
          {successMessage}
        </div>
      )}

      {/* Add Payment Form */}
      <div className="p-2">
        <form
          onSubmit={handlePaymentSubmit}
          className="bg-white p-6 rounded-lg shadow-lg mb-6 flex flex-col gap-2"
        >
          <p className="text-sm font-semibold">
            Total Due : <span>Rs {dueAmount}</span>
          </p>
          <div>
            <input
              className="rounded-md px-4 py-1 w-full border-[1px] border-gray-400 mt-2"
              type="text"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
            {errors.amount && <p className="text-red-500">{errors.amount}</p>}
          </div>
          <div>
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
            <div>
              <div className="rounded-md pl-4 pr-1 py-1 w-full border-[1px] border-gray-400 mt-2 flex justify-between">
                {!slip ? (
                  <p className="my-auto text-gray-400">Payment screenshot</p>
                ) : (
                  <p className="my-auto text-gray-400 overflow-hidden">
                    {slip?.name}
                  </p>
                )}
                <Button
                  onClick={triggerFileInput}
                  className="bg-[#FEA733] text-white px-4 py-2 rounded-md"
                  icon={<FileImageOutlined />}
                >
                  Upload
                </Button>
              </div>
              <input
                ref={fileInputRef}
                className="rounded-md w-full border-[1px] border-gray-400 mt-2 cursor-pointer"
                type="file"
                onChange={handleFileChange}
                accept="image/png, image/jpeg"
                required
                style={{ display: "none" }} // Hide the file input
              />
              {slipPreview && (
                <div className="mt-4 rounded-md">
                  <img
                    src={slipPreview}
                    alt="Preview"
                    className="w-full h-auto rounded-md border border-gray-300 mx-auto"
                  />
                </div>
              )}
            </div>
            {errors.slip && <p className="text-red-500">{errors.slip}</p>}
          </div>
          <div>
            <textarea
              className="rounded-md py-2 px-4 w-full border-[1px] border-gray-400 mt-2"
              type="text"
              placeholder="Remarks"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
            />
            {errors.remarks && <p className="text-red-500">{errors.remarks}</p>}
          </div>
          <button
            type="submit"
            className="bg-[#3F3F95] text-white flex justify-center w-full py-2 rounded-lg mt-2"
            disabled={updating}
          >
            {updating ? "Sending..." : "Send Payment"}
          </button>
        </form>
      </div>
      <div className="flex justify-between mb-8">
        {" "}
        <button
          className="font-bold flex justify-center flex-col mx-auto text-[22px] text-black"
          onClick={handleInvoiceClick}
        >
          Invoice List
          {isInvoice && <span className="bg-[#403F93] h-1 w-32"></span>}
        </button>
        <button
          className="font-bold flex justify-center flex-col mx-auto text-[22px] text-black"
          onClick={handlePaymentClick}
        >
          Payment List
          {!isInvoice && <span className="bg-[#403F93] h-1 w-32"></span>}
        </button>
      </div>
      {invoiceLoading || paymentLoading ? (
        <div className="flex justify-center mt-8 align-middle items-center">
          <SyncLoader
            color="#3F3F95"
            loading={invoiceLoading || paymentLoading}
            size={15}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-4 mt-4 mx-4">
            {isInvoice &&
              invoices.map((invoice) => (
                <Link
                  to={`/invoice-detail/${invoice.id}`}
                  key={invoice.id}
                  className="flex flex-col border border-gray-300 bg-white p-4 rounded-lg shadow-md"
                >
                  <div className="">
                    <p className="text-sm">
                      Date {new Date(invoice.created_at).toLocaleDateString()}
                    </p>
                    <p className="text-sm">
                      Invoice for month:{" "}
                      <span className="">{invoice.month}</span>
                    </p>
                  </div>
                  <div className="h-[1px] w-full bg-gray-600" />
                  <div className="my-2">
                    {invoice.invoice_items.map((item) => (
                      <div className="flex justify-between text-sm my-1">
                        <p>{item.particular}</p>
                        <p>Rs. {item.total}</p>
                      </div>
                    ))}
                  </div>
                  <div className="h-[1px] w-full bg-gray-600 " />
                  <div className="flex justify-between text-sm">
                    <p className="">Total</p>
                    <p className="">{invoice.total_amount}</p>
                  </div>
                  <div className="mt-4">
                    <Button
                      className="bg-[#19891A] text-md text-white w-full text-center"
                      icon={<DownloadOutlined />}
                      style={{
                        padding: "10px 0px",
                      }}
                    >
                      Download invoice
                    </Button>
                  </div>
                </Link>
              ))}

            {!isInvoice &&
              payments.map((payment) => (
                <Link
                  to={`/payment-detail/${payment.payment.id}`}
                  key={payment.id}
                  className="flex flex-col border border-gray-300 bg-white p-4 rounded-lg shadow-md text-sm"
                >
                  <div className="flex justify-between">
                    <p>Id</p>
                    <p>{payment.payment.id}</p>
                  </div>
                  <div className="flex justify-between">
                    <p>Date</p>
                    <p>{payment.payment.date}</p>
                  </div>
                  <div className="flex justify-between">
                    <p>Paid Amount</p>
                    <p>{payment.payment.amount}</p>
                  </div>
                  <div className="h-[1px] w-full bg-gray-600" />
                  <div className="flex justify-between">
                    <p className="">Status</p>
                    <p className={`${getStatusColor(payment.payment.status)}`}>
                      {payment.payment.status}
                    </p>
                  </div>
                  {payment.payment.status === "Rejected" && (
                    <div className="">
                      <p className="">Rejected reason</p>
                      <p className="">{payment.payment.rejected_reason}</p>
                    </div>
                  )}
                  {payment.payment.status === "Pending" && (
                    <div className="mt-4">
                      <Link to={`/editpayment/${payment.payment.id}`}>
                        <Button
                          className="bg-[#19891A] text-md text-white w-full text-center"
                          style={{
                            padding: "10px 0px",
                          }}
                        >
                          Edit payment
                        </Button>
                      </Link>
                    </div>
                  )}
                </Link>
              ))}
          </div>
        </>
      )}
    </div>
  );
};

export default AddPayment;
