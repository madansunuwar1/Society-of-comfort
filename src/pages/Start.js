import React from "react";
import { Link } from "react-router-dom";

const Start = () => {
  return (
    <div className="flex justify-center">
      <div className="bg-[#3F3F95] h-[100vh] absolute w-[390px] pb-20">
        <div className=" h-52 w-52 bg-white rounded-full relative mx-auto mt-16">
          <h1 className="text-[#3F3F95] text-[32px] font-bold font-roboto text-center pt-14">
            RESIDENCY APP
          </h1>
          <p className="text-center font-bold">by Nirvan Studio</p>
        </div>
        <h2 className="text-center text-white font-roboto mt-12 text-lg p-7">
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
