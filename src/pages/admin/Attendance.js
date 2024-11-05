import React, { useState, useEffect } from "react";
import api from "../../utils/api"; // Adjust the path according to your file structure
import Select from "react-select"; // Importing the Select component
import { useDispatch, useSelector } from "react-redux";
import { fetchResidences } from "../../redux/userSlice"; // Adjust the import according to your file structure

const Attendance = () => {
  const dispatch = useDispatch();
  const { residences, loading } = useSelector((state) => state.user); // Assuming loading and residences data are fetched and stored in redux
  const [students, setStudents] = useState([]);
  const [selectedResidence, setSelectedResidence] = useState(null); // For selected residence
  const [startTime, setStartTime] = useState(""); // Start time input
  const [endTime, setEndTime] = useState(""); // End time input
  const [isSending, setIsSending] = useState(false); // To manage sending state

  // Error states
  const [errors, setErrors] = useState({
    residence: "",
    startTime: "",
    endTime: "",
  });

  // Fetch attendance data from the API
  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const response = await api.get("/attendances");
        setStudents(response.data);
      } catch (error) {
        console.error("Error fetching attendance data:", error);
      }
    };

    fetchAttendance();
    dispatch(fetchResidences()); // Fetch residences on component mount
  }, [dispatch]);

  const handleResidenceChange = (selectedOption) => {
    setSelectedResidence(selectedOption); // Update state with selected residence
    setErrors((prevErrors) => ({ ...prevErrors, residence: "" })); // Clear residence error
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      residence: "",
      startTime: "",
      endTime: "",
    };

    if (!selectedResidence) {
      newErrors.residence = "Please select a residence.";
      isValid = false;
    }

    if (!startTime) {
      newErrors.startTime = "Start time is required.";
      isValid = false;
    }

    if (!endTime) {
      newErrors.endTime = "End time is required.";
      isValid = false;
    } else if (new Date(endTime) <= new Date(startTime)) {
      newErrors.endTime = "End time must be after start time.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSending(true); // Set sending state to true

    if (!validateForm()) {
      setIsSending(false);
      return; // Prevent submission if validation fails
    }

    const userId = selectedResidence.value; // Get selected user ID

    const formatDate = (dateString) => {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
      const day = String(date.getDate()).padStart(2, "0");
      let hours = date.getHours();
      const minutes = String(date.getMinutes()).padStart(2, "0");
      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12; // Convert to 12-hour format
      hours = hours ? String(hours).padStart(2, "0") : "12"; // Hour '0' should be '12'

      return `${year}-${month}-${day} ${hours}:${minutes} ${ampm}`;
    };

    const payload = {
      user_id: userId, // Wrap in an array if userId is not null
      start_time: formatDate(startTime),
      end_time: formatDate(endTime),
    };

    try {
      await api.post("/attendances", payload);
      // Reset form fields after successful submission
      setSelectedResidence(null);
      setStartTime("");
      setEndTime("");
      setErrors({ residence: "", startTime: "", endTime: "" }); // Clear errors
    } catch (error) {
      console.error("Error submitting attendance:", error);
    } finally {
      setIsSending(false); // Reset sending state
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Attendance</h2>

      {/* Form for attendance submission */}
      <form onSubmit={handleSubmit} className="">
        <div className="flex flex-col gap-2 w-full">
          <label>Select month</label>
          <Select
            isMulti={false} // Change to single select
            isDisabled={loading || isSending} // Disable Select when loading or sending
            options={
              !loading &&
              residences?.data?.map((residence) => ({
                value: residence.id,
                label: residence.name,
              }))
            }
            value={selectedResidence} // Using the selected residence state
            onChange={handleResidenceChange} // Update state on change
            className="rounded-md w-full border-[2px] border-gray-400 mt-2"
          />
          {errors.residence && (
            <p className="text-red-500">{errors.residence}</p>
          )}
        </div>

        <div className="flex gap-4 mt-4">
          <div className="flex flex-col gap-2 w-full">
            <label>Select month</label>
            <input
              type="datetime-local"
              value={startTime}
              onChange={(e) => {
                setStartTime(e.target.value);
                setErrors((prevErrors) => ({ ...prevErrors, startTime: "" })); // Clear error
              }}
              className="rounded-md w-full py-4 px-4 border-[2px] border-gray-400 mt-2"
              required
            />
            {errors.startTime && (
              <p className="text-red-500">{errors.startTime}</p>
            )}
          </div>

          <div className="flex flex-col gap-2 w-full">
            <label>Select month</label>

            <input
              type="datetime-local"
              value={endTime}
              onChange={(e) => {
                setEndTime(e.target.value);
                setErrors((prevErrors) => ({ ...prevErrors, endTime: "" })); // Clear error
              }}
              className="rounded-md w-full py-4 px-4 border-[2px] border-gray-400 mt-2"
              required
            />
            {errors.endTime && <p className="text-red-500">{errors.endTime}</p>}
          </div>
        </div>
        <div className="my-8">
          <button
            type="submit"
            className="bg-[#403F93] text-white flex px-24 py-3 rounded-md mt-6"
          >
            Submit Attendance
          </button>
        </div>
      </form>
      <div className="pt-8">
        <h1 className="text-xl font-semibold mb-4">Payment List</h1>
        <div className="overflow-x-auto min-w-full">
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border border-gray-300">id</th>
                <th className="py-2 px-4 border border-gray-300">Name</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id} className="border-t">
                  <td className="py-2 px-4 text-center border border-gray-300">
                    {student.id}
                  </td>
                  <td className="py-2 px-4 text-center border border-gray-300">
                    {student.name}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Attendance;
