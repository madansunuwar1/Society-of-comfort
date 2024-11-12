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
  const { bookings, loading, error } = useSelector((state) => state.bookings);
  const [hallName, setHallName] = useState(null);
  const [bookingDate, setBookingDate] = useState(""); // Default date for testing
  const [remarks, setRemarks] = useState(""); // Default remarks for testing
  const [startTime, setStartTime] = useState(""); // Default start time
  const [endTime, setEndTime] = useState(""); // Default end time
  const [submitError, setSubmitError] = useState(null); // Local state for submission errors
  const [cancelError, setCancelError] = useState(null); // Local state for cancellation errors
  const [errors, setErrors] = useState({}); // Validation errors

  const options = [
    { value: "Hall A", label: "Hall A", available: true },
    { value: "Hall B", label: "Hall B", available: true },
    { value: "Hall C", label: "Hall C", available: false },
  ];

  useEffect(() => {
    dispatch(bookingActions.fetchBookings());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      setSubmitError(error); // Set local error state if there's an error
    }
  }, [error]);

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

    setErrors(newErrors);
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
    setErrors({}); // Clear previous errors

    // Dispatch the addBooking action
    const response = await dispatch(addBooking(bookingData));

    // Check if the action was fulfilled successfully
    if (addBooking.fulfilled.match(response)) {
      alert("Booking successful! Your booking has been confirmed.");
      navigate("/userdash");
    } else {
      // Handle validation errors from the backend
      if (response.payload?.errors) {
        setErrors(response.payload.errors); // Set errors state with backend validation errors
      } else {
        alert("Booking failed: " + response.error.message); // Generic error message
      }
    }
  };
  const handleCancel = async (bookingId) => {
    setCancelError(null); // Reset any previous cancellation error
    try {
      // Dispatch the cancelMyBooking action with bookingId
      const response = await dispatch(cancelMyBooking(bookingId));

      // Check if the action was fulfilled successfully
      if (cancelMyBooking.fulfilled.match(response)) {
        alert("Booking canceled successfully.");
        dispatch(bookingActions.fetchBookings()); // Refresh bookings list after cancellation
      } else {
        alert("Cancellation failed.");
      }
    } catch (error) {
      setCancelError(error.message); // Set error message if cancellation fails
      alert("Cancellation failed: " + error.message); // Alert the user
    }
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
        {submitError && <p className="text-red-500">{submitError}</p>}{" "}
        {/* Display submission error */}
        {cancelError && <p className="text-red-500">{cancelError}</p>}{" "}
        {/* Display cancellation error */}
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
            {errors.hallName && (
              <p className="text-red-500">{errors.hallName}</p>
            )}
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
            {errors.bookingDate && (
              <p className="text-red-500">{errors.bookingDate}</p>
            )}
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
            {errors.startTime && (
              <p className="text-red-500">{errors.startTime}</p>
            )}
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
            {errors.endTime && <p className="text-red-500">{errors.endTime}</p>}
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
