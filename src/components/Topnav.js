import React from "react";
import { FiList } from "react-icons/fi";
import { IoMdNotificationsOutline } from "react-icons/io";
import { Link } from "react-router-dom";

const Topnav = () => {
  const userData = JSON.parse(localStorage.getItem("user"));
  const pic =
    userData?.profile_picture_url ||
    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";
  return (
    <div className="flex justify-between bg-[#3F3F95] px-4 py-2 w-full rounded-b-lg">
      <div className="flex gap-2">
        <Link to="/account">
          <img
            src={pic}
            alt=""
            className="h-10 w-10 rounded-full object-cover"
          />
        </Link>
        <h1 className="mt-2 text-[20px] font-sans text-white">
          Welocme{" "}
          <span className="font-serif text-[16px] font-bold text-white">
            {" "}
            {userData.user.name}
          </span>
        </h1>
      </div>
      <div className="flex">
        <IoMdNotificationsOutline className="h-8 w-8 text-white" />
      </div>
    </div>
  );
};

export default Topnav;
