import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux"; // Import useDispatch
import { notification } from "antd";
import { NepaliDatePicker } from "nepali-datepicker-reactjs";
import "nepali-datepicker-reactjs/dist/index.css";
import { addEvent } from "../../redux/eventSlice";

const AddEvent = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch(); // Initialize useDispatch

  // State for form inputs
  const [eventName, setEventName] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [eventVenue, setEventVenue] = useState("");
  const [eventAttachment, setEventAttachment] = useState(null); // For file upload
  const [loading, setLoading] = useState(false); // For loading state
  const [error, setError] = useState(""); // For error handling

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setEventAttachment(file);
    console.log(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading
    setError(""); // Clear previous errors

    // Create FormData to handle file and form inputs
    const formData = new FormData();
    formData.append("name", eventName);
    formData.append("description", eventDescription);
    formData.append("date", eventDate);
    formData.append("time", eventTime);
    formData.append("venue", eventVenue);

    if (eventAttachment) {
      formData.append("file", eventAttachment); // Add the file to formData
    }

    console.log("my formdata", formData);

    // Dispatch the addEvent action and unwrap the result
    dispatch(addEvent(formData))
      .unwrap()
      .then(() => {
        notification.success({
          message: "Success",
          description: "Event added successfully",
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error:", err?.errors);

        // Display the error notification
        notification.error({
          message: "Error",
          description: err?.errors,
        });
        setLoading(false);
      });

    // If successful, show success notification and reset form

    // Reset the form
    setEventName("");
    setEventDescription("");
    setEventDate("");
    setEventTime("");
    setEventVenue("");
    setEventAttachment(null); // Clear file input
    navigate("/dashboard/eventlist"); // Redirect after success
  };

  return (
    <div className="pb-20 mx-6">
      <h3 className="font-bold flex text-[22px]">Add Event</h3>
      <div className="bg-gray-300 rounded-lg p-4">
        <div className="py-6 bg-white rounded-lg m-3 p-4">
          <form onSubmit={handleSubmit} className="flex flex-col gap-2">
            <div>
              <label className="font-bold text-md"> Event Name</label>
              <input
                className="rounded-md py-3 px-4 w-full border-[2px] border-gray-400 mt-2"
                type="text"
                placeholder="Event Name"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="font-bold text-md"> Event Description</label>
              <textarea
                className="rounded-md w-full py-4 px-4 border-[2px] border-gray-400 mt-2"
                placeholder="Event Description"
                value={eventDescription}
                onChange={(e) => setEventDescription(e.target.value)}
                rows="4"
                required
              />
            </div>
            <div>
              <label className="font-bold text-md pb-2"> Event Date</label>
              <NepaliDatePicker
                options={{ calenderLocale: "en", valueLocale: "en" }}
                value={eventDate}
                onChange={setEventDate}
                className="custom-date-picker"
                required
              />
            </div>
            <div>
              <label className="font-bold text-md"> Event Time</label>
              <input
                className="rounded-md py-3 px-4 w-full border-[2px] border-gray-400 mt-2"
                type="time"
                placeholder="Event Time"
                value={eventTime}
                onChange={(e) => setEventTime(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="font-bold text-md"> Event Venue</label>
              <input
                className="rounded-md py-3 px-4 w-full border-[2px] border-gray-400 mt-2"
                type="text"
                placeholder="Event Venue"
                value={eventVenue}
                onChange={(e) => setEventVenue(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="font-bold text-md"> Image</label>
              <input
                type="file"
                onChange={handleFileChange}
                className="rounded-md py-3 px-4 w-full border-[2px] border-gray-400 mt-2 bg-white"
                accept=".jpg,.jpeg,.png,.pdf"
              />
            </div>

            {error && <p className="text-red-500">{error}</p>}
            <div>
              <button
                type="submit"
                className={`bg-[#403F93] text-white flex px-24 py-3 rounded-md mt-6 ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={loading}
              >
                {loading ? "Adding..." : "Add Event"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddEvent;
