import React from "react";
import { Link } from "react-router-dom";

const Admindash = () => {
  return (
    <div className="flex justify-center bg-slate-800 w-[100%] h-[100vh]">
      <div className="px-5 pb-20 w-[390px] bg-white">
        <div className="">
          <div className="flex justify-between pt-4">
            <Link to="/public">
              <div className="w-[165px] h-[100px] rounded-xl bg-[#F55A70] bg-opacity-20 p-2 shadow-lg shadow-slate-400">
                <img
                  src="../assets/images/notice1.png"
                  className="w-10 h-10"
                ></img>
                <h1 className="text-[14px] font-bold font-roboto text-[#F55A70]">
                  Send Public Notice
                </h1>
                <p className="text-[10px] font-roboto text-[#C19595]">
                  Private and public notices can be sent here
                </p>
              </div>
            </Link>
            <Link to="/private">
              <div className="w-[165px] h-[100px] rounded-xl bg-[#87d6ca] bg-opacity-20 p-2 shadow-lg shadow-slate-400">
                <img
                  src="../assets/images/notice.png"
                  className="w-10 h-10"
                ></img>
                <h1 className="text-[14px] font-bold font-roboto text-[#87d6ca]">
                  Send Private Notice
                </h1>
                <p className="text-[10px] font-roboto text-[#87d6ca]">
                  Private and public notices can be sent here
                </p>
              </div>
            </Link>
          </div>
          <div className="flex justify-between mt-4">
            <Link to="/paymentlist">
              <div className="w-[165px] h-[100px] rounded-xl bg-[#c31fde] bg-opacity-20 p-2 shadow-lg shadow-slate-400">
                <img
                  src="../assets/images/banking-card.png"
                  className="w-10 h-10"
                ></img>

                <h1 className="text-[14px] font-bold font-roboto text-[#c31fde]">
                  Payment
                </h1>
                <p className="text-[10px] font-roboto text-[#c31fde]">
                  you can find your payment list here
                </p>
              </div>
            </Link>
            <Link to="/event">
              <div className="w-[165px] h-[100px] rounded-xl bg-[#0298a9] bg-opacity-20 p-2 shadow-lg shadow-slate-400">
                <img
                  src="../assets/images/calendar.png"
                  className="w-10 h-10"
                ></img>

                <h1 className="text-[14px] font-bold font-roboto text-[#0298a9]">
                  event
                </h1>
                <p className="text-[10px] font-roboto text-[#0298a9]">
                  you can find Bookings of today
                </p>
              </div>
            </Link>
          </div>
        </div>
        <div className="w-full h-[205px] bg-[url('https://res.cloudinary.com/sentral/image/upload/w_1000,h_1000,q_auto:eco,c_fill/f_auto/v1684782440/miro_hero_building_exterior_2000x1125.jpg')] rounded-lg mt-6 pl-7 font-roboto shadow-lg shadow-slate-400">
          <h4 className="text-[12px] pt-10 font-bold">Our Services</h4>
          <h1 className="text-[20px] text-white font-bold">RESIDENCY</h1>
          <p className="text-[14px] text-white">
            Best apartments in town
            <br />
            You can find
          </p>

          <button className="bg-[#01BCAD] text-[12px] text-white rounded-2xl px-4 py-2 mt-2">
            See More
          </button>
        </div>
        <div className="flex justify-between mt-4">
          <Link to="/residences">
            <div className="w-[165px] h-[100px] rounded-xl bg-[#FFAE00] bg-opacity-20 p-2 shadow-lg shadow-slate-400">
              <img
                src="../assets/images/house1.png"
                className="w-10 h-10"
              ></img>

              <h1 className="text-[14px] font-bold font-roboto text-[#FFAE00]">
                Residences
              </h1>
              <p className="text-[10px] font-roboto text-[#FFAE00]">
                you can find the list of residences here
              </p>
            </div>
          </Link>
          <Link to="/attendance">
            <div className="w-[165px] h-[100px] rounded-xl bg-[#f2545a] bg-opacity-20 p-2 shadow-lg shadow-slate-400">
              <img
                src="../assets/images/immigration.png"
                className="w-10 h-10"
              ></img>

              <h1 className="text-[14px] font-bold font-roboto text-[#f2545a]">
                attandence
              </h1>
              <p className="text-[10px] font-roboto text-[#f2545a]">
                you can find attendance here
              </p>
            </div>
          </Link>
        </div>
        <div className="flex justify-between mt-4"></div>
      </div>
    </div>
  );
};

export default Admindash;
