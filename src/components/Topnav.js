import React from "react";
import { FiList } from "react-icons/fi";
import { IoMdNotificationsOutline } from "react-icons/io";
import { Link } from "react-router-dom";

const Topnav = () => {
  const userData = JSON.parse(localStorage.getItem("user"));
  const pic = userData.profile_picture_url;
  return (
    <div className="flex justify-center bg-slate-800 w-[100%]">
      <div className="flex justify-between bg-[#3F3F95] px-5 py-2 w-[390px]">
        <Link to="/account">
          <FiList className="h-8 w-8 text-white" />
        </Link>
        <div className="flex">
          <IoMdNotificationsOutline className="h-8 w-8 text-white" />
          <Link to="/account">
            <img src={pic} alt="" className="h-8 w-8 rounded-full" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Topnav;
