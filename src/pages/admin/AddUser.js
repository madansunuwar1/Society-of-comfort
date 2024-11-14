import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addUser } from "../../redux/userSlice";

const AddUser = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.user);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [leaseStartDate, setLeaseStartDate] = useState("");
  const [leaseEndDate, setLeaseEndDate] = useState("");
  const [emergencyContact, setEmergencyContact] = useState("");
  const [paymentInfo, setPaymentInfo] = useState("");
  const [notes, setNotes] = useState("");
  const [roleId, setRoleId] = useState(2);
  const [houseId, setHouseId] = useState("");
  const [media, setMedia] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  const validateFields = () => {
    const errors = {};
    if (!name.trim()) errors.name = "Name is required";
    if (!email.trim() || !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email))
      errors.email = "Valid email is required";
    if (!password || password.length < 8)
      errors.password = "Password must be at least 8 characters long";
    if (!phoneNumber.trim()) errors.phoneNumber = "Phone number is required";
    if (!leaseStartDate) errors.leaseStartDate = "Lease start date is required";
    if (!leaseEndDate) errors.leaseEndDate = "Lease end date is required";
    if (new Date(leaseStartDate) >= new Date(leaseEndDate))
      errors.leaseEndDate = "End date must be after start date";

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
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("phone_number", phoneNumber);
    formData.append("lease_start_date", leaseStartDate);
    formData.append("lease_end_date", leaseEndDate);
    formData.append("emergency_contact", emergencyContact);
    formData.append("payment_info", paymentInfo);
    formData.append("notes", notes);
    formData.append("role_id", roleId);
    formData.append("house_id", houseId);
    if (media) {
      formData.append("media", media);
    }

    // Dispatch addUser action with formData
    dispatch(addUser(formData))
      .unwrap()
      .then(() => {
        alert("User added successfully!");
        navigate("/dashboard/userlist"); // Redirect on success
      })
      .catch((err) => {
        console.error("Failed to add user:", err);
      });
  };

  return (
    <div className="pb-20 mx-6">
      <h3 className="font-bold flex text-[22px]">Add User</h3>
      <div className="bg-gray-300 rounded-lg p-4">
        <div className="py-6 bg-white rounded-lg m-3 p-4">
          <form onSubmit={handleSubmit} className="flex flex-col gap-2">
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
              <label className="font-bold text-md">Email</label>
              <input
                className="rounded-md py-3 px-4 w-full border-[2px] border-gray-400 mt-2"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              {fieldErrors.email && (
                <p className="text-red-500">{fieldErrors.email}</p>
              )}
            </div>
            <div>
              <label className="font-bold text-md">Password</label>
              <input
                className="rounded-md py-3 px-4 w-full border-[2px] border-gray-400 mt-2"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {fieldErrors.password && (
                <p className="text-red-500">{fieldErrors.password}</p>
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
              <label className="font-bold text-md">Lease Start Date</label>
              <input
                type="date"
                className="rounded-md py-3 px-4 w-full border-[2px] border-gray-400 mt-2"
                value={leaseStartDate}
                onChange={(e) => setLeaseStartDate(e.target.value)}
                required
              />
              {fieldErrors.leaseStartDate && (
                <p className="text-red-500">{fieldErrors.leaseStartDate}</p>
              )}
            </div>
            <div>
              <label className="font-bold text-md">Lease End Date</label>
              <input
                type="date"
                className="rounded-md py-3 px-4 w-full border-[2px] border-gray-400 mt-2"
                value={leaseEndDate}
                onChange={(e) => setLeaseEndDate(e.target.value)}
                required
              />
              {fieldErrors.leaseEndDate && (
                <p className="text-red-500">{fieldErrors.leaseEndDate}</p>
              )}
            </div>
            <div>
              <label className="font-bold text-md">Image</label>
              <input
                type="file"
                onChange={handleFileChange}
                className="rounded-md py-3 px-4 w-full border-[2px] border-gray-400 mt-2 bg-white"
                accept=".jpg,.jpeg,.png,.pdf"
              />
            </div>
            <div>
              <label className="font-bold text-md">Emergency Contact</label>
              <input
                className="rounded-md py-3 px-4 w-full border-[2px] border-gray-400 mt-2"
                type="text"
                placeholder="Emergency Contact"
                value={emergencyContact}
                onChange={(e) => setEmergencyContact(e.target.value)}
              />
            </div>
            <div>
              <label className="font-bold text-md">Payment Info</label>
              <input
                className="rounded-md py-3 px-4 w-full border-[2px] border-gray-400 mt-2"
                type="text"
                placeholder="Payment Info"
                value={paymentInfo}
                onChange={(e) => setPaymentInfo(e.target.value)}
              />
            </div>
            <div>
              <label className="font-bold text-md">Notes</label>
              <textarea
                className="rounded-md w-full py-4 px-4 border-[2px] border-gray-400 mt-2"
                placeholder="Additional Notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows="4"
              />
            </div>
            <div>
              <label className="font-bold text-md">Role ID</label>
              <input
                className="rounded-md py-3 px-4 w-full border-[2px] border-gray-400 mt-2"
                type="number"
                placeholder="Role ID"
                value={roleId}
                onChange={(e) => setRoleId(parseInt(e.target.value))}
              />
            </div>
            <div>
              <label className="font-bold text-md">House ID</label>
              <input
                className="rounded-md py-3 px-4 w-full border-[2px] border-gray-400 mt-2"
                type="text"
                placeholder="House ID"
                value={houseId}
                onChange={(e) => setHouseId(e.target.value)}
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
