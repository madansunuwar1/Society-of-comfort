import React, { useState, useEffect } from "react";
import Select from "react-select"; // Import react-select
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addPublicNotice, addPrivateNotice } from "../../redux/noticeSlice";
import { fetchResidences } from "../../redux/userSlice";
import { notification } from "antd"; // Import notification from antd
import api from "../../utils/api";

const Notices = (fcmToken) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = JSON.parse(localStorage.getItem("user"));
  const { residences, loading } = useSelector((state) => state.user);
  const [noticeType, setNoticeType] = useState("public"); // Toggle between public and private notice
  const [formData, setFormData] = useState({
    title: "",
    notice_body: "",
    user_id: user.user.id,
    notice_type: noticeType,
    users: [], // Only used for private notice
  });
  const [errors, setErrors] = useState({}); // State for form validation errors
  const [isSending, setIsSending] = useState(false); // State for sending status

  useEffect(() => {
    if (noticeType === "private") {
      dispatch(fetchResidences());
    }
  }, [dispatch, noticeType]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: null })); // Clear error for changed field
  };

  const handleResidenceChange = (selectedOptions) => {
    const selectedIds = selectedOptions
      ? selectedOptions.map((option) => String(option.value))
      : [];
    setFormData((prevFormData) => ({
      ...prevFormData,
      users: selectedIds,
    }));
    setErrors((prevErrors) => ({ ...prevErrors, users: null })); // Clear error for residence selection
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title) {
      newErrors.title = "Title is required.";
    }
    if (!formData.notice_body) {
      newErrors.notice_body = "Notice description is required.";
    }
    if (noticeType === "private" && formData.users.length === 0) {
      newErrors.users = "At least one residence must be selected.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  const notificationData = {
    token: fcmToken,
    title: "new notification",
    body: "Public notice sent",
  };

  const notificationData1 = {
    token: fcmToken,
    title: "new notification",
    body: "Private notice sent",
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return; // Stop submission if validation fails
    }

    const action = noticeType === "public" ? addPublicNotice : addPrivateNotice;

    const submissionData = {
      ...formData,
      users: formData.users,
    };

    console.log("Submission Data:", submissionData);

    setIsSending(true); // Set sending state to true

    dispatch(action(submissionData))
      .unwrap()
      .then(() => {
        // Use antd notification for success
        notification.success({
          message: `${
            noticeType.charAt(0).toUpperCase() + noticeType.slice(1)
          } Notice Sent`,
          description: `${
            noticeType.charAt(0).toUpperCase() + noticeType.slice(1)
          } notice sent successfully.`,
        });
        navigate("/dashboard");
      })
      .catch((error) => {
        console.error("Error:", error);
        // Check if the error has a message from the backend
        if (error.error) {
          // Display the error message from the backend
          notification.error({
            message: "Validation Error",
            description: error.error,
          });
        } else {
          // Use antd notification for other errors
          notification.error({
            message: "Error",
            description: "Network request failed. Please try again.",
          });
        }
      })
      .finally(() => {
        setIsSending(false); // Reset sending state after completion
      });
  };

  return (
    <div className="bg-white pb-20 pt-8 mx-6">
      <div className="flex space-x-4">
        <button
          className={`px-4 py-2 ${
            noticeType === "public" ? "bg-[#403F93] text-white" : "bg-gray-300"
          }`}
          onClick={() => setNoticeType("public")}
        >
          Public Notice
        </button>
        <button
          className={`px-4 py-2 ${
            noticeType === "private" ? "bg-[#403F93] text-white" : "bg-gray-300"
          }`}
          onClick={() => setNoticeType("private")}
        >
          Private Notice
        </button>
      </div>

      <div className="py-6 min-h-[100vh]">
        <h3 className="font-bold text-[22px] mb-4">
          {noticeType === "public"
            ? "Send Public Notice"
            : "Send Private Notice"}
        </h3>
        <form onSubmit={handleSubmit}>
          <div>
            <label className="font-bold text-md">Notice Title</label>
            <input
              className={`rounded-md py-3 px-4 w-full border-[2px] border-gray-400 mt-2 ${
                errors.title ? "border-red-500" : ""
              }`}
              type="text"
              name="title"
              placeholder="Notice Title"
              value={formData.title}
              onChange={handleInputChange}
              disabled={isSending} // Disable input when sending
            />
            {errors.title && (
              <p className="text-red-500 text-sm">{errors.title}</p>
            )}
          </div>
          <div className="pt-6">
            <label className="font-bold text-md">Notice Description</label>
            <textarea
              className={`rounded-md w-full py-4 px-4 border-[2px] border-gray-400 mt-2 ${
                errors.notice_body ? "border-red-500" : ""
              }`}
              name="notice_body"
              placeholder="Notice Description"
              value={formData.notice_body}
              onChange={handleInputChange}
              disabled={isSending} // Disable input when sending
            />
            {errors.notice_body && (
              <p className="text-red-500 text-sm">{errors.notice_body}</p>
            )}
          </div>

          {noticeType === "private" && (
            <div className="pt-6">
              <label className="font-bold text-md">Select Residences</label>
              <Select
                isMulti
                isDisabled={loading || isSending} // Disable Select when loading or sending
                options={
                  !loading &&
                  residences?.data?.map((residence) => ({
                    value: residence.id,
                    label: residence.name,
                  }))
                }
                value={residences?.data
                  ?.filter((residence) =>
                    formData.users.includes(residence.id.toString())
                  )
                  .map((residence) => ({
                    value: residence.id,
                    label: residence.name,
                  }))}
                onChange={handleResidenceChange}
                className="mt-2"
              />
              {errors.users && (
                <p className="text-red-500 text-sm">{errors.users}</p>
              )}
            </div>
          )}

          <button
            type="submit"
            className="bg-[#403F93] text-white flex px-16 py-3 rounded-lg mt-6"
            disabled={isSending} // Disable button when sending
          >
            {isSending ? "Sending..." : "Send Notice"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Notices;
