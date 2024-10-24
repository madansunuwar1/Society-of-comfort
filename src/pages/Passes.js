import React, { useRef } from "react";
import { SlArrowLeft } from "react-icons/sl";
import { Link } from "react-router-dom";
import html2canvas from "html2canvas";
import image from "../svg/23.png";
// import { FacebookMessengerIcon, FacebookShareButton } from "react-share";

const Passes = () => {
  const otp = JSON.parse(localStorage.getItem("otp"));
  const guest = JSON.parse(localStorage.getItem("nwedata"));
  const userData = JSON.parse(localStorage.getItem("user"));
  const contentRef = useRef(null);

  const handleDownload = () => {
    html2canvas(contentRef.current).then((canvas) => {
      const dataUrl = canvas.toDataURL();
      const link = document.createElement("a");
      link.download = "invitation.png";
      link.href = dataUrl;
      link.click();
    });
  };

  return (
    <div className="flex justify-center bg-slate-800 w-[100%] h-[100vh]">
      <div className=" w-[390px] bg-white pb-20">
        <div className="flex px-6 py-4 font-roboto">
          <div className="items-center my-auto">
            <Link to="/userdash">
              <SlArrowLeft />
            </Link>
          </div>
          <h3 className="font-bold flex justify-center mx-auto text-[22px]">
            Invitation
          </h3>
        </div>

        <div
          ref={contentRef}
          className="mx-6 h-[560px] px-6 bg-cover rounded-3xl"
          style={{ backgroundImage: `url(${image})` }}
        >
          <div>
            <h1 className="text-[16px] text-center pt-7 pb-4">
              YOU ARE INVITED BY <br />
              <span className="uppercase font-bold">{userData.user.name} </span>
              TO THE RESIDENCY
            </h1>
          </div>
          <hr className="bg-black my-2" />
          <div className="py-4">
            <p className="text-[20px] font-roboto font-bold text-center">
              Our Residency
            </p>
          </div>
          <div className=" bg-[#403F93] my-8">
            <p className="font-bold text-[34px] text-white my-auto flex justify-center">
              {otp.data.otp_code}
            </p>
          </div>
          <div className="py-2">
            <p className="text-[16px] mx-10 text-center my-12 leading-5 text-[#000000]">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor
            </p>
          </div>
          <div>
            <h1 className="text-[20px] font-roboto font-bold text-center py-5 text-black">
              {guest.date} {guest.time}
            </h1>
          </div>
        </div>
        <div className="bg-[#403F93] mx-6 my-7 py-2 rounded-lg">
          <div className="flex justify-center gap-3">
            <div className="flex my-auto">
              <svg
                width="18"
                height="16"
                viewBox="0 0 18 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9.90218 4.04509V0.998788C9.90218 0.733893 9.99702 0.479847 10.1658 0.292538C10.3347 0.105229 10.5636 0 10.8024 0C11.0385 0.00110328 11.2648 0.105128 11.4325 0.289649L17.7337 7.28117C17.8181 7.37402 17.8851 7.48448 17.9308 7.6062C17.9765 7.72791 18 7.85846 18 7.99031C18 8.12216 17.9765 8.25271 17.9308 8.37442C17.8851 8.49613 17.8181 8.6066 17.7337 8.69945L11.4325 15.691C11.3061 15.8284 11.146 15.9215 10.9723 15.9585C10.7985 15.9956 10.6187 15.975 10.4554 15.8993C10.2922 15.8237 10.1526 15.6963 10.0542 15.5331C9.95578 15.3699 9.90291 15.1782 9.90218 14.9818V11.8856H9.13703C7.71482 11.862 6.30503 12.1822 5.00551 12.8238C3.706 13.4654 2.54788 14.4131 1.61155 15.6011C1.49871 15.7678 1.34169 15.8911 1.16251 15.9538C0.98332 16.0165 0.790947 16.0154 0.612349 15.9507C0.430597 15.8826 0.273191 15.7519 0.16308 15.5776C0.052969 15.4034 -0.00408745 15.1946 0.000228882 14.9818C0.000228882 5.87288 7.27366 4.31477 9.90218 4.04509ZM9.13703 9.86803C9.73911 9.86594 10.3406 9.90932 10.9374 9.99787C11.1505 10.0337 11.3449 10.1533 11.4853 10.3347C11.6258 10.5162 11.7028 10.7475 11.7025 10.9867V12.5747L15.8254 7.99031L11.7025 3.40587V4.99394C11.7025 5.25884 11.6077 5.51288 11.4389 5.70019C11.2701 5.8875 11.0411 5.99273 10.8024 5.99273C9.9832 5.99273 3.50192 6.19249 2.09764 12.4149C4.13592 10.7475 6.60468 9.8543 9.13703 9.86803Z"
                  fill="white"
                />
              </svg>
            </div>
            <button
              className="text-[20px] font-bold text-white"
              onClick={handleDownload}
            >
              share
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Passes;
