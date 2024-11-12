import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";
import NepaliDateInput from "../../components/NepaliDatePicker";

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
    <div className="pb-20 mx-6">
      <h3 className="font-bold flex text-[22px]">Add Event</h3>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2 mt-8">
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
          <NepaliDateInput
            value={eventDate}
            onChange={setEventDate} // Update event date with the selected Nepali date
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
        {/* File input for attachment */}
        <div>
          <label className="font-bold text-md">Iamge</label>
          <input
            type="file"
            onChange={handleFileChange}
            className="rounded-md py-3 px-4 w-full border-[2px] border-gray-400 mt-2 bg-white"
            accept=".jpg,.jpeg,.png,.pdf" // Accept only images and PDFs
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
  );
};

export default AddEvent;
