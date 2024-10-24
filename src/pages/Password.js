import axios from "axios";
import React, { useState } from "react";
import { SlArrowLeft } from "react-icons/sl";
import { useNavigate } from "react-router-dom";

const Password = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [data, setData] = useState({
    old_password: "",
    password: "",
    password_confirmation: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData((prevformData) => ({
      ...prevformData,
      [name]: value,
    }));
  };
  const id = user.user.id;
  const url = `https://dev.waveplusit.com/api/change-password/${id}`;

  const navigate = useNavigate();
  console.log(url);

  const handleNavigation = () => {
    navigate(-1);
  };

  const handlePasswordChange = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(url, data);
      if (response.status === 200) {
        alert("password changed sucessfully");
        localStorage.removeItem("user");
        navigate("/signin");
      } else {
        throw new Error("Network response not ok");
      }
    } catch (error) {
      console.log("error:", error);
    } finally {
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
            Change Password
          </h3>
        </div>
        <form>
          <div className="flex flex-col gap-8 my-4 mx-6">
            <div className="flex flex-col gap-2">
              <input
                className=" rounded-xl w-full py-4 px-4 shadow-slate-400 shadow-sm"
                name="old_password"
                placeholder="old password"
                type="password"
                value={data.old_password}
                onChange={handleInputChange}
              ></input>
            </div>
            <div className="flex flex-col gap-2">
              <input
                name="password"
                placeholder="new password"
                className=" rounded-xl w-full py-4 px-4 shadow-slate-400 shadow-sm"
                type="password"
                value={data.password}
                onChange={handleInputChange}
              ></input>
            </div>
            <div className="flex flex-col gap-2">
              <input
                name="password_confirmation"
                placeholder="re-enter newpassword"
                className=" rounded-xl w-full py-4 px-4 shadow-slate-400 shadow-sm"
                type="password"
                value={data.password_confirmation}
                onChange={handleInputChange}
              ></input>
            </div>
            <button
              type="submit"
              onClick={handlePasswordChange}
              className="bg-[#403F93] text-white mx-auto flex px-24 py-3 rounded-3xl"
            >
              Change Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Password;
