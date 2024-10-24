import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SlArrowLeft } from "react-icons/sl";
import { Link } from "react-router-dom";
import api from "../../utils/api"; // Import the axios instance

const AddEvent = () => {
  const navigate = useNavigate();

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
    setEventAttachment(e.target.files[0]); // Set the selected file
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

    try {
      // POST request to the API using the axios instance
      const response = await api.post("/events", formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Set the correct header for file upload
        },
      });
      console.log("Event created successfully:", response.data);

      // Reset form after successful submission
      setEventName("");
      setEventDescription("");
      setEventDate("");
      setEventTime("");
      setEventVenue("");
      setEventAttachment(null); // Clear file input

      alert("Event added successfully!");
      navigate("/dashboard"); // Redirect after success
    } catch (err) {
      console.error("Error adding event:", err);
      setError("Failed to add event. Please try again.");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="flex justify-center bg-slate-800 w-full h-[100vh]">
      <div className="w-[390px] bg-slate-200 pb-20">
        <div className="flex px-6 py-4">
          <div className="items-center my-auto">
            <Link to="/dashboard">
              <SlArrowLeft />
            </Link>
          </div>
          <h3 className="font-bold flex justify-center mx-auto text-[22px]">
            Add Event
          </h3>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col justify-center items-center gap-5 mx-auto mt-12 w-[360px]"
        >
          <input
            className="rounded-xl w-full py-4 px-4 shadow-slate-400 shadow-sm"
            type="text"
            placeholder="Event Name"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            required
          />
          <textarea
            className="rounded-xl w-full py-4 px-4 shadow-slate-400 shadow-sm"
            placeholder="Event Description"
            value={eventDescription}
            onChange={(e) => setEventDescription(e.target.value)}
            rows="4"
            required
          />
          <input
            className="rounded-xl w-full py-4 px-4 shadow-slate-400 shadow-sm"
            type="date"
            placeholder="Event Date"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
            required
          />
          <input
            className="rounded-xl w-full py-4 px-4 shadow-slate-400 shadow-sm"
            type="time"
            placeholder="Event Time"
            value={eventTime}
            onChange={(e) => setEventTime(e.target.value)}
            required
          />
          <input
            className="rounded-xl w-full py-4 px-4 shadow-slate-400 shadow-sm"
            type="text"
            placeholder="Event Venue"
            value={eventVenue}
            onChange={(e) => setEventVenue(e.target.value)}
            required
          />

          {/* File input for attachment */}
          <input
            type="file"
            onChange={handleFileChange}
            className="rounded-xl w-full py-2 px-2 shadow-slate-400 shadow-sm"
            accept=".jpg,.jpeg,.png,.pdf" // Accept only images and PDFs
          />

          {error && <p className="text-red-500">{error}</p>}

          <button
            type="submit"
            className={`bg-[#403F93] text-white mx-auto flex px-24 py-3 rounded-3xl mt-6 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Event"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddEvent;
