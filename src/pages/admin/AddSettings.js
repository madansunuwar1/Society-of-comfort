import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { settingsActions } from "../../redux/settingsSlice";
import { notification } from "antd"; // Adjust the path as needed

const SettingsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [newSettingName, setNewSettingName] = useState(""); // New setting name
  const [newSettingValue, setNewSettingValue] = useState(""); // New setting value
  const [loading, setLoading] = useState(false); // Handle loading state

  // Handle Add Setting Submit
  const handleAddSetting = (e) => {
    e.preventDefault();
    setLoading(true); // Start loading when submitting

    // New setting object
    const newSetting = {
      setting_name: newSettingName,
      setting_value: newSettingValue,
    };

    // Dispatch to add the setting
    dispatch(settingsActions.addSettings(newSetting))
      .unwrap()
      .then(() => {
        notification.success({
          message: "Success",
          description: "Setting added successfully",
        });
        // Reset form fields
        setNewSettingName("");
        setNewSettingValue("");
        navigate("/dashboard/invoicesettings");
      })
      .catch((err) => {
        notification.error({
          message: "Error",
          description: err.message || "Failed to add setting",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="settings-page p-6">
      <h2 className="text-2xl font-bold mb-4">Add New Setting</h2>
      <form onSubmit={handleAddSetting} className="flex flex-col gap-2 mt-8">
        <div>
          <label className="font-bold text-md">Setting Name</label>
          <input
            className="rounded-md py-3 px-4 w-full border-[2px] border-gray-400 mt-2"
            type="text"
            value={newSettingName}
            onChange={(e) => setNewSettingName(e.target.value)}
            placeholder="Enter setting name"
            required
          />
        </div>

        <div>
          <label className="font-bold text-md">Setting Value</label>
          <input
            className="rounded-md py-3 px-4 w-full border-[2px] border-gray-400 mt-2"
            type="text"
            value={newSettingValue}
            onChange={(e) => setNewSettingValue(e.target.value)}
            placeholder="Enter setting value"
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
            {loading ? "Adding..." : "Add New Setting"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SettingsPage;
