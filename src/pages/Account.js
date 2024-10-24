import React from "react";
import { SlArrowLeft } from "react-icons/sl";
import { Link, useNavigate } from "react-router-dom";
import { RiLockPasswordFill } from "react-icons/ri";
import { ImProfile } from "react-icons/im";
import { IoDocumentText } from "react-icons/io5";
import { RiServiceFill } from "react-icons/ri";
import { TbLogout2 } from "react-icons/tb";
import { IoIosArrowForward } from "react-icons/io";

const Account = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleNavigation = () => {
    if (user.role === "super_admin") {
      navigate("/dashboard");
    } else if (user.role === "Apartment User") {
      navigate("/userdash");
    } else if (user.role === "Worker") {
      navigate("/proadmin");
    }
  };
  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };
  return (
    <div className="flex justify-center bg-slate-800 w-[100%] h-[100vh]">
      <div className="w-[390px] bg-white font-roboto pb-20">
        <div className="flex px-6 py-4">
          <div className="items-center my-auto">
            <button onClick={handleNavigation}>
              <SlArrowLeft />
            </button>
          </div>
          <h3 className="font-bold flex justify-center mx-auto text-[22px]">
            Settings
          </h3>
        </div>
        <div className="bg-slate-200 px-6 py-6 min-h-[100vh]">
          <div className="flex gap-8 bg-white p-4 shadow-md">
            <div className="rounded-full overflow-hidden w-16 h-16">
              <img src={user.profile_picture_url} alt=""></img>
            </div>
            <div className="my-auto">
              <h1 className="font-bold uppercase text-[#3F3F95]">
                {user.user.name}
              </h1>
              <p>{user.role}</p>
            </div>
          </div>
          <div className="mt-6 bg-white shadow-md">
            <div className="bg-[#3F3F95] py-3 px-4">
              <h1 className="font-bold text-white text-xl">Settings</h1>
            </div>
            <Link to="/changepassword">
              <div className="px-4 flex gap-4 mt-4">
                <RiLockPasswordFill className="my-auto" />
                <div className="flex justify-between w-[100%]">
                  <p className="text-lg">Change Password</p>
                  <IoIosArrowForward className="my-auto" />
                </div>
              </div>
            </Link>

            <hr className="mt-4" />
            <Link to="/edit">
              <div className="px-4 flex gap-4 mt-4">
                <ImProfile className="my-auto" />
                <div className="flex justify-between w-[100%]">
                  <p className="text-lg">Edit Profile</p>
                  <IoIosArrowForward className="my-auto" />
                </div>
              </div>
            </Link>
            {/* <hr className="mt-4" />

            <div className="px-4 flex gap-4 mt-4">
              <IoDocumentText className="my-auto" />
              <div className="flex justify-between w-[100%]">
                <p className="text-lg">Document</p>
                <IoIosArrowForward className="my-auto" />
              </div>
            </div> */}
            <hr className="mt-4" />
            <div
              className="px-4 flex gap-4 mt-4 cursor-pointer"
              onClick={handleLogout}
            >
              <TbLogout2 className="my-auto" />
              <p className="text-lg">Sign Out</p>
            </div>
            <hr className="mt-4" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
