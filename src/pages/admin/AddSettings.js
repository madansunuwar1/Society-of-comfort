import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { settingsActions } from "../../redux/settingsSlice"; // Adjust the path as needed

const SettingsPage = () => {
  const dispatch = useDispatch();

  // Local state for updating settings
  const [waterSupply, setWaterSupply] = useState("");
  const [internet, setInternet] = useState("");
  const [securityLevel, setSecurityLevel] = useState("");
  const [backupPower, setBackupPower] = useState("");
  const [loading, setLoading] = useState(false); // Handle loading state

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true); // Start loading when submitting

    // Update the settings in Redux state
    const updatedSettings = {
      water_supply_: waterSupply,
      internet,
      security_level: securityLevel,
      backup_power: backupPower,
    };

    dispatch(settingsActions.updateSettings(updatedSettings)).finally(() =>
      setLoading(false)
    ); // Stop loading after dispatch
  };

  return (
    <div className="settings-page p-6">
      <h2 className="text-2xl font-bold mb-4">Update Settings</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-2 mt-8">
        <div>
          <label className="font-bold text-md">Water Supply</label>
          <input
            className="rounded-md py-3 px-4 w-full border-[2px] border-gray-400 mt-2"
            type="text"
            value={waterSupply}
            onChange={(e) => setWaterSupply(e.target.value)}
            placeholder="Enter water supply status"
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
            placeholder="Enter internet status"
            required
          />
        </div>

        <div>
          <label className="font-bold text-md">Security Level</label>
          <input
            className="rounded-md py-3 px-4 w-full border-[2px] border-gray-400 mt-2"
            type="text"
            value={securityLevel}
            onChange={(e) => setSecurityLevel(e.target.value)}
            placeholder="Enter security level"
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
            placeholder="Enter backup power type"
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
