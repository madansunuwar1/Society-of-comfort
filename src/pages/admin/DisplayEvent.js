import React, { useEffect, useState } from "react";
import api from "../../utils/api"; // Import the axios instance
import { Link } from "react-router-dom";
import { SlArrowLeft } from "react-icons/sl";
import { Skeleton } from "antd";

const DisplayEvent = () => {
  const [events, setEvents] = useState([]); // State to hold events data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(""); // Error state

  // Fetch events on component mount
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await api.get("/events"); // Replace '/events' with your actual endpoint
        setEvents(response.data.data); // Set the event data to state
      } catch (err) {
        console.error("Error fetching events:", err);
        setError("No events");
      } finally {
        setLoading(false); // Stop loading after the request is completed
      }
    };

    fetchEvents();
  }, []);

  // Conditional rendering for loading, error, or event list
  if (loading) {
    return (
      <div className="p-12">
        <Skeleton active />
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className=" bg-slate-200 rounded-xl md:px-24">
      <div className="flex px-6 py-4">
        <div className="items-center my-auto">
          <Link to="/userdash">
            <SlArrowLeft />
          </Link>
        </div>
        <h3 className="font-bold flex justify-center mx-auto text-[22px]">
          Events
        </h3>
      </div>

      {
        <ul className="space-y-4">
          {events.map((event) => (
            <div
              key={event.id}
              className=" bg-white shadow-sm flex flex-col md:px-14"
            >
              <div className="my-2">
                <h4 className="text-md font-semibold px-4">
                  {event.event.name}
                </h4>
                <p className="text-gray-500 text-sm px-4">
                  {event.event.description}
                </p>
              </div>
              {event.file_url && (
                <div className="border border-gray-500">
                  {event.file_url.endsWith(".jpg") ||
                  event.file_url.endsWith(".jpeg") ||
                  event.file_url.endsWith(".png") ? (
                    <img
                      src={event.file_url} // Assuming the file_url URL is directly accessible
                      alt="Event file_url"
                      className="shadow-lg h-[200px] md:h-[400px] w-full object-cover"
                    />
                  ) : event.file_url.endsWith(".pdf") ? (
                    <a
                      href={event.file_url} // Link to download the PDF
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 text-blue-600 underline p-4"
                    >
                      Download PDF
                    </a>
                  ) : (
                    <p className="mt-2 text-gray-500">Unsupported file type</p>
                  )}
                </div>
              )}
              <div className="flex justify-between my-2 mx-4">
                <div className="flex flex-col">
                  <span className="font-medium text-md">Date:</span>{" "}
                  <span className="text-sm text-gray-500">
                    {event.event.date}
                  </span>
                </div>

                <div className="flex flex-col">
                  <span className="font-medium text-md">Time:</span>{" "}
                  <span className="text-sm text-gray-500 ">
                    {event.event.time}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="font-medium text-md">Venue:</span>{" "}
                  <span className="text-sm text-gray-500">
                    {event.event.venue}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </ul>
      }
    </div>
  );
};

export default DisplayEvent;
