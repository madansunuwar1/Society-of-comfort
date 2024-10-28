import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addPublicNotice, addPrivateNotice } from "../../redux/noticeSlice";
import { fetchResidences } from "../../redux/userSlice";

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

  const handleResidenceChange = (e) => {
    const selectedOptions = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setFormData((prevFormData) => ({
      ...prevFormData,
      residence_id: selectedOptions,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const action = noticeType === "public" ? addPublicNotice : addPrivateNotice;

    dispatch(action(formData))
      .unwrap()
      .then(() => {
        alert(
          `${
            noticeType.charAt(0).toUpperCase() + noticeType.slice(1)
          } notice sent successfully`
        );
        navigate("/dashboard");
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Network request failed");
      });
  };

  return (
    <div className="bg-white pb-20 pt-8">
      <div className="flex justify-center space-x-4">
        <button
          className={`px-4 py-2 ${
            noticeType === "public" ? "bg-blue-500 text-white" : "bg-gray-300"
          }`}
          onClick={() => setNoticeType("public")}
        >
          Public Notice
        </button>
        <button
          className={`px-4 py-2 ${
            noticeType === "private" ? "bg-blue-500 text-white" : "bg-gray-300"
          }`}
          onClick={() => setNoticeType("private")}
        >
          Private Notice
        </button>
      </div>

      <div className="px-6 py-6 min-h-[100vh] bg-slate-200">
        <h3 className="font-bold text-center text-[22px] mb-4">
          {noticeType === "public"
            ? "Send Public Notice"
            : "Send Private Notice"}
        </h3>
        <form onSubmit={handleSubmit}>
          <div>
            <input
              className="rounded-xl px-4 py-4 w-full shadow-md"
              type="text"
              name="title"
              placeholder="Notice Title"
              value={formData.title}
              onChange={handleInputChange}
            />
          </div>
          <div className="pt-6">
            <textarea
              className="rounded-xl w-full py-4 px-4 shadow-md"
              name="notice_body"
              placeholder="Notice"
              value={formData.notice_body}
              onChange={handleInputChange}
            />
          </div>

          {noticeType === "private" && (
            <div className="pt-6">
              <select
                className="rounded-xl w-full py-4 px-4 shadow-md"
                multiple
                value={formData.residence_id}
                onChange={handleResidenceChange}
              >
                {!loading &&
                  residences?.data?.map((residence) => (
                    <option key={residence.id} value={residence.id}>
                      {residence.name}
                    </option>
                  ))}
              </select>
            </div>
          )}

          <button
            type="submit"
            className="bg-[#403F93] text-white mx-auto flex px-24 py-3 rounded-3xl mt-6"
          >
            Send Notice
          </button>
        </form>
      </div>
    </div>
  );
};

export default Notices;
