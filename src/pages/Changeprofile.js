import React from "react";
import { SlArrowLeft } from "react-icons/sl";
import { useNavigate } from "react-router-dom";

const Changeprofile = () => {
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
    <div className="flex justify-center bg-slate-800 w-[100%] h-[100vh]">
      <div className="w-[390px] bg-slate-200 pb-20">
        <div className="flex  font-roboto px-6 py-4 bg-white">
          <div className="items-center my-auto">
            <button onClick={handleNavigation}>
              <SlArrowLeft />
            </button>
          </div>
          <h3 className="font-bold flex justify-center mx-auto text-[22px]">
            Edit Profile
          </h3>
        </div>
        <div className="flex flex-col gap-4 my-4 mx-6">
          <div className="flex flex-col gap-2">
            <label>Name</label>
            <input
              name="Name"
              placeholder="Name"
              className="px-4 py-2 rounded-md"
            ></input>
          </div>
          <div className="flex flex-col gap-2">
            <label>Appartment Number</label>
            <input
              name="Appartment_no"
              placeholder="52 A"
              className="px-4 py-2 rounded-md"
            ></input>
          </div>
          <div className="flex flex-col gap-2">
            <label>Block number</label>
            <input
              name="block_no"
              placeholder="D"
              className="px-4 py-2 rounded-md"
            ></input>
          </div>
          <div className="flex flex-col gap-2">
            <label></label>
            <input
              name="password"
              placeholder="re-enter newpassword"
              className="px-4 py-2 rounded-md"
            ></input>
          </div>
          <div className="flex flex-col gap-2">
            <label>Re-enter new password</label>
            <input
              name="password"
              placeholder="re-enter newpassword"
              className="px-4 py-2 rounded-md"
            ></input>
          </div>
          <button
            type="submit"
            className="bg-[#403F93] text-white mx-auto flex px-20 py-3 rounded-3xl"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default Changeprofile;
