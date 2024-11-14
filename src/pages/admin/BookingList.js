import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  bookingActions,
  approveBooking,
  declineBooking,
} from "../../redux/bookingSlice";
import { Skeleton, Button, message, Pagination, Modal, Input } from "antd";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";

const BookingList = () => {
  const dispatch = useDispatch();
  const { bookings, loading } = useSelector((state) => state.bookings);

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  // State for decline reason and modal visibility
  const [declineReason, setDeclineReason] = useState("");
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [isDeclineModalVisible, setIsDeclineModalVisible] = useState(false);

  useEffect(() => {
    dispatch(bookingActions.fetchBookings());
  }, [dispatch]);

  const handleApprove = (bookingId) => {
    dispatch(approveBooking(bookingId))
      .unwrap()
      .then(() => {
        message.success("Booking approved successfully!");
        dispatch(bookingActions.fetchBookings());
      })
      .catch(() => {
        message.error("Failed to approve booking.");
      });
  };

  const handleDecline = (bookingId) => {
    setSelectedBookingId(bookingId); // Set the booking ID for the decline action
    setIsDeclineModalVisible(true);
    console.log(bookingId); // Show the decline modal
  };

  const confirmDecline = () => {
    if (!declineReason) {
      message.warning("Please provide a reason for declining the booking.");
      return;
    }
    console.log(selectedBookingId);

    dispatch(
      declineBooking({
        bookingId: selectedBookingId,
        reason: declineReason,
      })
    )
      .unwrap()
      .then(() => {
        message.success("Booking declined successfully!");
        setIsDeclineModalVisible(false);
        setDeclineReason(""); // Clear the reason input
        dispatch(bookingActions.fetchBookings());
      })
      .catch(() => {
        message.error("Failed to decline booking.");
      });
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "booked":
        return "bg-green-500";
      case "pending":
        return "bg-yellow-500";
      case "declined":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  // Paginate bookings data
  const paginatedBookings = bookings?.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="w-full bg-slate-200 p-6 pb-20 rounded-lg shadow-md">
      <div className="bg-white rounded-lg p-4">
        <h1 className="text-xl font-semibold mb-4">Manage Booking</h1>
        <div className="bg-gray-200 p-5 rounded-lg">
          {loading ? (
            <Skeleton active className="p-12" />
          ) : (
            <div className="bg-white p-4 rounded-lg overflow-x-auto">
              <table className=" min-w-full">
                <thead>
                  <tr className="text-left">
                    <th className="py-2 px-4 border-r border-b border-gray-300">
                      Name
                    </th>
                    <th className="py-2 px-4 border-r border-b border-gray-300">
                      Date
                    </th>
                    <th className="py-2 px-4 border-r border-b border-gray-300">
                      Time
                    </th>
                    <th className="py-2 px-4 border-r border-b border-gray-300">
                      Hall Name
                    </th>
                    <th className="py-2 px-4 border-r border-b border-gray-300">
                      Remarks
                    </th>
                    <th className="py-2 px-4 border-r border-b border-gray-300">
                      Status
                    </th>
                    <th className="py-2 px-4 border-b border-gray-300">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedBookings?.map((booking) => (
                    <tr key={booking.id} className="hover:bg-gray-50 border-b">
                      <td className="py-2 px-4 border-r border-gray-300">
                        {booking.user.name}
                      </td>
                      <td className="py-2 px-4 border-r border-gray-300">
                        {new Date(booking.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-2 px-4 border-r border-gray-300">
                        From: {booking.start_time}
                        <br />
                        To: {booking.end_time}
                      </td>
                      <td className="py-2 px-4 border-r border-gray-300">
                        {booking.hall_name}
                      </td>
                      <td className="py-2 px-4 border-r border-gray-300">
                        {booking.remarks}
                      </td>
                      <td className="py-2 px-4 border-r border-gray-300">
                        <span
                          className={`text-white px-2 py-1 rounded ${getStatusColor(
                            booking.status
                          )}`}
                        >
                          {booking.status}
                        </span>
                      </td>
                      <td className="py-2 px-4">
                        {/* Show Decline button only if the status is "booked" */}
                        {booking.status === "booked" && (
                          <Button
                            icon={<CloseOutlined />}
                            onClick={() => handleDecline(booking.id)}
                          />
                        )}

                        {/* Show Approve button only if the status is "declined" */}
                        {booking.status === "declined" && (
                          <Button
                            icon={<CheckOutlined />}
                            onClick={() => handleApprove(booking.id)}
                          />
                        )}

                        {/* Show both Approve and Decline buttons if the status is "pending" */}
                        {booking.status === "pending" && (
                          <div className="flex gap-2">
                            <Button
                              icon={<CheckOutlined />}
                              onClick={() => handleApprove(booking.id)}
                            />
                            <Button
                              icon={<CloseOutlined />}
                              onClick={() => handleDecline(booking.id)}
                            />
                          </div>
                        )}

                        {/* Do nothing if the status is "canceled" */}
                        {booking.status === "canceled" && <></>}
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
            total={bookings?.data?.length || 0}
            onChange={handlePageChange}
            className="mt-4 text-center"
          />
        </div>

        {/* Decline Booking Modal */}
        <Modal
          title="Decline Booking"
          visible={isDeclineModalVisible}
          onOk={confirmDecline}
          onCancel={() => setIsDeclineModalVisible(false)}
        >
          <Input.TextArea
            value={declineReason}
            onChange={(e) => setDeclineReason(e.target.value)}
            placeholder="Enter decline reason"
            rows={4}
          />
        </Modal>
      </div>
    </div>
  );
};

export default BookingList;
