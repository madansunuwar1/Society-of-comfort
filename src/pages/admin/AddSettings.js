import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { settingsActions } from "../../redux/settingsSlice";
import { useNavigate } from "react-router-dom";
import { notification } from "antd"; // Adjust the path as needed

const SettingsPage = () => {
  const dispatch = useDispatch();
  const { settings, error } = useSelector((state) => state.settings); // New state for add modal
  const [waterSupply, setWaterSupply] = useState("");
  const [internet, setInternet] = useState("");
  const [securityLevel, setSecurityLevel] = useState("");
  const [backupPower, setBackupPower] = useState("");
  const [loading, setLoading] = useState(false); // Handle loading state\
  const navigate = useNavigate();

  useEffect(() => {
    // Dispatch to get settings when the component mounts
    dispatch(settingsActions.getSettings());
  }, [dispatch]);

  useEffect(() => {
    // Set form fields with default values when settings are fetched
    if (settings && settings.length > 0) {
      const waterSupplySetting = settings.find(
        (setting) => setting.setting_name === "water_supply_"
      );
      const internetSetting = settings.find(
        (setting) => setting.setting_name === "internet"
      );
      const securityLevelSetting = settings.find(
        (setting) => setting.setting_name === "security_level"
      );
      const backupPowerSetting = settings.find(
        (setting) => setting.setting_name === "backup_power"
      );

      if (waterSupplySetting) setWaterSupply(waterSupplySetting.setting_value);
      if (internetSetting) setInternet(internetSetting.setting_value);
      if (securityLevelSetting)
        setSecurityLevel(securityLevelSetting.setting_value);
      if (backupPowerSetting) setBackupPower(backupPowerSetting.setting_value);
    }
  }, [settings]); // Runs whenever `settings` changes

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true); // Start loading when submitting

    // Update the settings in Redux state
    const updatedSettings = {
      water_supply_: waterSupply,
      internet: internet,
      security_level: securityLevel,
      backup_power: backupPower,
    };

    dispatch(settingsActions.updateSettings(updatedSettings))
      .unwrap()
      .then(() => {
        notification.success({
          message: "Success",
          description: "Settings updated successfully",
        });
        navigate("/dashboard/settings");
      })
      .catch((err) => {
        notification.error({
          message: "Error",
          description: err.message || "Failed to update settings",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="settings-page p-6">
      <h2 className="text-2xl font-bold mb-4">Update Settings</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-2 mt-8">
        <div>
          <label className="font-bold text-md">Water bill</label>
          <input
            className="rounded-md py-3 px-4 w-full border-[2px] border-gray-400 mt-2"
            type="text"
            value={waterSupply}
            onChange={(e) => setWaterSupply(e.target.value)}
            placeholder="Enter water amount per unit"
            required
          />
        </div>

        <div>
          <label className="font-bold text-md">Internet</label>
          <input
            className="rounded-md py-3 px-4 w-full border-[2px] border-gray-400 mt-2"
            type="text"
            value={internet}
            onChange={(e) => setInternet(e.target.value)}
            placeholder="Enter internet fee"
            required
          />
        </div>

        <div>
          <label className="font-bold text-md">Security bill</label>
          <input
            className="rounded-md py-3 px-4 w-full border-[2px] border-gray-400 mt-2"
            type="text"
            value={securityLevel}
            onChange={(e) => setSecurityLevel(e.target.value)}
            placeholder="Enter security fee"
            required
          />
        </div>

        <div>
          <label className="font-bold text-md">Backup Power</label>
          <input
            className="rounded-md py-3 px-4 w-full border-[2px] border-gray-400 mt-2"
            type="text"
            value={backupPower}
            onChange={(e) => setBackupPower(e.target.value)}
            placeholder="Enter backup power fee"
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
            {loading ? "Updating..." : "Update Settings"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SettingsPage;
