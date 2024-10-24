import React, { useEffect, useState } from "react";
import api from "../../utils/api"; // Import the axios instance

const DisplayEvent = () => {
  const [events, setEvents] = useState([]); // State to hold events data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(""); // Error state

  // Fetch events on component mount
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await api.get("/events"); // Replace '/events' with your actual endpoint
        setEvents(response.data); // Set the event data to state
      } catch (err) {
        console.error("Error fetching events:", err);
        setError("Failed to load events. Please try again later.");
      } finally {
        setLoading(false); // Stop loading after the request is completed
      }
    };

    fetchEvents();
  }, []);

  // Conditional rendering for loading, error, or event list
  if (loading) {
    return <p>Loading events...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className=" bg-slate-200 rounded-xl p-8">
      <h3 className="text-2xl font-bold mb-6">Events</h3>

      {
        <ul className="space-y-4">
          {events.data.map((event) => (
            <li
              key={event.id}
              className="p-4 bg-white rounded-lg shadow-sm flex flex-col"
            >
              <h4 className="text-xl font-semibold">{event.event.name}</h4>
              <p className="text-gray-600 mb-2">{event.event.description}</p>
              {event.file_url && (
                <div className="mt-4">
                  {event.file_url.endsWith(".jpg") ||
                  event.file_url.endsWith(".jpeg") ||
                  event.file_url.endsWith(".png") ? (
                    <img
                      src={event.file_url} // Assuming the file_url URL is directly accessible
                      alt="Event file_url"
                      className="mt-2 rounded-lg shadow-md h-[200px] w-full object-cover"
                    />
                  ) : event.file_url.endsWith(".pdf") ? (
                    <a
                      href={event.file_url} // Link to download the PDF
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 text-blue-600 underline"
                    >
                      Download PDF
                    </a>
                  ) : (
                    <p className="mt-2 text-gray-500">Unsupported file type</p>
                  )}
                </div>
              )}
              <p className="mt-4">
                Date: <span className="font-medium">{event.event.date}</span>
              </p>
              <p>
                Time: <span className="font-medium">{event.event.time}</span>
              </p>
              <p>
                Venue: <span className="font-medium">{event.event.venue}</span>
              </p>
            </li>
          ))}
        </ul>
      }
    </div>
  );
};

export default DisplayEvent;
