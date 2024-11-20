import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addUser } from "../../redux/userSlice";
import { getHouseSettings } from "../../redux/houseSettingsSlice";
import { notification, Form, Input, Select } from "antd";

const AddUser = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.user);
  const { houseSettings } = useSelector((state) => state.houseSettings);

  const [houseNumber, setHouseNumber] = useState("");
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [emergencyContact, setEmergencyContact] = useState("");
  const [media, setMedia] = useState(null);
  const [leaseStartDate, setLeaseStartDate] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    dispatch(getHouseSettings()); // Fetch house settings
  }, [dispatch]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setMedia(e.target.files[0]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("house_id", houseNumber);
    formData.append("name", name);
    formData.append("phone_number", phoneNumber);
    if (email) formData.append("email", email);
    if (emergencyContact)
      formData.append("emergency_contact", emergencyContact);
    if (media) {
      console.log("Media file selected:", media); // Debugging
      formData.append("media", media);
    }
    if (leaseStartDate) formData.append("lease_start_date", leaseStartDate);
    if (notes) formData.append("notes", notes);

    dispatch(addUser(formData))
      .unwrap()
      .then(() => {
        notification.success({
          message: "Success",
          description: "User added successfully",
        });
      })
      .catch((err) => {
        notification.error({
          message: "Error",
          description: String(err?.message),
        });
      });
    navigate("/dashboard/userlist");
  };

  return (
    <div className="pb-20 mx-6">
      <h3 className="font-bold flex text-[22px]">Add User</h3>
      <div className="bg-gray-300 rounded-lg p-4">
        <div className="py-6 bg-white rounded-lg m-3 p-4">
          <form onSubmit={handleSubmit} className="flex flex-col gap-2">
            <label className="font-bold text-md">House Number</label>
            <div>
              <Select
                placeholder="Select House Number"
                value={houseNumber}
                onChange={(value) => setHouseNumber(value)}
                className="w-full"
              >
                {houseSettings?.map((house) => (
                  <Select.Option key={house.id} value={house.id}>
                    {house.house_number}
                  </Select.Option>
                ))}
              </Select>
            </div>
            <div>
              <label className="font-bold text-md">Name</label>
              <input
                className="rounded-md py-3 px-4 w-full border-[2px] border-gray-400 mt-2"
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="font-bold text-md">Phone Number</label>
              <input
                className="rounded-md py-3 px-4 w-full border-[2px] border-gray-400 mt-2"
                type="tel"
                placeholder="Phone Number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="font-bold text-md">Email (Optional)</label>
              <input
                className="rounded-md py-3 px-4 w-full border-[2px] border-gray-400 mt-2"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="font-bold text-md">
                Emergency Contact (Optional)
              </label>
              <input
                className="rounded-md py-3 px-4 w-full border-[2px] border-gray-400 mt-2"
                type="text"
                placeholder="Emergency Contact"
                value={emergencyContact}
                onChange={(e) => setEmergencyContact(e.target.value)}
              />
            </div>
            <div>
              <label className="font-bold text-md">Image (Optional)</label>
              <input
                type="file"
                onChange={handleFileChange}
                className="rounded-md py-3 px-4 w-full border-[2px] border-gray-400 mt-2 bg-white"
                accept=".jpg,.jpeg,.png,.pdf"
              />
            </div>
            <div>
              <label className="font-bold text-md">
                Lease Start Date (Optional)
              </label>
              <input
                type="date"
                className="rounded-md py-3 px-4 w-full border-[2px] border-gray-400 mt-2"
                value={leaseStartDate}
                onChange={(e) => setLeaseStartDate(e.target.value)}
              />
            </div>
            <div>
              <label className="font-bold text-md">Notes (Optional)</label>
              <textarea
                className="rounded-md w-full py-4 px-4 border-[2px] border-gray-400 mt-2"
                placeholder="Additional Notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows="4"
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
                {loading ? "Adding..." : "Add User"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddUser;
