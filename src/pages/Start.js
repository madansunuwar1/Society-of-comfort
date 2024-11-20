import React from "react";
import { Link } from "react-router-dom";

const Start = () => {
  return (
    <div className="flex justify-center bg-[#3F3F95]">
      <div className=" h-[100vh] pb-20">
        <div className=" h-52 w-52 rounded-full mx-auto mt-16">
          <div className="">
            <img
              src="../assets/images/image.jpeg"
              alt="logo"
              className="rounded-full w-44 h-44 mx-auto"
            />
          </div>
        </div>
        <p className="text-white font-bold text-2xl text-center mt-4 mx-5">
          Society of The Comfort Housing Phase II Thaiba
        </p>
        <h2 className="text-center text-white font-roboto mt-12 text-lg px-96">
          Welcome to the Residency app this is a test app built as a progressive
          web app for testing purposes this does not resemble the final product
        </h2>
        <Link to="/signin">
          <button className="bg-white mx-auto flex px-24 py-3 rounded-3xl mt-12">
            Get Started
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Start;
