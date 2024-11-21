import React from "react";
import { SlArrowLeft } from "react-icons/sl";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const handleNavigation = () => {
    navigate(-1);
  };

  return (
    <div className="flex justify-center bg-slate-800 w-[100%] h-[100vh]">
      <div className="w-[390px] bg-slate-200 pb-20">
        <div className="flex  font-roboto  px-6 py-4 bg-white">
          <div className="items-center my-auto">
            <button onClick={handleNavigation}>
              <SlArrowLeft />
            </button>
          </div>
          <h3 className="font-bold flex justify-center mx-auto text-[22px]">
            Profile
          </h3>
        </div>
        <div className="mt-4 shadow-md mx-4">
          <div className="bg-[#3F3F95] py-2 px-4">
            <h1 className="font-bold text-white text-md">Name</h1>
          </div>
          <div className="flex gap-8 bg-white p-4">
            <div className="rounded-full w-20 h-20 overflow-hidden">
              <img src={user.profile_picture_url} alt=""></img>
            </div>
            <div className="my-auto">
              <h1 className="font-bold text-[#3F3F95] uppercase">
                {user.user.name}
              </h1>
              <p>{user.role}</p>
            </div>
          </div>
          <div className="bg-white p-4 py-8">
            <div className=" grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-500">Name</p>
                <p className="font-semibold mt-2">{user.user.name}</p>
              </div>
              <div>
                <p className="text-gray-500">Email</p>
                <p className="font-semibold mt-2">{user.user.email}</p>
              </div>
              <div>
                <p className="text-gray-500">Phone Number</p>
                <p className="font-semibold mt-2">{user.user.phone_number}</p>
              </div>
            </div>
          </div>
          <div className="bg-[#3F3F95] py-2 px-4">
            <h1 className="font-bold text-white text-md">Notes</h1>
          </div>
          <div className="flex gap-8 bg-white p-4">
            <div>
              <p>{user.user.notes}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
