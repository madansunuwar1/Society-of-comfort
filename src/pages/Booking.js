import React, { useEffect, useState } from "react";
import { SlArrowLeft } from "react-icons/sl";
import { Link, useNavigate } from "react-router-dom";
import Select from "react-select";
import { useDispatch, useSelector } from "react-redux";
import {
  addBooking,
  bookingActions,
  cancelMyBooking,
} from "../redux/bookingSlice";

const Booking = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { bookings, loading } = useSelector((state) => state.bookings);
  const [hallName, setHallName] = useState(null);
  const [bookingDate, setBookingDate] = useState("2020-12-13"); // Default date for testing
  const [remarks, setRemarks] = useState("for birthday"); // Default remarks for testing
  const [startTime, setStartTime] = useState("15:30"); // Default start time
  const [endTime, setEndTime] = useState("16:01"); // Default end time

  const options = [
    { value: "Hall A", label: "Hall A", available: true },
    { value: "Hall B", label: "Hall B", available: true },
    { value: "Hall C", label: "Hall C", available: false },
  ];

  useEffect(() => {
    dispatch(bookingActions.fetchBookings());
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission
    if (!hallName) {
      alert("Please select a hall.");
      return;
    }

    const bookingData = {
      hall_name: hallName.value,
      booking_date: bookingDate,
      remarks,
      start_time: startTime,
      end_time: endTime,
    };

    // Dispatch the addBooking action
    dispatch(addBooking(bookingData))
      .unwrap()
      .then(() => {
        alert("Booking successful! Your booking has been confirmed.");
        navigate("/userdash");
      })
      .catch((error) => {
        alert("Booking failed: " + error);
      });
  };

  const handleCancel = (bookingId) => {
    // Dispatch the cancelMyBooking action with bookingId
    dispatch(cancelMyBooking(bookingId))
      .unwrap()
      .then(() => {
        alert("Booking canceled successfully.");
        dispatch(bookingActions.fetchBookings()); // Refresh bookings list after cancellation
      })
      .catch((error) => {
        alert("Booking canceled successfully.");
        dispatch(bookingActions.fetchBookings());
      });
  };

  const formatOptionLabel = ({ label, available }) => (
    <div className="flex justify-between">
      <span>{label}</span>
      <span style={{ color: available ? "green" : "red" }}>
        {available ? "Available" : "Unavailable"}
      </span>
    </div>
  );

  return (
    <div className=" bg-white pb-20">
      <div className="flex px-6 py-4">
        <div className="items-center my-auto">
          <Link to="/userdash">
            <SlArrowLeft />
          </Link>
        </div>
        <h3 className="font-bold flex justify-center mx-auto text-[22px]">
          Booking
        </h3>
      </div>
      <div className="bg-slate-200 px-6 py-6">
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <div>
            <label htmlFor="hall_name">Choose Your Hall</label>
            <Select
              id="hall_name"
              name="hall_name"
              options={options.map((option) => ({
                ...option,
                isDisabled: !option.available,
              }))}
              value={hallName}
              onChange={setHallName}
              formatOptionLabel={formatOptionLabel}
              className="mt-2"
            />
          </div>
          <div className="">
            <label htmlFor="booking_date" className="font-bold text-md">
              Booking Date
            </label>
            <input
              className="rounded-md w-full py-2 px-4 border-[2px] border-gray-400 mt-2"
              type="date"
              id="booking_date"
              name="booking_date"
              value={bookingDate}
              onChange={(e) => setBookingDate(e.target.value)}
            />
          </div>
          <div className="">
            <label htmlFor="remarks" className="font-bold text-md">
              Remarks
            </label>
            <input
              className="rounded-md w-full py-2 px-4 border-[2px] border-gray-400 mt-2"
              type="text"
              id="remarks"
              name="remarks"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
            />
          </div>
          <h1 className="font-bold text-md">Start Time</h1>
          <div className="">
            <input
              className="rounded-md w-full py-2 px-4 border-[2px] border-gray-400 mt-2"
              type="time"
              id="start_time"
              name="start_time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
          </div>
          <h1 className="font-bold text-md">End Time</h1>
          <div className="">
            <input
              className="rounded-md w-full py-2 px-4 border-[2px] border-gray-400 mt-2"
              type="time"
              id="end_time"
              name="end_time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="bg-[#403F93] text-white flex px-16 py-3 rounded-lg mt-6"
          >
            <span className="mx-auto">Book</span>
          </button>
        </form>
        <div>
          <h1 className="text-xl font-bold mb-4 mt-8">Booking List</h1>
          <div className="flex gap-4 md:flex-wrap flex-col">
            {bookings?.data?.map((book) => (
              <div
                key={book.id}
                className="bg-white flex gap-4 shadow-md rounded-lg p-4 border border-gray-200"
              >
                <div>
                  <h3 className="text-md font-bold">
                    Hall Name: {book.hall_name}
                  </h3>

                  <p>
                    <strong>remarks:</strong> {book.remarks}
                  </p>
                  <p>
                    <strong>Date:</strong>{" "}
                    {new Date(book.created_at).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Status:</strong> {book.status}
                  </p>
                  <button
                    onClick={() => handleCancel(book.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg mt-2"
                  >
                    Cancel Booking
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;
