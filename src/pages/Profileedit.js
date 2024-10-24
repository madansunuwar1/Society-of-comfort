import React, { useEffect, useState } from "react";
import { SlArrowLeft } from "react-icons/sl";
import { useNavigate } from "react-router-dom";
import image from "../svg/bg.jpg";
import axios from "axios";

const Profileedit = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [data, setData] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    phone_number: "",
    email: "",
  });
  const id = user.user.id;
  console.log(id);
  const fetchdata = async () => {
    const url = `https://dev.waveplusit.com/api/profile/${id}`;
    try {
      const response = await axios.get(url);
      console.log("response:", response);
      if (response.status === 200) {
        setData(response.data.user);
        setFormData({
          name: response.data.user.name,
          phone_number: response.data.user.phone_number,
          email: response.data.user.email,
        });
      } else {
        throw new Error("network not ok");
      }
    } catch (error) {
      console.log("Error:", error);
      alert("Network request failed");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  useEffect(() => {
    fetchdata();
  }, [id]);

  console.log(data);

  const handleNavigation = () => {
    navigate(-1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = `https://dev.waveplusit.com/api/profile/${id}`;
    try {
      const response = await axios.put(url, formData);
      if (response.status === 200) {
        alert("Profile updated successfully");
        const updatedUser = { ...user, user: { ...user.user, ...formData } };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        fetchdata();
      } else {
        throw new Error("Network not ok");
      }
    } catch (error) {
      console.log("Error:", error);
      alert("Profile update failed");
    }
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
            Edit Profile
          </h3>
        </div>
        <div className="px-6">
          <div className="flex justify-center py-5">
            <img src={image} alt="" className="h-32 w-32 rounded-full" />
          </div>
          <h1></h1>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="flex justify-between">
                <label className="my-auto">Name:</label>
                <input
                  name="name"
                  className="rounded-xl py-2 px-4 shadow-slate-400 shadow-sm"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              <div className="flex justify-between">
                <label className="my-auto">Phone no:</label>
                <input
                  name="phone_number"
                  className="rounded-xl py-2 px-4 shadow-slate-400 shadow-sm"
                  value={formData.phone_number}
                  onChange={handleChange}
                />
              </div>
              <div className="flex justify-between">
                <label className="my-auto">Email:</label>
                <input
                  name="email"
                  className="rounded-xl py-2 px-4 shadow-slate-400 shadow-sm"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div className="flex justify-center pt-4">
                <button
                  type="submit"
                  className="bg-blue-500 text-white rounded-xl py-2 px-4"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profileedit;
