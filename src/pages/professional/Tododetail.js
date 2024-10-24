import React, { useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { SlArrowLeft } from "react-icons/sl";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Modal from "react-modal";
import axios from "axios";

const Tododetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const item = location.state?.item;
  const [imagePreviewUrl, setImagePreviewUrl] = useState("");
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const [formData, setFormData] = useState({
    resolved_snapshot: null,
  });
  const id = item.id;
  const url = `https://dev.waveplusit.com/api/services/resolve-service/${id}`;
  console.log(url);

  const openModal = () => {
    setIsOpen(true);
  };
  const closeModal = () => {
    setIsOpen(false);
  };
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        resolved_snapshot: file,
      }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
    closeModal();
  };
  console.log(formData);
  console.log(item.accepted_at);

  const formDataToSend = new FormData();
  if (formData.resolved_snapshot) {
    formDataToSend.append("resolved_snapshot", formData.resolved_snapshot);
  }
  console.log(formDataToSend);

  const handleresolve = async (e) => {
    e.preventDefault();
    try {
      console.log(formData);
      const response = await axios.post(url, formDataToSend);
      if (response.status === 200) {
        alert("task resolved sucessfully");
        navigate("/todo");
      } else {
        throw new Error("network not ok");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex justify-center bg-slate-800 w-[100%] h-[100%]">
      <div className="w-[390px] bg-slate-200 font-roboto pb-20">
        <div className="flex px-6 py-4 bg-white">
          <div className="items-center my-auto">
            <Link to="/proadmin">
              <SlArrowLeft />
            </Link>
          </div>
          <h3 className="font-bold flex justify-center mx-auto text-[22px]">
            Task detail
          </h3>
        </div>
        <div className=" rounded-lg shadow-lg px-4 py-4">
          <div className="">
            <div className="flex gap-4 justify-center items-center mb-4">
              <h1 className="text-[#38922d] font-light text-sm">ACCEPTED ON</h1>
              <p className=" font-light text-sm">{item.accepted_at}</p>
            </div>
            <img
              src="app.ico"
              alt="imag"
              className="rounded-md mx-auto mb-4"
            ></img>
            <p className="text-lg px-8 font-bold text-[#3F3F95]">
              {item.service}
            </p>
            <p className="mt-4 text-md px-8">{item.remarks}</p>
          </div>
          <div className="px-6 py-6">
            <form onSubmit={handleresolve}>
              <div
                className="flex justify-between bg-white rounded-lg px-4 py-4 shadow-slate-400 shadow-sm"
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
                    <label
                      htmlFor="upload-button"
                      className="shadow-slate-400 shadow-sm"
                    >
                      Upload Image
                    </label>
                    <input
                      id="upload-button"
                      className="hidden "
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
              <button className="bg-[#403F93] text-white mx-auto flex px-8 py-3 rounded-3xl mt-6">
                Resolve
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tododetail;
