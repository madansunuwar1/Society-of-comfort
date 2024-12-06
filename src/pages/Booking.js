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
import { NepaliDatePicker } from "nepali-datepicker-reactjs";
import "nepali-datepicker-reactjs/dist/index.css";
import { ADToBS } from "bikram-sambat-js";

const Booking = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { bookings, loading, error } = useSelector((state) => state.bookings);
  const [hallName, setHallName] = useState(null);
  const [bookingDate, setBookingDate] = useState("");
  const [remarks, setRemarks] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [errors, setErrors] = useState({});
  const [bookLoading, setBookLoading] = useState(false);

  const options = [
    { value: "Hall A", label: "Hall A", available: true },
    { value: "Hall B", label: "Hall B", available: true },
    { value: "Hall C", label: "Hall C", available: false },
  ];

  useEffect(() => {
    try {
      const today = new Date();
      const nepaliDate = ADToBS(today);
      setBookingDate(nepaliDate);
    } catch (error) {
      console.error("Error converting AD to BS:", error);
    }
  }, []);

  useEffect(() => {
    dispatch(myBookings());
  }, [dispatch]);

  const validateForm = () => {
    const validationErrors = {};

    if (!hallName) {
      validationErrors.hallName = "Please select a hall.";
    }

    if (!bookingDate) {
      validationErrors.bookingDate = "Booking date is required.";
    }

    if (!startTime) {
      validationErrors.startTime = "Start time is required.";
    }

    if (!endTime) {
      validationErrors.endTime = "End time is required.";
    } else if (
      new Date(`1970-01-01T${endTime}`) <= new Date(`1970-01-01T${startTime}`)
    ) {
      validationErrors.endTime = "End time must be after start time.";
    }

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setBookLoading(true);

    const bookingData = {
      hall_name: hallName.value,
      booking_date: bookingDate,
      remarks,
      start_time: startTime,
      end_time: endTime,
    };

    dispatch(addBooking(bookingData))
      .unwrap()
      .then(() => {
        notification.success({
          message: "Success",
          description: "Booking added successfully",
        });
        setHallName(null);
        setRemarks("");
        setStartTime("");
        setEndTime("");
        setErrors({});
        setBookLoading(false);
      })
      .catch((err) => {
        notification.error({
          message: "Error",
          description: err?.error || "Failed to add booking",
        });
        setBookLoading(false);
      });
  };

  const handleCancel = async (bookingId) => {
    dispatch(cancelMyBooking(bookingId))
      .unwrap()
      .then(() => {
        notification.success({
          message: "Success",
          description: "Booking canceled successfully",
        });
      })
      .catch((err) => {
        notification.error({
          message: "Error",
          description: err?.error || "Failed to cancel booking",
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
            {errors.hallName && (
              <p className="text-red-500 text-sm">{errors.hallName}</p>
            )}
          </div>
          <div>
            <label htmlFor="booking_date">Booking Date</label>
            <NepaliDatePicker
              id="booking_date"
              name="booking_date"
              className="w-full custom-date-picker"
              options={{ calenderLocale: "en", valueLocale: "en" }}
              value={bookingDate}
              onChange={setBookingDate}
              required
            />
            {errors.bookingDate && (
              <p className="text-red-500 text-sm">{errors.bookingDate}</p>
            )}
          </div>
          <div>
            <label htmlFor="start_time">Start Time</label>
            <input
              type="time"
              id="start_time"
              name="start_time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="rounded-md w-full py-2 px-4 border-[2px] border-gray-400 mt-2"
            />
            {errors.startTime && (
              <p className="text-red-500 text-sm">{errors.startTime}</p>
            )}
          </div>
          <div>
            <label htmlFor="end_time">End Time</label>
            <input
              type="time"
              id="end_time"
              name="end_time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="rounded-md w-full py-2 px-4 border-[2px] border-gray-400 mt-2"
            />
            {errors.endTime && (
              <p className="text-red-500 text-sm">{errors.endTime}</p>
            )}
          </div>
          <div>
            <label htmlFor="remarks">Remarks</label>
            <input
              type="text"
              id="remarks"
              name="remarks"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="rounded-md w-full py-2 px-4 border-[2px] border-gray-400 mt-2"
            />
          </div>
          <button
            type="submit"
            className="bg-[#403F93] text-white flex px-16 py-3 rounded-lg mt-6"
          >
            <span className="mx-auto">
              {bookLoading ? "Loading..." : "Book"}
            </span>
          </button>
        </form>
      </div>
      <div className="px-6">
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
  );
};

export default Booking;
