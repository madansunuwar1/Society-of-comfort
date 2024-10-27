import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SlArrowLeft } from "react-icons/sl";
import { Link, useNavigate } from "react-router-dom";
import { addPublicNotice } from "../../redux/noticeSlice"; // Import the slice

const Publicnotice = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = JSON.parse(localStorage.getItem("user"));
  const [formData, setFormData] = useState({
    title: "",
    notice_body: "",
    users: [2],
    user_id: user.user.id,
    notice_type: "public",
  });

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Dispatch the addPublicNotice action
    dispatch(addPublicNotice(formData))
      .unwrap()
      .then((response) => {
        alert("Public notice sent successfully");
        navigate("/dashboard");
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Network request failed");
      });
  };

  return (

      <div className=" bg-white pb-20 pt-8">
        <div className="flex px-6">
          <h3 className="font-bold flex justify-center mx-auto text-[22px]">
            Send Private Notice
          </h3>
        </div>
        <div className=" px-6 py-6 min-h-[100vh] bg-slate-200">
          <form onSubmit={handleSubmit}>
            <div className="">
              <input
                className="rounded-xl px-4 py-4 w-full shadow-md"
                type="text"
                name="title"
                placeholder="Notice Title"
                value={formData.title}
                onChange={handleInputChange}
              />
            </div>
            <div className="pt-6">
              <textarea
                className="rounded-xl w-full py-4 px-4 shadow-md"
                name="notice_body"
                placeholder="Notice"
                value={formData.notice_body}
                onChange={handleInputChange}
              />
            </div>
            <button
              type="submit"
              className="bg-[#403F93] text-white mx-auto flex px-24 py-3 rounded-3xl mt-6"
            >
              Send Notice
            </button>
          </form>
        </div>
      </div>
  
  );
};

export default Publicnotice;
