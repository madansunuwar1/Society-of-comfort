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
      <div className="bg-[#3F3F95] fixed bottom-0 flex justify-center gap-10 py-4 w-full rounded-2xl items-centers">
        <button onClick={handleNavigation}>
          <FaHome className="h-6 w-6 text-white mx-auto" />
          <div className="text-white">Home</div>
        </button>
        <Link to="/userpayment">
        <MdOutlinePayment className="h-6 w-6 text-white mx-auto"/>
          <span className="text-white">Payment</span>
        </Link>
        <Link to="/notice">
        <GrNotes className="w-6 h-6 text-white mx-auto"/>
          <span className="text-white">Notice</span>
        </Link>
        <Link to="/profile">
          <IoPersonSharp className="h-6 w-6 text-white mx-auto" />
          <span className="text-white">Profile</span>
        </Link>
      </div>
    </div>
  );
};

export default Botnav;
