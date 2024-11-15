import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { houseSettingsActions } from "../../redux/houseSettingsSlice";
import { notification } from "antd"; // Adjust the path as needed

const AddHouseSettingPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [houseNumber, setHouseNumber] = useState(""); // House number field
  const [loading, setLoading] = useState(false); // Handle loading state

  // Handle Add House Setting Submit
  const handleAddHouseSetting = (e) => {
    e.preventDefault();
    setLoading(true); // Start loading when submitting

    // New house setting object
    const newHouseSetting = {
      house_number: houseNumber,
    };

    // Dispatch to add the house setting
    dispatch(houseSettingsActions.addHouseSetting(newHouseSetting))
      .unwrap()
      .then(() => {
        notification.success({
          message: "Success",
          description: "House setting added successfully",
        });
        // Reset form fields
        setHouseNumber("");
        navigate("/dashboard/houseSettings");
      })
      .catch((err) => {
        notification.error({
          message: "Error",
          description: err.error || "Failed to add house setting",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="add-house-setting-page p-6">
      <h2 className="text-2xl font-bold mb-4">Add New House Setting</h2>
      <form
        onSubmit={handleAddHouseSetting}
        className="flex flex-col gap-2 mt-8"
      >
        <div>
          <label className="font-bold text-md">House Number</label>
          <input
            className="rounded-md py-3 px-4 w-full border-[2px] border-gray-400 mt-2"
            type="text"
            value={houseNumber}
            onChange={(e) => setHouseNumber(e.target.value)}
            placeholder="Enter house number"
            required
          />
        </div>

        <div>
          <button
            type="submit"
            className={`bg-[#403F93] text-white flex px-24 py-3 rounded-md mt-6 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Adding..." : "Add New House Setting"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddHouseSettingPage;
