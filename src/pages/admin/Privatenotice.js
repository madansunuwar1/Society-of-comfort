import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SlArrowLeft } from "react-icons/sl";
import { Link, useNavigate } from "react-router-dom";
import { addPrivateNotice } from "../../redux/noticeSlice"; // Import the slice
import { fetchResidences } from "../../redux/userSlice"; // Import the action to fetch residences

const Publicnotice = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = JSON.parse(localStorage.getItem("user"));

  // State for form data and residence list
  const [formData, setFormData] = useState({
    title: "",
    notice_body: "",
    users: [2],
    user_id: user.user.id,
    notice_type: "public",
    residence_id: [], // Store selected residence ID here
  });

  // Fetch residence list from Redux store
  const { residences, loading } = useSelector((state) => state.user);

  // Fetch residences when component mounts
  useEffect(() => {
    dispatch(fetchResidences());
  }, [dispatch]);

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  // Handle residence selection
  const handleResidenceChange = (e) => {
    const selectedOptions = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setFormData((prevFormData) => ({
      ...prevFormData,
      residence_id: selectedOptions, // Update residence_id correctly
    }));
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Dispatch the addPublicNotice action
    dispatch(addPrivateNotice(formData))
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
    <div className="flex justify-center bg-slate-800 w-[100%] h-[100vh]">
      <div className="w-[390px] bg-white pb-20">
        <div className="flex px-6 py-4">
          <div className="items-center my-auto">
            <Link to="/dashboard">
              <SlArrowLeft />
            </Link>
          </div>
          <h3 className="font-bold flex justify-center mx-auto text-[22px]">
            Send Public Notice
          </h3>
        </div>
        <div className="bg-slate-200 px-6 py-6 min-h-[100vh]">
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

            {/* Residence selection dropdown */}
            <div className="pt-6">
              <select
                className="rounded-xl w-full py-4 px-4 shadow-md"
                multiple
                value={formData.residence_id}
                onChange={handleResidenceChange}
              >
                {!loading &&
                  residences?.data?.map((residence) => (
                    <option key={residence.id} value={residence.id}>
                      {residence.name}
                    </option>
                  ))}
              </select>
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
    </div>
  );
};

export default Publicnotice;
