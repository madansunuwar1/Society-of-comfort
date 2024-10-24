import axios from "axios";
import React, { useEffect, useState } from "react";
import { SlArrowLeft } from "react-icons/sl";
import { Link, useNavigate } from "react-router-dom";

const Todo = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [data, setData] = useState();
  const navigate = useNavigate();
  const id = user.user.id;
  useEffect(() => {
    const fetchdata = async () => {
      const url = `https://dev.waveplusit.com/api/services/my-to-do-services/${id}`;
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

  const handleView = (item) => {
    navigate("/tododetailpage", { state: { item } });
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
            TODO list
          </h3>
        </div>
        <div className="px-6 py-6 flex flex-col gap-3">
          {data && data.length ? (
            data.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-lg ">
                <div className="gap-2 p-3 rounded-lg">
                  <div>
                    <div className="flex justify-between">
                      <h1 className="text-[#38922d]">ACCEPTED AT</h1>
                      <p className=" font-light text-sm">{item.accepted_at}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className=" font-light text-sm">
                        Appartment No : {item.apartment_number}
                      </p>
                      <p className=" font-light text-sm">{item.block}</p>
                    </div>
                  </div>
                  <div className="flex mt-5 justify-between">
                    <div className="">
                      <h1 className="mb-2 font-bold text-[#3F3F95]">
                        {item.service}
                      </h1>
                      <p className="h-18 my-auto text-xs">{item.remarks}</p>

                      <div className="mt-4">
                        <button
                          type="submit"
                          className="bg-[#403F93] text-white text-sm py-1 px-4 rounded-md"
                          onClick={() => handleView(item)}
                        >
                          view
                        </button>
                      </div>
                    </div>
                    <div className="my-auto">
                      <img className="w-20 h-20 bg-black" src="" alt="ok" />
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex justify-center py-6 mx-24 text-center">
              LOADING....
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Todo;
