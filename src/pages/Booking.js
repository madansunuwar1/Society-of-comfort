import React, { useEffect, useState } from "react";
import { SlArrowLeft } from "react-icons/sl";
import { Link, useNavigate } from "react-router-dom";
import Select from "react-select";
import { useDispatch, useSelector } from "react-redux";
import {
  addBooking,
  bookingActions,
  cancelMyBooking,
  myBookings,
} from "../redux/bookingSlice";
import { notification } from "antd";

const Booking = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { bookings, loading, error } = useSelector((state) => state.bookings);
  const [hallName, setHallName] = useState(null);
  const [bookingDate, setBookingDate] = useState(""); // Default date for testing
  const [remarks, setRemarks] = useState(""); // Default remarks for testing
  const [startTime, setStartTime] = useState(""); // Default start time
  const [endTime, setEndTime] = useState(""); // Default end time
  const [submitError, setSubmitError] = useState(null); // Local state for submission errors
  const [cancelError, setCancelError] = useState(null); // Local state for cancellation errors

  const options = [
    { value: "Hall A", label: "Hall A", available: true },
    { value: "Hall B", label: "Hall B", available: true },
    { value: "Hall C", label: "Hall C", available: false },
  ];

  useEffect(() => {
    dispatch(myBookings());
  }, [dispatch]);

  const validateForm = () => {
    const newErrors = {};

    // Validate hall selection
    if (!hallName) {
      newErrors.hallName = "Please select a hall.";
    }

    // Validate booking date
    if (!bookingDate) {
      newErrors.bookingDate = "Booking date is required.";
    } else if (new Date(bookingDate) < new Date()) {
      newErrors.bookingDate = "Booking date cannot be in the past.";
    }

    // Validate start and end time
    if (!startTime) {
      newErrors.startTime = "Start time is required.";
    }
    if (!endTime) {
      newErrors.endTime = "End time is required.";
    } else if (
      new Date(`1970-01-01T${endTime}`) <= new Date(`1970-01-01T${startTime}`)
    ) {
      newErrors.endTime = "End time must be after start time.";
    }

    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    // Validate form fields before submitting
    if (!validateForm()) {
      return; // If validation fails, exit early
    }

    const bookingData = {
      hall_name: hallName.value,
      booking_date: bookingDate,
      remarks,
      start_time: startTime,
      end_time: endTime,
    };

    // Reset any previous error before submitting
    setSubmitError(null);
    // Clear previous errors

    // Dispatch the addBooking action
    dispatch(addBooking(bookingData))
      .unwrap()
      .then(() => {
        notification.success({
          message: "Success",
          description: "Booking added successfully",
        });
      })
      .catch((err) => {
        notification.error({
          message: "Error",
          description: err?.error || "Failed to add setting",
        });
      });
  };

  const handleCancel = async (bookingId) => {
    setCancelError(null); // Reset any previous cancellation error

    // Dispatch the cancelMyBooking action with bookingId
    dispatch(cancelMyBooking(bookingId))
      .unwrap()
      .then(() => {
        notification.success({
          message: "Success",
          description: "Booking cancled successfully",
        });
      })
      .catch((err) => {
        console.log(err);
        notification.error({
          message: "Error",
          description: err?.error || "Failed to add setting",
        });
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
    <div className="bg-white pb-20">
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
            {bookings?.map((book) => (
              <div
                key={book.id}
                className="bg-white flex gap-4 shadow-md rounded-lg p-4 border border-gray-200"
              >
                <div>
                  <h3 className="text-md font-bold">
                    Hall Name: {book.hall_name}
                  </h3>
                  <p>
                    <strong>Remarks:</strong> {book.remarks}
                  </p>
                  <p>
                    <strong>Date:</strong>{" "}
                    {new Date(book.created_at).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Status:</strong> {book.status}
                  </p>
                  {book.status == "canceled" ? (
                    <></>
                  ) : (
                    <button
                      onClick={() => handleCancel(book.id)}
                      className="bg-red-500 text-white px-4 py-2 rounded-lg mt-2"
                    >
                      Cancel Booking
                    </button>
                  )}
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
