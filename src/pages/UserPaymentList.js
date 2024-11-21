import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { paymentActions } from "../redux/paymentSlice";
import { Link } from "react-router-dom";
import { SlArrowLeft } from "react-icons/sl";
import { Skeleton, Button, Modal, Pagination, message, Card } from "antd";
import { Row, Col } from "antd";

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
      newErrors.remarks = "Please enter your remark for payment";
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

  return (
    <div className="payment-list md:p-4 bg-slate-200">
      <div className="flex  font-roboto  px-4 py-2 bg-[#3F3F95] rounded-b-lg">
        <div className="items-center my-auto">
          <Link to="/userdash">
            <SlArrowLeft className="text-white" />
          </Link>
        </div>
        <h3 className="font-bold flex justify-center mx-auto text-[22px] text-white">
          Payments
        </h3>
      </div>

      {/* Payment List in Cards */}
      <div className=" bg-slate-200 p-4 md:p-6 pb-20 rounded-lg shadow-md">
        <Row gutter={16}>
          {paginatedPayments?.map((payment) => (
            <Col
              key={payment.payment.id}
              xs={24} // Full width on mobile
              sm={12} // Half width on small screens (tablet)
              md={8} // Third width on medium screens (desktop)
              lg={6} // Quarter width on large screens (desktop)
              className="mb-4"
            >
              <Card
                title={`Payment ID: ${payment.payment.id}`}
                bordered={false}
                className="shadow-md"
                extra={
                  <span
                    className={`text-white px-2 py-1 rounded ${getStatusColor(
                      payment.payment.status
                    )}`}
                  >
                    {payment.payment.status}
                  </span>
                }
              >
                <p>Date: {payment.payment.date}</p>
                <p>Amount: Rs.{payment.payment.amount}</p>
                <div className="flex justify-center">
                  <img
                    src={payment.slip_url}
                    alt="Slip"
                    onClick={() => handleImageClick(payment.slip_url)}
                    className="cursor-pointer h-20 w-20 object-cover"
                  />
                </div>
              </Card>
            </Col>
          ))}
        </Row>

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
