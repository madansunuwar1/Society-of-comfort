import React, { useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { SlArrowLeft } from "react-icons/sl";
import { Link } from "react-router-dom";
import Modal from "react-modal";

const Request = () => {
  const [imagePreviewUrl, setImagePreviewUrl] = useState("");
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const [formData, setFormData] = useState({
    notice: "",
    notice_image: null,
  });
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
        service_image: file,
      }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
    closeModal();
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevformData) => ({
      ...prevformData,
      [name]: value,
    }));
  };

  return (
    <div className="flex justify-center bg-slate-800 w-[100%] h-[100%]">
      <div className="w-[390px] bg-[#403F93] font-roboto pb-20">
        <div className="flex px-6 py-4 bg-white">
          <div className="items-center my-auto">
            <Link to="/proadmin">
              <SlArrowLeft />
            </Link>
          </div>
          <h3 className="font-bold flex justify-center mx-auto text-[22px]">
            Service Review
          </h3>
        </div>
        <div className="px-6 py-3 flex flex-col gap-3">
          <div className="bg-white rounded-lg">
            <div className="flex flex-col gap-2 p-3 rounded-lg">
              <h1 className="text-[#38922d]">Completed</h1>
              <p>
                <span className="text-[#403F93] mr-4">Requested by:</span>ram
                thapa
              </p>
              <p>
                <span className="text-[#403F93] mr-12">Block no:</span>5D
              </p>
              <p>
                <span className="text-[#403F93] mr-3">Apartment No:</span>4
              </p>

              <div className="">
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBij0KCyzNKCMo6l9Ldzv-cxSNNtx5WcGoIg8hr0Gciw&s"
                  alt=""
                  className="mx-auto"
                />
              </div>
              <p className="h-auto my-auto">Requested for a services</p>
            </div>
            <div className="bg-[#F8F8FE] px-6 py-6">
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
                  <textarea
                    className=" rounded-xl w-full py-4 px-4"
                    type="text"
                    name="remarks"
                    placeholder="remarks"
                    value={formData.service}
                    onChange={handleInputChange}
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="bg-[#403F93] text-white mx-auto flex px-8 py-3 rounded-3xl mt-6"
                  //   onClick={handlesubmit}
                >
                  Send for review
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Request;
