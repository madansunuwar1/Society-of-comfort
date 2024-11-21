import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SlArrowLeft } from "react-icons/sl";
import { FiEdit } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import imagePlaceholder from "../svg/bg.jpg";
import { editProfile } from "../redux/authSlice";

const Profileedit = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = JSON.parse(localStorage.getItem("user"));
  const id = user.user.id;

  const { loading, error } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({
    name: "",
    phone_number: "",
    email: "",
  });
  const [previewImage, setPreviewImage] = useState(
    user.profile_picture_url || imagePlaceholder
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    if (user.user) {
      setFormData({
        name: user.user.name,
        phone_number: user.user.phone_number,
        email: user.user.email,
      });
      setPreviewImage(user.profile_picture_url || imagePlaceholder);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file); // Set the selected image
      setPreviewImage(URL.createObjectURL(file)); // Preview the image
    }
  };

  const handleNavigation = () => {
    navigate(-1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("phone_number", formData.phone_number);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("_method", "PUT");

    const result = await dispatch(
      editProfile({ userId: id, userData: formDataToSend })
    );

    if (editProfile.fulfilled.match(result)) {
      alert("Profile updated successfully");
      const updatedUser = { ...user, user: { ...user.user, ...formData } };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      navigate(-1);
    } else {
      alert(result.payload || "Profile update failed");
    }
  };

  const handlePictureSubmit = async () => {
    if (!selectedImage) {
      alert("Please select a picture to upload.");
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("name", user.user.name);
    formDataToSend.append("phone_number", user.user.phone_number);
    formDataToSend.append("email", user.user.email);
    formDataToSend.append("image", selectedImage);
    formDataToSend.append("_method", "PUT");

    const result = await dispatch(
      editProfile({ userId: id, userData: formDataToSend })
    );

    if (editProfile.fulfilled.match(result)) {
      alert("Profile picture updated successfully");
      setIsModalOpen(false); // Close the modal on success
      navigate(0); // Reload the page to reflect changes
    } else {
      alert(result.payload || "Profile picture update failed");
    }
  };

  return (
    <div className="flex justify-center bg-slate-800 w-[100%] h-[100vh]">
      <div className="w-[390px] bg-slate-200 pb-20">
        <div className="flex font-roboto px-6 py-4 bg-white">
          <div className="items-center my-auto">
            <button onClick={handleNavigation}>
              <SlArrowLeft />
            </button>
          </div>
          <h3 className="font-bold flex justify-center mx-auto text-[22px]">
            Edit Profile
          </h3>
        </div>
        <div className="px-6">
          <div className="relative flex justify-center py-5">
            <img
              src={previewImage}
              alt="Profile"
              className="h-32 w-32 rounded-full object-cover"
            />
            <button
              className="absolute bottom-0 right-0 bg-blue-500 p-2 rounded-full cursor-pointer"
              onClick={() => setIsModalOpen(true)}
            >
              <FiEdit className="text-white" />
            </button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6 mt-6">
              <div className="flex justify-between">
                <label className="my-auto">Name:</label>
                <input
                  name="name"
                  className="rounded-xl py-2 px-4 shadow-slate-400 shadow-sm"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              <div className="flex justify-between">
                <label className="my-auto">Phone no:</label>
                <input
                  name="phone_number"
                  className="rounded-xl py-2 px-4 shadow-slate-400 shadow-sm"
                  value={formData.phone_number}
                  onChange={handleChange}
                />
              </div>
              <div className="flex justify-between">
                <label className="my-auto">Email:</label>
                <input
                  name="email"
                  className="rounded-xl py-2 px-4 shadow-slate-400 shadow-sm"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div className="flex justify-center pt-4">
                <button
                  type="submit"
                  className="bg-blue-500 text-white rounded-xl py-2 px-4"
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>
              {error && (
                <div className="text-red-500 text-center pt-2">{error}</div>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Modal for updating profile picture */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-[300px]">
            <h2 className="text-center text-lg font-semibold mb-4">
              Update Profile Picture
            </h2>
            <div className="flex justify-center mb-4">
              <img
                src={previewImage}
                alt="Preview"
                className="h-32 w-32 rounded-full object-cover"
              />
            </div>
            <input type="file" accept="image/*" onChange={handleFileChange} />
            <div className="flex justify-between mt-4">
              <button
                className="bg-green-500 text-white rounded-lg py-2 px-4"
                onClick={handlePictureSubmit}
              >
                {loading ? "Uploading..." : "Update"}
              </button>
              <button
                className="bg-red-500 text-white rounded-lg py-2 px-4"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profileedit;
