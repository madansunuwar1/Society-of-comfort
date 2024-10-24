import React, { useState } from "react";
import { SlArrowLeft } from "react-icons/sl";
import { Link } from "react-router-dom";
import { FaArrowDown } from "react-icons/fa";

const Review = () => {
  const [showList, setShowList] = useState(false);

  const handleArrowClick = () => {
    setShowList(!showList);
  };
  return (
    <div className="flex justify-center bg-slate-800 w-[100%] h-[100%]">
      <div className="w-[390px] bg-[#403F93] font-roboto pb-20">
        <div className="flex px-6 py-4 bg-white">
          <div className="items-center my-auto">
            <Link to="/dashboard">
              <SlArrowLeft />
            </Link>
          </div>
          <h3 className="font-bold flex justify-center mx-auto text-[22px]">
            Reviews
          </h3>
        </div>
        <div className="px-6 py-3 flex flex-col gap-3">
          <div className="flex flex-col bg-white rounded-lg">
            <div className="flex gap-6 p-3 rounded-lg">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBij0KCyzNKCMo6l9Ldzv-cxSNNtx5WcGoIg8hr0Gciw&s"
                alt=""
                className="w-1/2 h-auto"
              ></img>

              <div className="flex flex-col gap-6 p-3 rounded-lg">
                <img
                  src="data:image/jpeg;base64,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"
                  alt=""
                  className="w-8 h-8 rounded-full"
                ></img>
                <h1 className="font-bold text-[#403F93] my-auto">
                  ram
                  <span className="ml-1 font-normal">sent task for review</span>
                </h1>
              </div>
            </div>
            <div className="mx-3 my-2">
              <textarea
                className="w-[100%] p-2 border-[2px]"
                placeholder="remarks"
              ></textarea>
              <div className="flex justify-between">
                <button
                  type="submit"
                  className="bg-[#403F93] text-white flex px-5 py-1 rounded-md mt-2"
                  //   onClick={handlesubmit}
                >
                  Send
                </button>
                <FaArrowDown className="my-auto" onClick={handleArrowClick} />
              </div>

              {showList && (
                <div className="text-sm">
                  <ul className="list-disc px-5 py-4">
                    <span className="text-[#403F93]">Admin</span>
                    <li>Task not finished</li>
                    <span className="text-[#403F93]">Professionals</span>
                    <li>work re done</li>
                    <span className="text-[#403F93]">admin</span>
                    <li>still not completed</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Review;
