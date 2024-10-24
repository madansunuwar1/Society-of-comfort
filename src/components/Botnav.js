import React from "react";
import { FaHome } from "react-icons/fa";
import { RiMessage2Fill } from "react-icons/ri";
import { IoPersonSharp } from "react-icons/io5";
import { MdSubtitles } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";

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
      <div className="bg-[rgba(63,63,149,0.5)] fixed bottom-0 flex justify-center gap-10 px-4 py-4 mb-2 rounded-2xl items-centers">
        <button onClick={handleNavigation}>
          <FaHome className="h-6 w-6" />
        </button>
        <Link to="/profile">
          <IoPersonSharp className="h-6 w-6" />
        </Link>
      </div>
    </div>
  );
};

export default Botnav;
