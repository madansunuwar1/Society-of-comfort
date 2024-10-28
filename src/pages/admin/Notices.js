import React, { useState, useEffect } from "react";
import Select from "react-select"; // Import react-select
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addPublicNotice, addPrivateNotice } from "../../redux/noticeSlice";
import { fetchResidences } from "../../redux/userSlice";
import { notification } from "antd"; // Import notification from antd

const Notices = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = JSON.parse(localStorage.getItem("user"));
  const { residences, loading } = useSelector((state) => state.user);

  const [noticeType, setNoticeType] = useState("public"); // Toggle between public and private notice
  const [formData, setFormData] = useState({
    title: "",
    notice_body: "",
    users: [2],
    user_id: user.user.id,
    notice_type: noticeType,
    residence_id: [], // Only used for private notice
  });

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
  };

  const handleResidenceChange = (selectedOptions) => {
    const selectedIds = selectedOptions
      ? selectedOptions.map((option) => option.value)
      : [];
    setFormData((prevFormData) => ({
      ...prevFormData,
      residence_id: selectedIds,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const action = noticeType === "public" ? addPublicNotice : addPrivateNotice;

    dispatch(action(formData))
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
        // Use antd notification for error
        notification.error({
          message: "Error",
          description: "Network request failed. Please try again.",
        });
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
              className="rounded-md py-3 px-4 w-full border-[2px] border-gray-400 mt-2"
              type="text"
              name="title"
              placeholder="Notice Title"
              value={formData.title}
              onChange={handleInputChange}
            />
          </div>
          <div className="pt-6">
            <label className="font-bold text-md">Notice Description</label>
            <textarea
              className="rounded-md w-full py-4 px-4 border-[2px] border-gray-400 mt-2"
              name="notice_body"
              placeholder="Notice Description"
              value={formData.notice_body}
              onChange={handleInputChange}
            />
          </div>

          {noticeType === "private" && (
            <div className="pt-6">
              <label className="font-bold text-md">Select Residences</label>
              <Select
                isMulti
                isDisabled={loading}
                options={
                  !loading &&
                  residences?.data?.map((residence) => ({
                    value: residence.id,
                    label: residence.name,
                  }))
                }
                value={formData.residence_id.map((id) => ({
                  value: id,
                  label: residences?.data?.find((res) => res.id === id)?.name,
                }))}
                onChange={handleResidenceChange}
                className="mt-2"
              />
            </div>
          )}

          <button
            type="submit"
            className="bg-[#403F93] text-white flex px-16 py-3 rounded-lg mt-6"
          >
            Send Notice
          </button>
        </form>
      </div>
    </div>
  );
};

export default Notices;
