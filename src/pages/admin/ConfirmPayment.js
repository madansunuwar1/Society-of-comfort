import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { paymentActions } from "../../redux/paymentSlice";
import {
  Skeleton,
  Button,
  Modal,
  Select,
  Pagination,
  message,
  Input,
} from "antd";

const ConfirmPayment = () => {
  const dispatch = useDispatch();
  const { payments, loading } = useSelector((state) => state.payments);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedPaymentId, setSelectedPaymentId] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [rejectedReason, setRejectedReason] = useState(""); // For rejected reason
  const [imageUrl, setImageUrl] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10); // Adjust page size as needed

  useEffect(() => {
    dispatch(paymentActions.getPayments());
  }, [dispatch]);

  const handleUpdateStatus = (paymentId, currentstatus) => {
    setSelectedPaymentId(paymentId);
    setNewStatus(currentstatus);
    console.log();
    setIsModalVisible(true);
  };

  const handleConfirmUpdate = () => {
    if (selectedPaymentId) {
      const payload = {
        id: selectedPaymentId,
        status: newStatus,
      };
      if (newStatus === "Rejected") {
        payload.rejected_reason = rejectedReason;
      }

      dispatch(paymentActions.updatePaymentStatus(payload))
        .unwrap()
        .then(() => {
          message.success("Payment status updated successfully!");
          setIsModalVisible(false);
          setNewStatus("");
          setRejectedReason(""); // Reset rejected reason
          dispatch(paymentActions.getPayments());
        })
        .catch(() => {
          message.error("Failed to update payment status.");
        });
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setNewStatus("");
    setRejectedReason(""); // Reset rejected reason
  };

  const handleImageClick = (url) => {
    setImageUrl(url);
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
        return "bg-red-500"; // Color for rejected status
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
      <h1 className="text-xl font-semibold mb-4">Payment List</h1>
      <div className="overflow-x-auto">
        {loading ? (
          <div className="p-12">
            <Skeleton active />
          </div>
        ) : (
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border border-gray-300">ID</th>
                <th className="py-2 px-4 border border-gray-300">Date</th>
                <th className="py-2 px-4 border border-gray-300">Amount</th>
                <th className="py-2 px-4 border border-gray-300">Status</th>
                <th className="py-2 px-4 border border-gray-300">Slip</th>
                <th className="py-2 px-4 border border-gray-300">Action</th>
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
                  <td className="py-2 px-4 border border-gray-300">
                    {payment.payment.status === "Confirmed" ? (
                      <></>
                    ) : (
                      <Button
                        onClick={() =>
                          handleUpdateStatus(
                            payment.payment.id,
                            payment.payment.status
                          )
                        }
                      >
                        Update Status
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination Component */}
      <Pagination
        current={currentPage}
        pageSize={pageSize}
        total={payments?.data?.length || 0}
        onChange={handlePageChange}
        className="mt-4 text-center"
      />

      {/* Modal for Updating Status */}
      <Modal
        title="Update Payment Status"
        visible={isModalVisible}
        onOk={handleConfirmUpdate}
        onCancel={handleCancel}
      >
        <Select
          value={newStatus}
          onChange={setNewStatus}
          className="w-full mb-4"
        >
          <Select.Option value="Pending">Pending</Select.Option>
          <Select.Option value="Confirmed">Confirmed</Select.Option>
          <Select.Option value="Rejected">Rejected</Select.Option>
        </Select>

        {newStatus === "Rejected" && (
          <div>
            <Input.TextArea
              rows={4}
              value={rejectedReason}
              onChange={(e) => setRejectedReason(e.target.value)}
              placeholder="Enter rejection reason"
            />
          </div>
        )}
      </Modal>

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
  );
};

export default ConfirmPayment;
