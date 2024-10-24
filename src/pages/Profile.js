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
          <div className="bg-[#3F3F95] py-3 px-4">
            <h1 className="font-bold text-white text-xl">Name</h1>
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
          <div className="bg-[#3F3F95] py-3 px-4">
            <h1 className="font-bold text-white text-xl">apartment</h1>
          </div>
          <div className="flex gap-8 bg-white p-4">
            <div>
              <h1 className="font-bold">{user.user.address}</h1>
              <p>
                {user.user.apartment_number} <span>{user.user.block}</span>
              </p>
            </div>
          </div>
          <div className="bg-[#3F3F95] py-3 px-4">
            <h1 className="font-bold text-white text-xl">Documents</h1>
          </div>
          <div className="flex gap-8 bg-white p-4 ">
            {user.user.citizenship && (
              <img
                className="border-2 border-slate-300 overflow-hidden"
                src={user.user.citizenship.original_url}
                alt="Citizenship"
                height="100"
                width="100"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
