import React from "react";
import { SlArrowLeft } from "react-icons/sl";
import { Link } from "react-router-dom";

const NoticeDetail = () => {
  const getNoticeColor = (status) => {
    switch (status) {
      case "private":
        return "bg-[#2563EB] rounded-3xl";
      default:
        return "bg-[#1E3A8A] rounded-3xl";
    }
  };

  return (
    <div className="bg-gray-200 min-h-[100vh]">
      <div className="flex justify-between bg-[#3F3F95] px-4 py-2 w-full rounded-b-lg">
        <div className="items-center my-auto">
          <Link to="/notice">
            <SlArrowLeft className="text-white" />
          </Link>
        </div>
        <button className="font-bold flex justify-center flex-col mx-auto text-[22px] text-white">
          Notice Detail
        </button>
      </div>
      <div className="bg-white rounded-md p-4 m-4">
        <p className="text-xl  capitalize font-bold">Notice title</p>
        <p className="text-lg text-gray-500">Date</p>
        <p className="pt-2 text-lg">
          <span>notice type</span>
        </p>
        <p className="text-lg text-gray-600  pt-2">description</p>
      </div>
    </div>
  );
};

export default NoticeDetail;
