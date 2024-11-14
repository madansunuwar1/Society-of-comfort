import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { paymentActions } from "../../redux/paymentSlice";
import { Skeleton, Button, Modal, Pagination, message, Input } from "antd";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";

const ConfirmPayment = () => {
  const dispatch = useDispatch();
  const { payments, loading } = useSelector((state) => state.payments);

  const [isRejectModalVisible, setIsRejectModalVisible] = useState(false);
  const [selectedPaymentId, setSelectedPaymentId] = useState(null);
  const [rejectedReason, setRejectedReason] = useState("");
  const [imageUrl, setImageUrl] = useState(null);
  const [status, setStatus] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10); // Adjust page size as needed

  useEffect(() => {
    dispatch(paymentActions.getPayments());
  }, [dispatch]);

  const handleConfirmStatus = (paymentId) => {
    const payload = {
      id: paymentId,
      status: "Confirmed",
    };
    dispatch(paymentActions.updatePaymentStatus(payload))
      .unwrap()
      .then(() => {
        message.success("Payment confirmed successfully!");
        dispatch(paymentActions.getPayments());
        setImageUrl(null); // Close the slip modal after confirmation
      })
      .catch(() => {
        message.error("Failed to confirm payment.");
      });
  };

  const handleRejectClick = (paymentId) => {
    setSelectedPaymentId(paymentId);
    setIsRejectModalVisible(true);
  };

  const handleRejectPayment = () => {
    if (selectedPaymentId) {
      const payload = {
        id: selectedPaymentId,
        status: "Rejected",
        rejected_reason: rejectedReason,
      };
      dispatch(paymentActions.updatePaymentStatus(payload))
        .unwrap()
        .then(() => {
          message.success("Payment rejected successfully!");
          setIsRejectModalVisible(false);
          setRejectedReason(""); // Reset rejection reason
          setImageUrl(null); // Close the slip modal after rejection
          dispatch(paymentActions.getPayments());
        })
        .catch(() => {
          message.error("Failed to reject payment.");
        });
    }
  };

  const handleCancelReject = () => {
    setIsRejectModalVisible(false);
    setRejectedReason(""); // Reset rejection reason
  };

  const handleImageClick = (url, paymentId, status) => {
    setImageUrl(url);
    setSelectedPaymentId(paymentId);
    setStatus(status);
  };

  const handleImageModalClose = () => {
    setImageUrl(null);
  };

  // Handle pagination change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Confirmed":
        return "bg-green-500";
      case "Pending":
        return "bg-yellow-500";
      case "Rejected":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  // Paginate payments data
  const paginatedPayments = payments?.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="w-full bg-slate-200 p-6 pb-20 rounded-lg shadow-md">
      <div className="bg-white rounded-lg p-4">
        <h1 className="text-xl font-semibold mb-4">Manage Payment</h1>
        <div className="bg-gray-200 p-5 rounded-lg">
          {loading ? (
            <div className="p-12">
              <Skeleton active />
            </div>
          ) : (
            <div className="bg-white p-4 rounded-lg overflow-x-auto">
              <table className=" min-w-full">
                <thead>
                  <tr className="text-left">
                    <th className="py-2 px-4 border-r border-b border-gray-300">
                      ID
                    </th>
                    <th className="py-2 px-4 border-r border-b border-gray-300">
                      Name
                    </th>
                    <th className="py-2 px-4 border-r border-b border-gray-300">
                      Date
                    </th>
                    <th className="py-2 px-4 border-r border-b border-gray-300">
                      Amount
                    </th>
                    <th className="py-2 px-4 border-r border-b border-gray-300">
                      Status
                    </th>
                    <th className="py-2 px-4 border-r border-b border-gray-300">
                      Slip
                    </th>
                    <th className="py-2 px-4 border-b border-gray-300">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedPayments?.map((payment) => (
                    <tr
                      key={payment.payment.id}
                      className="hover:bg-gray-50 border-b"
                    >
                      <td className="py-2 px-4 border-r border-gray-300">
                        {payment.payment.id}
                      </td>
                      <td className="py-2 px-4 border-r border-gray-300">
                        {payment.user_name}
                      </td>

                      <td className="py-2 px-4 border-r border-gray-300">
                        {payment.payment.date}
                      </td>
                      <td className="py-2 px-4 border-r border-gray-300">
                        Rs.{payment.payment.amount}
                      </td>
                      <td className="py-2 px-4 border-r border-gray-300">
                        <span
                          className={`text-white px-2 py-1 rounded ${getStatusColor(
                            payment.payment.status
                          )}`}
                        >
                          {payment.payment.status}
                        </span>
                      </td>
                      <td className="py-2 px-4 border-r border-gray-300">
                        <img
                          src={payment.slip_url}
                          alt="Slip"
                          onClick={() =>
                            handleImageClick(
                              payment.slip_url,
                              payment.payment.id,
                              payment.payment.status
                            )
                          }
                          className="cursor-pointer h-10 w-10 object-cover"
                        />
                      </td>
                      <td className="py-2 px-4 flex gap-2">
                        {payment.payment.status === "Pending" && (
                          <>
                            <Button
                              type="primary"
                              icon={<CheckOutlined />}
                              onClick={() =>
                                handleConfirmStatus(payment.payment.id)
                              }
                            />
                            <Button
                              danger
                              icon={<CloseOutlined />}
                              onClick={() =>
                                handleRejectClick(payment.payment.id)
                              }
                            />
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {/* Pagination Component */}
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={payments?.length || 0}
            onChange={handlePageChange}
            className="mt-4 text-center"
          />
        </div>

        {/* Modal for Rejection Reason */}
        <Modal
          title="Reject Payment"
          visible={isRejectModalVisible}
          onOk={handleRejectPayment}
          onCancel={handleCancelReject}
        >
          <Input.TextArea
            rows={4}
            value={rejectedReason}
            onChange={(e) => setRejectedReason(e.target.value)}
            placeholder="Enter rejection reason"
          />
        </Modal>

        {/* Modal for Image Preview with Confirm and Reject Buttons */}
        <Modal
          visible={!!imageUrl}
          onCancel={handleImageModalClose}
          footer={
            status === "Pending" && (
              <>
                <Button
                  type="primary"
                  icon={<CheckOutlined />}
                  onClick={() => handleConfirmStatus(selectedPaymentId)}
                />
                <Button
                  danger
                  icon={<CloseOutlined />}
                  onClick={() => handleRejectClick(selectedPaymentId)}
                />
              </>
            )
          }
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

export default ConfirmPayment;
