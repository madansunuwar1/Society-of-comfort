import React from "react";
import { SlArrowLeft } from "react-icons/sl";
import { Link } from "react-router-dom";

const EventDetail = () => {
  return (
    <div className="bg-gray-200 min-h-[100vh]
    ">
      <div className="flex justify-between bg-[#3F3F95] px-4 py-2 w-full rounded-b-lg">
        <div className="items-center my-auto">
          <Link to="/userdash">
            <SlArrowLeft className="text-white" />
          </Link>
        </div>
        <button className="font-bold flex justify-center flex-col mx-auto text-[22px] text-white">
          Event detail
        </button>
      </div>
      <div className="bg-white rounded-md p-4 m-4">
        <p className="text-xl  capitalize font-bold">Event title</p>
        <p className="text-lg text-gray-500 mt-2">Event Date</p>
        <p className="text-lg text-gray-500">Event Venue</p>
        <p className="text-lg text-gray-500">Event Time</p>

        <p className="text-lg text-gray-600  pt-2">description</p>
        <img
          src="https://4.imimg.com/data4/RW/PX/MY-29855425/event-management.jpg"
          alt="Payment slip"
          className=" rounded-lg object-cover mt-2"
        />
      </div>
    </div>
  );
};

export default EventDetail;
