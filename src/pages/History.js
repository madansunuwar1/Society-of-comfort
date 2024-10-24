import axios from "axios";
import React, { useEffect, useState } from "react";
import { SlArrowLeft } from "react-icons/sl";
import { Link } from "react-router-dom";
import Modal from "react-modal";

const History = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [data, setData] = useState([]);
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const id = user.user.id;
  console.log(data);
  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    alert("booking extended sucessfull");
  };
  useEffect(() => {
    const fetchdata = async () => {
      const url = `https://dev.waveplusit.com/api/services/my-resolved-services/${id}`;
      try {
        const response = await axios.get(url);
        console.log("response:", response);
        if (response.status === 200) {
          setData(response.data.data.data);
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

  return (
    <div className="flex justify-center bg-slate-800 w-[100%] h-[100%]">
      <div className="w-[390px] bg-slate-200 font-roboto pb-20">
        <div className="flex px-6 py-4 bg-white">
          <div className="items-center my-auto">
            <Link to="/userdash">
              <SlArrowLeft />
            </Link>
          </div>
          <h3 className="font-bold flex justify-center mx-auto text-[22px]">
            History
          </h3>
        </div>
        <div className="px-6 py-6 flex flex-col gap-3">
          <div className="flex bg-white rounded-lg shadow-lg">
            <div className="flex flex-col gap-2 p-3 rounded-lg">
              <h1 className="text-[#38922d]">Booking ends at 12:00</h1>
              <p className="h-18 my-auto text-xs">
                you have booked the hall and the swimming pool
              </p>
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="bg-[#403F93] text-white text-sm rounded-md px-4 py-2"
                  onClick={openModal}
                >
                  Extend time
                </button>
                <button
                  type="submit"
                  className="bg-green-600 text-white text-sm rounded-md px-4 py-2"
                >
                  End Booking
                </button>
              </div>
              <Modal
                isOpen={modalIsOpen}
                className="bg-opacity-30 bg-slate-600 backdrop-blur-sm flex justify-center items-center w-[390px] h-full mx-auto pb-5"
              >
                <div className="bg-white w-[300px] rounded-lg flex flex-col gap-5 items-center p-4">
                  <div className="pt-5 flex flex-col gap-6">
                    <label htmlFor="upload-button" className="">
                      Extend your Booking time by
                    </label>
                    <select
                      className=" rounded-xl w-full py-3 px-4 bg-white shadow-slate-400 shadow-sm"
                      type="text"
                      name="deliveryOption"
                    >
                      <option value="standard">1 hour</option>
                      <option value="express">2 hour</option>
                      <option value="overnight">3 hour</option>
                      <option value="overnight">5 hour</option>
                      <option value="overnight">8 hour</option>
                      <option value="overnight">1 day</option>
                      <option value="overnight">2 day</option>
                    </select>
                  </div>
                  <button
                    className="bg-[#403F93] text-white mx-auto flex px-16 py-3 rounded-3xl mt-6"
                    onClick={closeModal}
                  >
                    Extend
                  </button>
                </div>
              </Modal>
            </div>
          </div>
          {data.map((item) => (
            <div className=" bg-white rounded-lg shadow-lg" key={item.id}>
              <div className="flex">
                <div className="flex flex-col gap-2 p-3 rounded-lg">
                  <div>
                    <h1 className="text-[#38922d]">Task Resolved</h1>
                    <p className=" font-light text-sm">{item.resolved_at}</p>
                  </div>
                  <p className="h-18 my-auto text-xs">
                    Your request for services has been completed
                  </p>
                </div>
                <img
                  src={item.resolved_snapshot}
                  alt=""
                  className="h-40 object-cover rounded-md p-1"
                ></img>
              </div>
              <div className="flex justify-between mx-2">
                <div className="my-2 w-3/4">
                  <textarea
                    className="w-full rounded-md border-[1px] border-slate-800 p-2"
                    type="text"
                    name="comment"
                    placeholder="Comment"
                    //   value={formData.service}
                    // onChange={handleInputChange}
                  ></textarea>
                </div>
                <div className="w-1/4 flex justify-center items-center">
                  <button
                    type="submit"
                    className="bg-[#403F93] text-white rounded-md px-2"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          ))}

          <div className="flex bg-white rounded-lg shadow-lg">
            <div className="flex flex-col gap-2 p-3 rounded-lg">
              <h1 className="text-[#38922d]">Guest Checked In</h1>
              <p className="h-18 my-auto text-xs">
                your guest has checked in from the gate
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default History;
