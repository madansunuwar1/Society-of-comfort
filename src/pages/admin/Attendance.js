import React, { useState, useEffect } from "react";
import api from "../../utils/api";
import Select from "react-select";
import { useDispatch, useSelector } from "react-redux";
import { fetchWorkers } from "../../redux/workerSlice";
import { Skeleton, Modal, Button } from "antd";
import { SolutionOutlined } from "@ant-design/icons"; // Import Modal from Ant Design

const Attendance = () => {
  const dispatch = useDispatch();
  const { workers, loading } = useSelector((state) => state.workers);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [isSending, setIsSending] = useState(false);

  // For modal visibility
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [errors, setErrors] = useState({
    worker: "",
    startTime: "",
    endTime: "",
  });

  // Fetch attendance data from the API
  useEffect(() => {
    dispatch(fetchWorkers());
  }, [dispatch]);

  const handleWorkerChange = (selectedOption) => {
    setSelectedWorker(selectedOption);
    setErrors((prevErrors) => ({ ...prevErrors, worker: "" }));
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      worker: "",
      startTime: "",
      endTime: "",
    };

    if (!selectedWorker) {
      newErrors.worker = "Please select a worker.";
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
    setIsSending(true);

    if (!validateForm()) {
      setIsSending(false);
      return;
    }

    const userId = selectedWorker.value;

    const formatDate = (dateString) => {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      let hours = date.getHours();
      const minutes = String(date.getMinutes()).padStart(2, "0");
      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12;
      hours = hours ? String(hours).padStart(2, "0") : "12";

      return `${year}-${month}-${day} ${hours}:${minutes} ${ampm}`;
    };

    const payload = {
      user_id: userId,
      start_time: formatDate(startTime),
      end_time: formatDate(endTime),
    };

    try {
      await api.post("/attendances", payload);
      setSelectedWorker(null);
      setStartTime("");
      setEndTime("");
      setErrors({ worker: "", startTime: "", endTime: "" });
      setIsModalVisible(false); // Close the modal on successful submit
    } catch (error) {
      console.error("Error submitting attendance:", error);
    } finally {
      setIsSending(false);
    }
  };

  const handleActionClick = (worker) => {
    setSelectedWorker({ value: worker.id, label: worker.name });
    setStartTime("");
    setEndTime("");
    setErrors({ worker: "", startTime: "", endTime: "" });
    setIsModalVisible(true); // Open modal when action is clicked
  };

  return (
    <div className="w-full bg-slate-200 p-6 pb-20 rounded-lg shadow-md">
      <div className="bg-white rounded-lg p-4">
        <div className="">
          <h2 className="text-2xl font-bold mb-4">Attendance</h2>
          <div className="bg-gray-200 p-5 rounded-lg">
            {loading ? (
              <div className="p-12">
                <Skeleton active />
              </div>
            ) : (
              <div className="bg-white p-4 rounded-lg overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="text-left">
                      <th className="py-2 px-4 border-r border-b border-gray-300">
                        ID
                      </th>
                      <th className="py-2 px-4 border-r border-b border-gray-300">
                        Name
                      </th>
                      <th className="py-2 px-4 border-b border-gray-300">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {workers.map((worker) => (
                      <tr key={worker.id} className="border-b hover:bg-gray-50">
                        <td className="py-2 px-4 border-r border-gray-300">
                          {worker.id}
                        </td>
                        <td className="py-2 px-4 border-r border-gray-300">
                          {worker.name}
                        </td>
                        <td className="py-2 px-4">
                          <Button
                            type="default"
                            className="bg-blue-800 text-white hover:bg-blue-600"
                            onClick={() => handleActionClick(worker)}
                            icon={<SolutionOutlined />}
                          ></Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Attendance Modal */}
        <Modal
          title={`Set Attendance for ${selectedWorker?.label}`}
          visible={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={null}
          destroyOnClose={true} // Ensure the form resets when modal is closed
        >
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2 w-full">
              <label>Worker</label>
              <p className="text-lg">{selectedWorker?.label}</p>{" "}
              {/* Display selected worker's name */}
              {errors.worker && <p className="text-red-500">{errors.worker}</p>}
            </div>

            <div className="flex gap-4 mt-4">
              <div className="flex flex-col gap-2 w-full">
                <label>Start Date Time</label>
                <input
                  type="datetime-local"
                  value={startTime}
                  onChange={(e) => {
                    setStartTime(e.target.value);
                    setErrors((prevErrors) => ({
                      ...prevErrors,
                      startTime: "",
                    }));
                  }}
                  className="rounded-md w-full py-4 px-4 border-[2px] border-gray-400 mt-2"
                  required
                />
                {errors.startTime && (
                  <p className="text-red-500">{errors.startTime}</p>
                )}
              </div>

              <div className="flex flex-col gap-2 w-full">
                <label>End Date Time</label>
                <input
                  type="datetime-local"
                  value={endTime}
                  onChange={(e) => {
                    setEndTime(e.target.value);
                    setErrors((prevErrors) => ({ ...prevErrors, endTime: "" }));
                  }}
                  className="rounded-md w-full py-4 px-4 border-[2px] border-gray-400 mt-2"
                  required
                />
                {errors.endTime && (
                  <p className="text-red-500">{errors.endTime}</p>
                )}
              </div>
            </div>
            <div className="my-8">
              <button
                type="submit"
                className="bg-[#403F93] text-white flex px-14 py-1 rounded-md mt-6"
              >
                Submit Attendance
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
};

export default Attendance;
