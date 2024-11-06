import React, { useEffect, useState } from "react";
import { IoMdNotificationsOutline } from "react-icons/io";
import { SlArrowLeft } from "react-icons/sl";
import { Link, useNavigate } from "react-router-dom";
import { FaPlus } from "react-icons/fa6";
import Modal from "react-modal";
import axios from "axios";

const Service = ({ fcmToken }) => {
  const [isSubmiting, setIsSubmiting] = useState(false);
  const [isImageSelected, setIsImageSelected] = useState(false);
  const [imagePreviewUrl, setImagePreviewUrl] = useState("");
  const [prof, setProf] = useState([]);
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const [formData, setFormData] = useState({
    service: "electrician",
    block: "",
    apartment_number: "",
    remarks: "",
    profession_id: "",
    service_image: null,
  });

  const notificationData = {
    token: fcmToken,
    title: "new notification",
    body: "new service request has been registered",
  };

  const navigate = useNavigate();
  useEffect(() => {
    const fetchdata = async () => {
      const url = `https://dev.waveplusit.com/api/professions`;
      try {
        const response = await axios.get(url);
        console.log("response:", response);
        if (response.status === 200) {
          setProf(response.data.data.data);
        } else {
          throw new Error("network not ok");
        }
      } catch (error) {
        console.log("Error:", error);
        alert("Network request failed");
      }
    };
    fetchdata();
  }, []);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevformData) => ({
      ...prevformData,
      [name]: value,
    }));
  };

  const sendNotification = async () => {
    const url = "https://dev.waveplusit.com/api/send-notification";
    try {
      const response = await axios.post(url, notificationData, {
        headers: {
          Authorization: `Bearer 46|iFqnhf8aRRNQth2QVUqxnVWwsAU0pL9VvnMTyqv7deb18e2f`,
        },
      });
      console.log(response);
    } catch (error) {
      console.error("Error:", error);
      alert(error.response.data.message);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log("File selected:", file);
      setFormData((prevFormData) => ({
        ...prevFormData,
        service_image: file,
      }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviewUrl(reader.result);
        setIsImageSelected(true);
      };
      reader.readAsDataURL(file);
    }
    closeModal();
  };

  console.log(JSON.stringify(formData));
  const url = `https://dev.waveplusit.com/api/services`;
  const loggedInUser = JSON.parse(localStorage.getItem("user"));
  const id = loggedInUser.user.id;
  const ap_no = loggedInUser.user.apartment_number;
  const block = loggedInUser.user.block;

  const formDataToSend = new FormData();
  formDataToSend.append("service", formData.service);
  formDataToSend.append("block", block);
  formDataToSend.append("apartment_number", ap_no);
  formDataToSend.append("remarks", formData.remarks);
  formDataToSend.append("user_id", id);
  formDataToSend.append("profession_id", formData.profession_id);
  if (formData.service_image) {
    formDataToSend.append("service_image", formData.service_image);
  }
  console.log(formDataToSend);
  const handlesubmit = async (event) => {
    event.preventDefault();
    setIsSubmiting(true);
    try {
      const response = await axios.post(url, formDataToSend);
      console.log("Response:", response.data);
      if (response.status === 201) {
        alert("Service request successful");
        navigate("/userdash");
      } else {
        throw new Error("Network response not ok");
      }
    } catch (error) {
      console.log("Eroor:", error);
    } finally {
      setIsSubmiting(false);
      sendNotification();
    }
  };

  console.log(formData);

  return (
    <div className="flex justify-center bg-slate-800 w-[100%] h-[100vh]">
      <div className="w-[390px] bg-[#3F3F95] pb-20">
        <div className="flex px-6 py-4 justify-between">
          <div className="items-center my-auto">
            <Link to="/userdash">
              <SlArrowLeft className="text-white" />
            </Link>
          </div>
          <div className="items-center my-auto">
            <Link to="/userdash">
              <IoMdNotificationsOutline className="h-8 w-8 text-white" />
            </Link>
          </div>
        </div>
        <div className="bg-slate-200 mt-16 pb-48 rounded-t-3xl">
          <div className="px-6 py-6">
            <h1 className="font-bold text-[20px] mb-8">
              Let's find you services
            </h1>
            {/* <div className="grid grid-cols-5 gap-40 overflow-scroll py-3">
              <div className="w-[140px] h-[125px] bg-white flex flex-col justify-center items-center gap-4 rounded-lg">
                <svg
                  width="50"
                  height="50"
                  viewBox="0 0 50 50"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    width="50"
                    height="50"
                    rx="25"
                    fill="url(#paint0_linear_1_1083)"
                  />
                  <mask
                    id="mask0_1_1083"
                    maskUnits="userSpaceOnUse"
                    x="16"
                    y="16"
                    width="18"
                    height="18"
                  >
                    <rect x="16" y="16" width="18" height="18" fill="white" />
                  </mask>
                  <g mask="url(#mask0_1_1083)">
                    <path
                      d="M19.8999 18.25H19.7499C18.7524 18.2403 17.7929 18.6323 17.0876 19.3376C16.3822 20.043 15.9902 21.0025 15.9999 22C15.9938 22.9785 16.3707 23.9206 17.0499 24.625C16.3989 25.026 16.0017 25.7354 15.9999 26.5C15.9926 27.228 16.3611 27.9084 16.9749 28.3C16.8281 28.6832 16.7519 29.0897 16.7499 29.5C16.7402 30.4975 17.1322 31.457 17.8376 32.1624C18.5429 32.8678 19.5024 33.2597 20.4999 33.25C21.4974 33.2597 22.4569 32.8678 23.1623 32.1624C23.8677 31.457 24.2596 30.4975 24.2499 29.5V19C24.2609 18.4 24.0274 17.8213 23.603 17.3969C23.1787 16.9726 22.6 16.739 21.9999 16.75C21.0479 16.7391 20.1984 17.3459 19.8999 18.25Z"
                      fill="white"
                    />
                    <path
                      d="M33.9999 22C34.0096 21.0025 33.6176 20.043 32.9123 19.3376C32.2069 18.6323 31.2474 18.2403 30.2499 18.25H30.0999C29.8015 17.3459 28.9519 16.7391 27.9999 16.75C27.3999 16.739 26.8212 16.9726 26.3968 17.3969C25.9724 17.8213 25.7389 18.4 25.7499 19V29.5C25.7402 30.4975 26.1321 31.457 26.8375 32.1624C27.5429 32.8678 28.5024 33.2597 29.4999 33.25C30.4974 33.2597 31.4569 32.8678 32.1623 32.1624C32.8676 31.457 33.2596 30.4975 33.2499 29.5C33.2479 29.0897 33.1717 28.6832 33.0249 28.3C33.6387 27.9084 34.0072 27.228 33.9999 26.5C33.9982 25.7354 33.6009 25.026 32.9499 24.625C33.6291 23.9206 34.006 22.9785 33.9999 22Z"
                      fill="white"
                    />
                  </g>
                  <defs>
                    <linearGradient
                      id="paint0_linear_1_1083"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="50"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stopColor="#FE6587" />
                      <stop offset="1" stopColor="#F52D6A" />
                    </linearGradient>
                  </defs>
                </svg>
                <h1>Pharmacist</h1>
              </div>
              <div className="w-[140px] h-[125px] bg-white flex flex-col justify-center items-center gap-4 rounded-lg">
                <svg
                  width="50"
                  height="50"
                  viewBox="0 0 50 50"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    width="50"
                    height="50"
                    rx="25"
                    fill="url(#paint0_linear_1_1083)"
                  />
                  <mask
                    id="mask0_1_1083"
                    maskUnits="userSpaceOnUse"
                    x="16"
                    y="16"
                    width="18"
                    height="18"
                  >
                    <rect x="16" y="16" width="18" height="18" fill="white" />
                  </mask>
                  <g mask="url(#mask0_1_1083)">
                    <path
                      d="M19.8999 18.25H19.7499C18.7524 18.2403 17.7929 18.6323 17.0876 19.3376C16.3822 20.043 15.9902 21.0025 15.9999 22C15.9938 22.9785 16.3707 23.9206 17.0499 24.625C16.3989 25.026 16.0017 25.7354 15.9999 26.5C15.9926 27.228 16.3611 27.9084 16.9749 28.3C16.8281 28.6832 16.7519 29.0897 16.7499 29.5C16.7402 30.4975 17.1322 31.457 17.8376 32.1624C18.5429 32.8678 19.5024 33.2597 20.4999 33.25C21.4974 33.2597 22.4569 32.8678 23.1623 32.1624C23.8677 31.457 24.2596 30.4975 24.2499 29.5V19C24.2609 18.4 24.0274 17.8213 23.603 17.3969C23.1787 16.9726 22.6 16.739 21.9999 16.75C21.0479 16.7391 20.1984 17.3459 19.8999 18.25Z"
                      fill="white"
                    />
                    <path
                      d="M33.9999 22C34.0096 21.0025 33.6176 20.043 32.9123 19.3376C32.2069 18.6323 31.2474 18.2403 30.2499 18.25H30.0999C29.8015 17.3459 28.9519 16.7391 27.9999 16.75C27.3999 16.739 26.8212 16.9726 26.3968 17.3969C25.9724 17.8213 25.7389 18.4 25.7499 19V29.5C25.7402 30.4975 26.1321 31.457 26.8375 32.1624C27.5429 32.8678 28.5024 33.2597 29.4999 33.25C30.4974 33.2597 31.4569 32.8678 32.1623 32.1624C32.8676 31.457 33.2596 30.4975 33.2499 29.5C33.2479 29.0897 33.1717 28.6832 33.0249 28.3C33.6387 27.9084 34.0072 27.228 33.9999 26.5C33.9982 25.7354 33.6009 25.026 32.9499 24.625C33.6291 23.9206 34.006 22.9785 33.9999 22Z"
                      fill="white"
                    />
                  </g>
                  <defs>
                    <linearGradient
                      id="paint0_linear_1_1083"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="50"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stopColor="#FE6587" />
                      <stop offset="1" stopColor="#F52D6A" />
                    </linearGradient>
                  </defs>
                </svg>
                <h1>Plumber</h1>
              </div>
              <div className="w-[140px] h-[125px] bg-white flex flex-col justify-center items-center gap-4 rounded-lg">
                <svg
                  width="50"
                  height="50"
                  viewBox="0 0 50 50"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    width="50"
                    height="50"
                    rx="25"
                    fill="url(#paint0_linear_1_1083)"
                  />
                  <mask
                    id="mask0_1_1083"
                    maskUnits="userSpaceOnUse"
                    x="16"
                    y="16"
                    width="18"
                    height="18"
                  >
                    <rect x="16" y="16" width="18" height="18" fill="white" />
                  </mask>
                  <g mask="url(#mask0_1_1083)">
                    <path
                      d="M19.8999 18.25H19.7499C18.7524 18.2403 17.7929 18.6323 17.0876 19.3376C16.3822 20.043 15.9902 21.0025 15.9999 22C15.9938 22.9785 16.3707 23.9206 17.0499 24.625C16.3989 25.026 16.0017 25.7354 15.9999 26.5C15.9926 27.228 16.3611 27.9084 16.9749 28.3C16.8281 28.6832 16.7519 29.0897 16.7499 29.5C16.7402 30.4975 17.1322 31.457 17.8376 32.1624C18.5429 32.8678 19.5024 33.2597 20.4999 33.25C21.4974 33.2597 22.4569 32.8678 23.1623 32.1624C23.8677 31.457 24.2596 30.4975 24.2499 29.5V19C24.2609 18.4 24.0274 17.8213 23.603 17.3969C23.1787 16.9726 22.6 16.739 21.9999 16.75C21.0479 16.7391 20.1984 17.3459 19.8999 18.25Z"
                      fill="white"
                    />
                    <path
                      d="M33.9999 22C34.0096 21.0025 33.6176 20.043 32.9123 19.3376C32.2069 18.6323 31.2474 18.2403 30.2499 18.25H30.0999C29.8015 17.3459 28.9519 16.7391 27.9999 16.75C27.3999 16.739 26.8212 16.9726 26.3968 17.3969C25.9724 17.8213 25.7389 18.4 25.7499 19V29.5C25.7402 30.4975 26.1321 31.457 26.8375 32.1624C27.5429 32.8678 28.5024 33.2597 29.4999 33.25C30.4974 33.2597 31.4569 32.8678 32.1623 32.1624C32.8676 31.457 33.2596 30.4975 33.2499 29.5C33.2479 29.0897 33.1717 28.6832 33.0249 28.3C33.6387 27.9084 34.0072 27.228 33.9999 26.5C33.9982 25.7354 33.6009 25.026 32.9499 24.625C33.6291 23.9206 34.006 22.9785 33.9999 22Z"
                      fill="white"
                    />
                  </g>
                  <defs>
                    <linearGradient
                      id="paint0_linear_1_1083"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="50"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stopColor="#FE6587" />
                      <stop offset="1" stopColor="#F52D6A" />
                    </linearGradient>
                  </defs>
                </svg>
                <h1>Repair man</h1>
              </div>
              <div className="w-[140px] h-[125px] bg-white flex flex-col justify-center items-center gap-4 rounded-lg">
                <svg
                  width="50"
                  height="50"
                  viewBox="0 0 50 50"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    width="50"
                    height="50"
                    rx="25"
                    fill="url(#paint0_linear_1_1083)"
                  />
                  <mask
                    id="mask0_1_1083"
                    maskUnits="userSpaceOnUse"
                    x="16"
                    y="16"
                    width="18"
                    height="18"
                  >
                    <rect x="16" y="16" width="18" height="18" fill="white" />
                  </mask>
                  <g mask="url(#mask0_1_1083)">
                    <path
                      d="M19.8999 18.25H19.7499C18.7524 18.2403 17.7929 18.6323 17.0876 19.3376C16.3822 20.043 15.9902 21.0025 15.9999 22C15.9938 22.9785 16.3707 23.9206 17.0499 24.625C16.3989 25.026 16.0017 25.7354 15.9999 26.5C15.9926 27.228 16.3611 27.9084 16.9749 28.3C16.8281 28.6832 16.7519 29.0897 16.7499 29.5C16.7402 30.4975 17.1322 31.457 17.8376 32.1624C18.5429 32.8678 19.5024 33.2597 20.4999 33.25C21.4974 33.2597 22.4569 32.8678 23.1623 32.1624C23.8677 31.457 24.2596 30.4975 24.2499 29.5V19C24.2609 18.4 24.0274 17.8213 23.603 17.3969C23.1787 16.9726 22.6 16.739 21.9999 16.75C21.0479 16.7391 20.1984 17.3459 19.8999 18.25Z"
                      fill="white"
                    />
                    <path
                      d="M33.9999 22C34.0096 21.0025 33.6176 20.043 32.9123 19.3376C32.2069 18.6323 31.2474 18.2403 30.2499 18.25H30.0999C29.8015 17.3459 28.9519 16.7391 27.9999 16.75C27.3999 16.739 26.8212 16.9726 26.3968 17.3969C25.9724 17.8213 25.7389 18.4 25.7499 19V29.5C25.7402 30.4975 26.1321 31.457 26.8375 32.1624C27.5429 32.8678 28.5024 33.2597 29.4999 33.25C30.4974 33.2597 31.4569 32.8678 32.1623 32.1624C32.8676 31.457 33.2596 30.4975 33.2499 29.5C33.2479 29.0897 33.1717 28.6832 33.0249 28.3C33.6387 27.9084 34.0072 27.228 33.9999 26.5C33.9982 25.7354 33.6009 25.026 32.9499 24.625C33.6291 23.9206 34.006 22.9785 33.9999 22Z"
                      fill="white"
                    />
                  </g>
                  <defs>
                    <linearGradient
                      id="paint0_linear_1_1083"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="50"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stopColor="#FE6587" />
                      <stop offset="1" stopColor="#F52D6A" />
                    </linearGradient>
                  </defs>
                </svg>
                <h1>Cleaner</h1>
              </div>
            </div> */}
          </div>
          <div className=" px-6 py-6">
            <form>
              <div
                className="flex justify-between bg-white rounded-lg px-4 py-4"
                onClick={openModal}
              >
                <div className="text-gray-400">Upload Image</div>
                <FaPlus className="flex my-auto text-gray-400" />
              </div>
              {imagePreviewUrl && (
                <img
                  src={imagePreviewUrl}
                  alt="Preview"
                  className="mt-4 w-full h-[200px] object-cover"
                />
              )}
              <Modal
                isOpen={modalIsOpen}
                className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-end w-[390px] mx-auto pb-5"
              >
                <div className="bg-white w-[200px] rounded-lg flex flex-col gap-5 items-center">
                  <div className="pt-5">
                    <label htmlFor="upload-button" className="">
                      Upload Image
                    </label>
                    <input
                      id="upload-button"
                      className="hidden"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="camera-button"
                      className="btn btn-secondary"
                    >
                      Take a Picture
                    </label>
                    <input
                      id="camera-button"
                      className="hidden"
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={handleImageChange}
                    />
                  </div>
                  <button onClick={closeModal}>close</button>
                </div>
              </Modal>
              <div className="pt-6 relative">
                <select
                  className=" rounded-xl w-full py-4 px-4 bg-white"
                  type="text"
                  name="profession_id"
                  value={formData.profession_id}
                  onChange={handleInputChange}
                >
                  <option value="">Select a service</option>
                  {prof.map((item) => (
                    <>
                      <option value={item.id}>{item.name}</option>
                    </>
                  ))}
                </select>
              </div>
              {/* <div className="pt-6 relative">
                <input
                  className=" rounded-xl w-full py-4 px-4"
                  type="text"
                  placeholder="block"
                  name="block"
                  value={formData.block}
                  onChange={handleInputChange}
                ></input>
              </div>
              <div className="pt-6 relative">
                <input
                  className=" rounded-xl w-full py-4 px-4"
                  type="text"
                  placeholder="apartment number"
                  name="apartment_number"
                  value={formData.apartment_number}
                  onChange={handleInputChange}
                ></input>
              </div> */}
              <div className="pt-6">
                <textarea
                  className=" rounded-xl w-full py-4 px-4"
                  type="text"
                  placeholder="remarks"
                  name="remarks"
                  value={formData.remarks}
                  onChange={handleInputChange}
                ></textarea>
              </div>
              <button
                type="submit"
                className="bg-[#403F93] text-white mx-auto flex px-24 py-3 rounded-3xl mt-6"
                onClick={handlesubmit}
                disabled={isSubmiting}
              >
                Send Request
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Service;
