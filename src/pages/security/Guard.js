import React, { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";

const Guard = () => {
  const [data, setData] = useState([]);

  const fetchData = async () => {
    try {
      const res = await fetch("https://dev.waveplusit.com/api/passes");
      if (!res.ok) {
        throw new Error("Network response not ok");
      }
      const jsonData = await res.json();
      console.log(jsonData);
      setData(jsonData.data);
    } catch (error) {
      console.error("Error", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCheckIn = async (id) => {
    const url = `https://dev.waveplusit.com/api/passes/check-in/${id}`;
    try {
      const checkIn = await fetch(url, { method: "POST" });
      if (checkIn.ok) {
        await fetchData();
      }
    } catch (error) {
      console.log("Error:error");
    }
  };

  const handleCheckOut = async (id) => {
    const url = `https://dev.waveplusit.com/api/passes/check-out/${id}`;
    try {
      const checkOut = await fetch(url, { method: "POST" });
      if (checkOut.ok) {
        await fetchData();
      }
    } catch (error) {
      console.log("Error:error");
    }
  };

  return (
    <div className="flex justify-center bg-slate-800 w-[100%] h-[100%]">
      <div className="w-[390px] bg-white pb-20">
        <div className="flex px-6 py-4">
          <h3 className="font-bold flex justify-center mx-auto text-[22px]">
            Security Check
          </h3>
          <FiSearch className="w-5 h-5" />
        </div>
        <div className="px-6">
          <table className="border-[1px] border-black">
            <thead>
              <tr>
                <th className="border border-black" style={{ width: "25%" }}>
                  OTP
                </th>
                <th className="border border-black" style={{ width: "25%" }}>
                  Time
                </th>
                <th
                  className="border border-black"
                  style={{ width: "25%" }}
                  colSpan="2"
                >
                  Status
                  <tr>
                    <th>Checked in</th>
                    <th>Checked Out</th>
                  </tr>
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item.id}>
                  <td className="border border-black text-center">
                    {item.otp_code}
                  </td>
                  <td className="border border-black text-center">
                    {item.visit_time}
                  </td>
                  <td
                    className="border border-black text-center"
                    onClick={() => handleCheckIn(item.id)}
                  >
                    {item.checked_in ? (
                      item.checked_in
                    ) : (
                      <svg
                        width="22"
                        height="20"
                        viewBox="0 0 22 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="mx-auto"
                      >
                        <path
                          d="M20.75 0H1.25C1.05109 0 0.860322 0.0526785 0.71967 0.146447C0.579018 0.240215 0.5 0.367392 0.5 0.5V9H9.5V6L17 10L9.5 14V11H0.5V19.5C0.5 19.6326 0.579018 19.7598 0.71967 19.8536C0.860322 19.9473 1.05109 20 1.25 20H20.75C20.9489 20 21.1397 19.9473 21.2803 19.8536C21.421 19.7598 21.5 19.6326 21.5 19.5V0.5C21.5 0.367392 21.421 0.240215 21.2803 0.146447C21.1397 0.0526785 20.9489 0 20.75 0Z"
                          fill="#50B748"
                        />
                      </svg>
                    )}
                  </td>
                  <td
                    className="border border-black text-center"
                    onClick={() => item.checked_in && handleCheckOut(item.id)}
                  >
                    {item.checked_out ? (
                      item.checked_out
                    ) : (
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="mx-auto"
                      >
                        <path
                          d="M18.4999 0H1.49992C1.1242 0 0.763861 0.105357 0.498184 0.292893C0.232508 0.48043 0.083252 0.734784 0.083252 1V10L7.16658 6V9H15.6666V11H7.16658V14L0.083252 10V19C0.083252 19.2652 0.232508 19.5196 0.498184 19.7071C0.763861 19.8946 1.1242 20 1.49992 20H18.4999C18.8756 20 19.236 19.8946 19.5017 19.7071C19.7673 19.5196 19.9166 19.2652 19.9166 19V1C19.9166 0.734784 19.7673 0.48043 19.5017 0.292893C19.236 0.105357 18.8756 0 18.4999 0Z"
                          fill="#BE4B27"
                        />
                      </svg>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Guard;
