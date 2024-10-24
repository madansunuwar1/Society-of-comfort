import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Proadmin = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [data, setData] = useState([]);
  const id = user.user.id;
  console.log(id);
  const fetchdata = async () => {
    const url = `https://dev.waveplusit.com/api/services/for-user/${id}`;
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
  useEffect(() => {
    fetchdata();
  }, [id]);

  const handleAccept = async (ID) => {
    const acceptUrl = `https://dev.waveplusit.com/api/services/accept-service/${id}/${ID}`;
    try {
      const response = await axios.get(acceptUrl);
      console.log("response:", response);
      if (response.status === 200) {
        alert("service accepted");
        fetchdata();
      } else {
        throw new Error("network not ok");
      }
    } catch (error) {
      console.log("Error:", error);
      alert("Network request failed");
    }
  };

  console.log(data.length);
  return (
    <div className="flex justify-center bg-slate-800 w-[100%]">
      <div className="px-5 pb-20 w-[390px] bg-white">
        <div className="">
          <div className="flex justify-between pt-4">
            <Link to="/todo">
              <div className="w-[165px] h-[100px] rounded-xl bg-[#F55A70] bg-opacity-20 p-2">
                <svg
                  width="33"
                  height="33"
                  viewBox="0 0 33 33"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M28.2136 8.58553C28.2136 8.41923 28.1809 8.25455 28.1172 8.10091C28.0536 7.94726 27.9603 7.80766 27.8427 7.69007C27.7251 7.57247 27.5855 7.47919 27.4319 7.41555C27.2782 7.35191 27.1136 7.31915 26.9473 7.31915H6.05275C5.88645 7.31915 5.72178 7.35191 5.56813 7.41555C5.41449 7.47919 5.27488 7.57247 5.15729 7.69007C5.0397 7.80766 4.94642 7.94726 4.88277 8.10091C4.81913 8.25455 4.78638 8.41923 4.78638 8.58553V24.4145C4.78638 24.7504 4.9198 25.0725 5.15729 25.31C5.39478 25.5475 5.71689 25.6809 6.05275 25.6809H26.9473C27.2831 25.6809 27.6052 25.5475 27.8427 25.31C28.0802 25.0725 28.2136 24.7504 28.2136 24.4145V8.58553Z"
                    stroke="#F55A70"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M26.1663 7.31913L25.7661 5.82313C25.6791 5.49877 25.4669 5.22225 25.176 5.05439C24.8851 4.88652 24.5395 4.84106 24.2151 4.92801L15.2914 7.31913M28.2136 22.8663L28.9671 22.6641C29.1278 22.6211 29.2784 22.5469 29.4104 22.4457C29.5424 22.3444 29.6531 22.2182 29.7363 22.0742C29.8195 21.9302 29.8735 21.7712 29.8952 21.6063C29.9169 21.4414 29.906 21.2738 29.8629 21.1131L28.2129 14.9579M6.83375 25.6809L7.23388 27.1769C7.32088 27.5012 7.53315 27.7778 7.82401 27.9456C8.11487 28.1135 8.4605 28.1589 8.78488 28.072L17.7086 25.6809M4.78638 10.1338L4.03288 10.3359C3.87221 10.3789 3.72158 10.4531 3.58961 10.5543C3.45763 10.6556 3.34689 10.7818 3.2637 10.9258C3.18051 11.0699 3.12651 11.2289 3.10479 11.3938C3.08306 11.5587 3.09403 11.7262 3.13706 11.8869L4.79669 18.0799M8.90175 11.1183H24.0976M8.90175 14.7063H24.0976M8.90175 18.2937H24.0976M8.90175 21.8818H16.5"
                    stroke="#F55A70"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <h1 className="text-[14px] font-bold font-roboto text-[#F55A70]">
                  Accepted List
                </h1>
                <p className="text-[10px] font-roboto text-[#C19595]">
                  Your list of works to do is here
                </p>
              </div>
            </Link>
            <Link to="/completed">
              <div className="w-[165px] h-[100px] rounded-xl bg-[#752FFF] bg-opacity-20 p-2">
                <svg
                  width="33"
                  height="33"
                  viewBox="0 0 33 33"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4.34637 6.14486C5.94146 4.54948 8.08087 3.61635 10.3353 3.5327C12.5898 3.44905 14.7924 4.22107 16.5014 5.69386C18.2088 4.22353 20.4086 3.45237 22.6603 3.53478C24.912 3.61718 27.0495 4.54707 28.6449 6.13827C30.2403 7.72946 31.1758 9.86454 31.2641 12.1161C31.3524 14.3676 30.587 16.5694 29.1211 18.2806L18.4442 28.9919C17.9537 29.4826 17.2958 29.7697 16.6025 29.7957C15.9091 29.8217 15.2315 29.5847 14.7056 29.1321L14.5544 28.9932L3.87887 18.2806C2.41379 16.5708 1.64804 14.3711 1.73472 12.1211C1.82139 9.87118 2.7541 7.73685 4.34637 6.14486ZM6.29062 8.08911C5.16621 9.21384 4.51805 10.7283 4.48067 12.3183C4.44328 13.9082 5.01955 15.4515 6.08987 16.6279L6.29062 16.8396L16.5 27.049L23.7916 19.7546L18.931 14.8954L17.4735 16.3529C16.7 17.1267 15.6508 17.5616 14.5567 17.5618C13.4626 17.5621 12.4132 17.1277 11.6394 16.3542C10.8655 15.5808 10.4307 14.5316 10.4304 13.4375C10.4301 12.3433 10.8645 11.2939 11.638 10.5201L14.5282 7.62848C13.378 6.7105 11.9383 6.23243 10.4674 6.28006C8.99657 6.32768 7.59081 6.89788 6.50237 7.88836L6.29062 8.08911ZM17.9589 11.9776C18.2167 11.7198 18.5664 11.575 18.931 11.575C19.2956 11.575 19.6453 11.7198 19.9031 11.9776L25.7359 17.8104L26.7094 16.8396C27.8526 15.6972 28.5035 14.1527 28.5228 12.5366C28.542 10.9205 27.9282 9.36101 26.8125 8.19162C25.6969 7.02223 24.1679 6.3358 22.5527 6.27913C20.9374 6.22246 19.3641 6.80004 18.1692 7.88836L17.9589 8.08911L13.5836 12.4644C13.3453 12.7025 13.2027 13.0199 13.1829 13.3563C13.1632 13.6926 13.2676 14.0245 13.4764 14.289L13.5836 14.4086C13.8218 14.6469 14.1392 14.7895 14.4755 14.8093C14.8119 14.8291 15.1438 14.7246 15.4082 14.5159L15.5279 14.4086L17.9589 11.9776Z"
                    fill="#752FFF"
                  />
                </svg>

                <h1 className="text-[14px] font-bold font-roboto text-[#752FFF]">
                  Completed list
                </h1>
                <p className="text-[10px] font-roboto text-[#91ABDD]">
                  you can find completed list here
                </p>
              </div>
            </Link>
          </div>
        </div>
        <div className="mt-4 bg-slate-200">
          <div className="bg-[#3F3F95] py-2 px-4">
            <h1 className="font-bold text-white text-xl">Request list</h1>
          </div>
          {data && data.length ? (
            data.map((item) => (
              <div
                className="flex justify-between p-2 bg-white mx-2 my-4 rounded-md shadow-md"
                key={item.id}
              >
                {data.image && (
                  <img
                    src=""
                    className="rounded-full w-10 h-10 my-auto"
                    alt=""
                  />
                )}
                <div className="w-40">
                  <h1 className="text-[#3F3F95] font-bold">{item.service}</h1>
                  <p className="text-sm">{item.remarks}</p>
                </div>
                <div className="my-auto">
                  <button
                    type="submit"
                    className="bg-[#38922d] text-white px-4 py-1 rounded-sm shadow-md drop-shadow-md shadow-lime-100"
                    onClick={() => handleAccept(item.id)}
                  >
                    Accept
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="flex justify-center py-6 mx-24 text-center">
              Loading...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Proadmin;
