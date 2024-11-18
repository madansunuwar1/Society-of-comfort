import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addUser } from "../../redux/userSlice";
import { notification } from "antd";

const AddUser = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.user);

  const [houseNumber, setHouseNumber] = useState("");
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [emergencyContact, setEmergencyContact] = useState("");
  const [media, setMedia] = useState(null);
  const [leaseStartDate, setLeaseStartDate] = useState("");
  const [notes, setNotes] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const validateFields = () => {
    const errors = {};
    if (!houseNumber.trim()) errors.houseNumber = "House number is required";
    if (!name.trim()) errors.name = "Name is required";
    if (!phoneNumber.trim()) errors.phoneNumber = "Phone number is required";

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFileChange = (e) => {
    setMedia(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateFields()) {
      return; // Stop if validation fails
    }

    const formData = new FormData();
    formData.append("house_number", houseNumber);
    formData.append("name", name);
    formData.append("phone_number", phoneNumber);
    if (email) formData.append("email", email);
    if (emergencyContact)
      formData.append("emergency_contact", emergencyContact);
    if (media) formData.append("media", media);
    if (leaseStartDate) formData.append("lease_start_date", leaseStartDate);
    if (notes) formData.append("notes", notes);

    dispatch(addUser(formData))
      .unwrap()
      .then(() => {
        notification.success({
          message: "Success",
          description: "User added successfully",
        });
        navigate("/dashboard/userlist"); // Redirect on success
      })
      .catch((err) => {
        console.error("Failed to add user:", err);
        notification.error({
          message: "Error",
          description: err?.errors,
        });
      });
  };

  return (
    <div className="pb-20 mx-6">
      <h3 className="font-bold flex text-[22px]">Add User</h3>
      <div className="bg-gray-300 rounded-lg p-4">
        <div className="py-6 bg-white rounded-lg m-3 p-4">
          <form onSubmit={handleSubmit} className="flex flex-col gap-2">
            <div>
              <label className="font-bold text-md">House Number</label>
              <input
                className="rounded-md py-3 px-4 w-full border-[2px] border-gray-400 mt-2"
                type="text"
                placeholder="House Number"
                value={houseNumber}
                onChange={(e) => setHouseNumber(e.target.value)}
                required
              />
              {fieldErrors.houseNumber && (
                <p className="text-red-500">{fieldErrors.houseNumber}</p>
              )}
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
              {fieldErrors.name && (
                <p className="text-red-500">{fieldErrors.name}</p>
              )}
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
              {fieldErrors.phoneNumber && (
                <p className="text-red-500">{fieldErrors.phoneNumber}</p>
              )}
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

            {error && <p className="text-red-500">{error}</p>}
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
