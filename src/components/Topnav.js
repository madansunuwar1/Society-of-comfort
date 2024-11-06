import React from "react";
import { FiList } from "react-icons/fi";
import { IoMdNotificationsOutline } from "react-icons/io";
import { Link } from "react-router-dom";

const Topnav = () => {
  const userData = JSON.parse(localStorage.getItem("user"));
  const pic = userData.profile_picture_url;
  return (
    <div className="flex justify-center bg-slate-800 w-[100%]">
      <div className="flex justify-between bg-[#3F3F95] px-5 py-3 w-full">
        <div className="flex gap-2">
          <Link to="/account">
            <img src={pic} alt="" className="h-10 w-10 rounded-full" />
          </Link>
          <p className="my-auto text-white">Welcome! user</p>
        </div>
        <div className="flex">
          <IoMdNotificationsOutline className="h-8 w-8 text-white" />
        </div>
      </div>
    </div>
  );
};

export default Topnav;
