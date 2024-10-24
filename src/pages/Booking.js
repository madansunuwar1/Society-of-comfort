import React, { useState } from "react";
import { SlArrowLeft } from "react-icons/sl";
import { Link, useNavigate } from "react-router-dom";
import Select from "react-select";

const Booking = () => {
  const navigate = useNavigate();
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [isOptionSelected, setIsOptionSelected] = useState(false);

  const options = [
    { value: "Catering", label: "Catering", available: true },
    { value: "Hall", label: "Hall", available: false },
    { value: "Pool", label: "Pool", available: true },
  ];

  const handleChange = (selected) => {
    setSelectedOptions(selected);
    setIsOptionSelected(selected && selected.length > 0);
  };

  const handlesubmit = () => {
    alert(
      "bokking sucessfull your booking ends at 12:00 monday if you want to extend the time inform before it ends"
    );
    navigate("/userdash");
  };

  const formatOptionLabel = ({ label, available }) => (
    <div className="flex justify-between">
      <span>{label}</span>
      {!isOptionSelected && (
        <span style={{ color: available ? "green" : "red" }}>
          {available ? "Available" : "Unavailable"}
        </span>
      )}
    </div>
  );
  return (
    <div className="flex justify-center bg-slate-800 w-[100%] h-[100vh]">
      <div className="w-[390px] bg-white pb-20">
        <div className="flex px-6 py-4">
          <div className="items-center my-auto">
            <Link to="/userdash">
              <SlArrowLeft />
            </Link>
          </div>
          <h3 className="font-bold flex justify-center mx-auto text-[22px]">
            Booking
          </h3>
        </div>
        <div className="bg-slate-200 px-6 py-6">
          <form>
            <div>
              <label htmlFor="booking">Choose Your booking item</label>
              <Select
                className=""
                id="booking"
                name="bookig"
                options={options.map((option) => ({
                  ...option,
                  isDisabled: !option.available,
                }))}
                isMulti
                value={selectedOptions}
                onChange={handleChange}
                formatOptionLabel={formatOptionLabel}
              />
            </div>
            <h1 className="text-xl mt-5 font-bold text-[#403F93]">
              Start time
            </h1>
            <div className="mt-4">
              <input
                className="rounded-xl w-full py-4 px-4 bg-white shadow-slate-400 shadow-sm text-slate-400"
                type="date"
                placeholder="Date"
                name="date"
                value="2024-05-02"
              ></input>
            </div>
            <div div className="mt-4">
              <input
                className="rounded-xl w-full py-4 px-4 bg-white shadow-slate-400 shadow-sm text-slate-400"
                type="time"
                placeholder="Time"
                name="time"
                value="12:00"
              ></input>
            </div>
            <h1 className="text-xl mt-5 font-bold text-[#403F93]">End time</h1>
            <div className="mt-4">
              <input
                className="rounded-xl w-full py-4 px-4 bg-white shadow-slate-400 shadow-sm text-slate-400"
                type="date"
                placeholder="Date"
                name="date"
                value="2024-05-02"
              ></input>
            </div>
            <div div className="mt-4">
              <input
                className="rounded-xl w-full py-4 px-4 bg-white shadow-slate-400 shadow-sm text-slate-400"
                type="time"
                placeholder="Time"
                name="time"
                value="12:00"
              ></input>
            </div>
            <button
              type="submit"
              className="bg-[#403F93] text-white mx-auto flex px-24 py-3 rounded-3xl mt-6"
              onClick={handlesubmit}
            >
              Book
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Booking;
