import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  bookingActions,
  approveBooking,
  declineBooking,
} from "../../redux/bookingSlice";
import { Skeleton, Button, message, Pagination } from "antd";

const BookingList = () => {
  const dispatch = useDispatch();
  const { bookings, loading } = useSelector((state) => state.bookings);

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10); // Adjust page size as needed

  useEffect(() => {
    dispatch(bookingActions.fetchBookings());
  }, [dispatch]);

  const handleApprove = (bookingId) => {
    dispatch(approveBooking(bookingId))
      .unwrap()
      .then(() => {
        message.success("Booking approved successfully!");
        // Optionally refetch the bookings if needed
        dispatch(bookingActions.fetchBookings());
      })
      .catch(() => {
        message.error("Failed to approve booking."); // Error message only in case of failure
      });
  };

  const handleDecline = (bookingId) => {
    dispatch(declineBooking(bookingId))
      .unwrap()
      .then(() => {
        message.success("Booking declined successfully!");
        // Optionally refetch the bookings if needed
        dispatch(bookingActions.fetchBookings());
      })
      .catch(() => {
        message.error("Failed to decline booking."); // Error message only in case of failure
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

  if (loading) {
    return <Skeleton active className="p-12" />;
  }

  // Paginate bookings data
  const paginatedBookings = bookings?.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="w-full bg-slate-200 p-6 pb-20 rounded-lg shadow-md">
      <h1 className="text-xl font-semibold mb-4">Booking List</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border border-gray-300">Name</th>
              <th className="py-2 px-4 border border-gray-300">Date</th>
              <th className="py-2 px-4 border border-gray-300">Time</th>
              <th className="py-2 px-4 border border-gray-300">Hall Name</th>
              <th className="py-2 px-4 border border-gray-300">Remarks</th>
              <th className="py-2 px-4 border border-gray-300">Status</th>
              <th className="py-2 px-4 border border-gray-300">Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedBookings?.map((booking) => (
              <tr key={booking.id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border border-gray-300">
                  {booking.user.name}
                </td>
                <td className="py-2 px-4 border border-gray-300">
                  {new Date(booking.created_at).toLocaleDateString()}
                </td>
                <td className="py-2 px-4 border border-gray-300">
                  From: {booking.start_time}
                  <br />
                  To: {booking.end_time}
                </td>
                <td className="py-2 px-4 border border-gray-300">
                  {booking.hall_name}
                </td>
                <td className="py-2 px-4 border border-gray-300">
                  {booking.remarks}
                </td>
                <td className="py-2 px-4 border border-gray-300">
                  <span
                    className={`text-white px-2 py-1 rounded ${getStatusColor(
                      booking.status
                    )}`}
                  >
                    {booking.status}
                  </span>
                </td>
                <td className="py-2 px-4 border border-gray-300">
                  {booking.status !== "booked" && (
                    <>
                      <Button
                        onClick={() => handleApprove(booking.id)}
                        className="mr-2"
                      >
                        Approve
                      </Button>
                      <Button onClick={() => handleDecline(booking.id)}>
                        Decline
                      </Button>
                    </>
                  )}
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
        total={bookings?.data?.length || 0}
        onChange={handlePageChange}
        className="mt-4 text-center"
      />
    </div>
  );
};

export default BookingList;
