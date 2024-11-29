import React, { useEffect } from "react";
import { SlArrowLeft } from "react-icons/sl";
import { Link, useParams } from "react-router-dom";
import { getEventById } from "../redux/eventSlice";
import { useDispatch, useSelector } from "react-redux";

const EventDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentEvent, loading } = useSelector((state) => state.events);

  useEffect(() => {
    if (id) {
      dispatch(getEventById(id));
    }
  }, [id, dispatch]);

  return (
    <div
      className="bg-gray-200 min-h-[100vh]
    "
    >
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
        <p className="text-xl  capitalize font-bold">{currentEvent?.name}</p>
        <p className="text-md text-gray-500 mt-2">
          <span className="font-semibold text-black">Date : </span>
          {currentEvent?.date}
        </p>
        <p className="text-md text-gray-500">
          <span className="font-semibold text-black">Place : </span>
          {currentEvent?.venue}
        </p>
        <p className="text-md text-gray-500">
          <span className="font-semibold text-black">Time : </span>
          {currentEvent?.time}
        </p>

        <p className="text-md text-gray-600  pt-2">
          {currentEvent?.description}
        </p>
        <img
          src="https://4.imimg.com/data4/RW/PX/MY-29855425/event-management.jpg"
          alt="Payment slip"
          className=" rounded-lg object-cover mt-2"
        />
      </div>
      ;
    </div>
  );
};

export default EventDetail;
