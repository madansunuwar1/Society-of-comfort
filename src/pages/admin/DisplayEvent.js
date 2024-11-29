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
    <div className=" bg-slate-200 rounded-xl md:px-24 min-h-[100vh]">
      <div className="flex justify-between bg-[#3F3F95] px-4 py-2 w-full rounded-b-lg">
        <div className="items-center my-auto">
          <Link to="/userdash">
            <SlArrowLeft className="text-white" />
          </Link>
        </div>
        <button className="font-bold flex justify-center flex-col mx-auto text-[22px] text-white">
          Events
        </button>
      </div>
      {
        <div className="bg-gray-100 mx-4 mt-4">
          {events.map((item) => (
            <Link
              to={`/display-event/event-detail/${item.event.id}`}
              key={item.event.id}
              className="flex items-center justify-between bg-white shadow-sm shadow-gray-400 rounded-lg p-4"
            >
              <div className="">
                <p
                  className="text-md text-ellipsis overflow-hidden capitalize font-semibold"
                  style={{
                    display: "-webkit-box",
                    WebkitBoxOrient: "vertical",
                    WebkitLineClamp: 1,
                  }}
                >
                  {item.event.name}
                </p>
                <p className="text-md text-gray-500">
                  {new Date(item.event.date).toLocaleDateString()}
                </p>
                <p
                  className="text-md text-gray-600 text-ellipsis overflow-hidden pt-2 w-2/3"
                  style={{
                    display: "-webkit-box",
                    WebkitBoxOrient: "vertical",
                    WebkitLineClamp: 2,
                  }}
                >
                  {item.event.description}
                </p>
              </div>

              <img
                src={item.file_url}
                alt="Payment slip"
                className="h-16 w-16 rounded-lg object-cover"
              />
            </Link>
          ))}
        </div>
      }
    </div>
  );
};

export default DisplayEvent;
