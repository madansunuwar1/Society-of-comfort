import React, { useState } from "react";
import { SlArrowLeft } from "react-icons/sl";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Pass = () => {
  const [formData, setFormData] = useState({
    name: "",
    vehicleno: "",
    vehicletype: "",
    deliveryOption: "",
    deliveryType: "",
    date: "",
    time: "",
    delivery: false,
  });

  const [errors, setErrors] = useState({});
  const [isSubmiting, setIsSubmiting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevformData) => ({
      ...prevformData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const navigate = useNavigate();
  const phone = 234234234234234;
  const number = phone.toString();
  const tok = 234324123213;
  const token = tok.toString();
  const userData = JSON.parse(localStorage.getItem("user"));
  const id = userData.user.id;
  const inv = userData.user.name;
  const { name, vehicleno, vehicletype, date, time } = formData;
  const url = `https://dev.waveplusit.com/api/passes`;
  const Bdata = {
    user_id: id,
    otp_code: undefined,
    fcm_token: token,
    date: date,
    visit_time: time,
    phone_number: number,
    vehicle_type: vehicletype,
    vehicle_number: vehicleno,
    status: 1,
    guest_name: name,
    invited_by: inv,
  };

  const handlesubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmiting(true);
      try {
        const response = await axios.post(url, Bdata);
        const data = response.data;
        alert("Pass generation successful");
        localStorage.setItem("nwedata", JSON.stringify(formData));
        localStorage.setItem("otp", JSON.stringify(data));
        navigate("/pass");
      } catch (error) {
        console.error("Error:", error);
        alert(error.response.data.message);
      } finally {
        setIsSubmiting(false);
      }
    }
  };

  const validateForm = () => {
    const errors = {};
    let isValid = true;

    if (!formData.name.trim()) {
      errors.name = "Name is required";
      isValid = false;
    }

    if (!formData.vehicleno.trim()) {
      errors.vehicleno = "Vehicle number is required";
      isValid = false;
    }

    if (!formData.vehicletype.trim()) {
      errors.vehicletype = "Vehicle type is required";
      isValid = false;
    }

    if (!formData.date) {
      errors.date = "Date is required";
      isValid = false;
    }

    if (!formData.time) {
      errors.time = "Time is required";
      isValid = false;
    }

    if (formData.delivery) {
      if (!formData.deliveryOption.trim()) {
        errors.deliveryOption = "Delivery option is required";
        isValid = false;
      }

      if (!formData.deliveryType.trim()) {
        errors.deliveryType = "Delivery type is required";
        isValid = false;
      }
    }

    setErrors(errors);
    return isValid;
  };

  return (
    <div className="flex justify-center bg-slate-800 w-[100%] h-[100vh]">
      <div className="w-[390px] bg-white mb-20">
        <div className="flex px-6 py-4">
          <div className="items-center my-auto">
            <Link to="/userdash">
              <SlArrowLeft />
            </Link>
          </div>
          <h3 className="font-bold flex justify-center mx-auto text-[22px]">
            Generate pass
          </h3>
        </div>
        <div className="bg-slate-200 px-6 pb-20 pt-6">
          <form className="flex flex-col gap-5" onSubmit={handlesubmit}>
            {/* <div className="flex gap-2 justify-end">
              <input
                type="checkbox"
                name="delivery"
                onChange={handleInputChange}
              ></input>
              <label>Delivery</label>
            </div> */}
            {!formData.delivery && (
              <>
                <input
                  className=" rounded-xl w-full py-4 px-4 shadow-slate-400 shadow-sm"
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={formData.name}
                  onChange={handleInputChange}
                ></input>
                {errors.name && (
                  <span className="text-red-500">{errors.name}</span>
                )}
                <select
                  className=" rounded-xl w-full py-4 px-4 bg-white"
                  type="text"
                  name="vehicletype"
                  placeholder="service"
                  value={formData.vehicletype}
                  onChange={handleInputChange}
                >
                  <option value="">Select a vehicle type</option>
                  <option value="Two wheller">Two wheller</option>
                  <option value="Four wheller">Four wheller</option>
                </select>
                {errors.vehicletype && (
                  <span className="text-red-500">{errors.vehicletype}</span>
                )}
                <input
                  className=" rounded-xl w-full py-4 px-4 shadow-slate-400 shadow-sm"
                  type="text"
                  placeholder="Vehicle number"
                  name="vehicleno"
                  value={formData.vehicleno}
                  onChange={handleInputChange}
                ></input>
                {errors.vehicleno && (
                  <span className="text-red-500">{errors.vehicleno}</span>
                )}
              </>
            )}
            {/* {formData.delivery && (
              <>
                <select
                  className=" rounded-xl w-full py-4 px-4 bg-white shadow-slate-400 shadow-sm"
                  type="text"
                  name="deliveryOption"
                  value={formData.deliveryOption}
                  onChange={handleInputChange}
                >
                  <option value="">Foodmandu</option>
                  <option value="standard">Pathao Food</option>
                  <option value="express">Bhoj Deals</option>
                  <option value="overnight">Daraz</option>
                </select>
                {errors.deliveryOption && (
                  <span className="text-red-500">{errors.deliveryOption}</span>
                )}
                <div className="flex items-start gap-10">
                  <div className="flex gap-2 justify-end">
                    <input
                      type="radio"
                      name="deliveryType"
                      value="indoor"
                      checked={formData.deliveryType === "indoor"}
                      onChange={handleInputChange}
                    />
                    <label>Indoor</label>
                  </div>
                  <div className="flex gap-2 justify-start">
                    <input
                      type="radio"
                      name="deliveryType"
                      value="outdoor"
                      checked={formData.deliveryType === "outdoor"}
                      onChange={handleInputChange}
                    />
                    <label>Outdoor</label>
                  </div>
                </div>
                {errors.deliveryType && (
                  <span className="text-red-500">{errors.deliveryType}</span>
                )}
              </>
            )} */}
            <div className="relative">
              <input
                className="rounded-xl w-full py-4 px-4 bg-white shadow-slate-400 shadow-sm text-slate-400"
                type="date"
                placeholder="Date"
                name="date"
                value={formData.date || "2024-05-02"}
                onChange={handleInputChange}
              ></input>
            </div>
            {errors.date && <span className="text-red-500">{errors.date}</span>}
            <input
              className="rounded-xl w-full py-4 px-4 bg-white shadow-slate-400 shadow-sm text-slate-400"
              type="time"
              placeholder="Time"
              name="time"
              value={formData.time || "12:00"}
              onChange={handleInputChange}
            ></input>
            {errors.time && <span className="text-red-500">{errors.time}</span>}
            <button
              type="submit"
              className="bg-[#403F93] text-white mx-auto flex px-24 py-3 rounded-3xl mt-6"
              disabled={isSubmiting}
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Pass;
