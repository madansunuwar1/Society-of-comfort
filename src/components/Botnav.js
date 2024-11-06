import React from "react";
import { FaHome } from "react-icons/fa";
import { RiMessage2Fill } from "react-icons/ri";
import { IoPersonSharp } from "react-icons/io5";
import { MdSubtitles } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { MdOutlinePayment } from "react-icons/md";
import { GrNotes } from "react-icons/gr";

const Botnav = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const handleNavigation = () => {
    if (user.role === "super_admin") {
      navigate("/dashboard");
    } else if (user.role === "Apartment User") {
      navigate("/userdash");
    } else if (user.role === "Worker") {
      navigate("/proadmin");
    }
  };
  return (
    <div className="flex justify-center">
      <div className="bg-[#3F3F95] fixed bottom-0 flex justify-center gap-12 py-3 px-4 rounded-xl items-centers mx-2 mb-2">
        <button onClick={handleNavigation}>
          <FaHome className="h-5 w-5 text-white mx-auto" />
          <div className="text-white text-sm">Home</div>
        </button>
        <Link to="/payment">
          <MdOutlinePayment className="h-5 w-5 text-white mx-auto" />
          <span className="text-white text-sm">Payment</span>
        </Link>
        <Link to="/notice">
          <GrNotes className="w-5 h-5 text-white mx-auto" />
          <span className="text-white text-sm">Notice</span>
        </Link>
        <Link to="/profile">
          <IoPersonSharp className="h-5 w-5 text-white mx-auto" />
          <span className="text-white text-sm">Profile</span>
        </Link>
      </div>
    </div>
  );
};

export default Botnav;
