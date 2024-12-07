import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MdOutlinePayment } from "react-icons/md";
import api from "../utils/api";
import { Button, Skeleton } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import InstallPrompt from "../InstallPrompt";
import { eventActions } from "../redux/eventSlice";
import { noticeActions } from "../redux/noticeSlice";

const Userdash = () => {
  const dispatch = useDispatch();
  const { allNotices, loading: noticesLoading } = useSelector(
    (state) => state.notices
  );
  const user = JSON.parse(localStorage.getItem("user"));
  const [dueAmount, setDueAmount] = useState(null);
  const [housenumber, setHousenumber] = useState(null);
  const { events, loading: eventsLoading } = useSelector(
    (state) => state.events
  );

  useEffect(() => {
    api
      .get("/houses")
      .then((response) => {
        const fetchedHouses = response.data.data;
        const userHouse = fetchedHouses.find(
          (house) => Number(house.id) === user.user.house_id
        );
        if (userHouse) {
          setDueAmount(userHouse.dues);
          setHousenumber(userHouse.house_number); // Assuming `due_amount` is the property holding the due amount
        } // Update houses state with API data
      })
      .catch((error) => {
        console.error("Error fetching houses:", error);
      });
    dispatch(noticeActions.getAllNotices());
    dispatch(eventActions.getEvents());
  }, [user.house_id]);

  const getNoticeColor = (status) => {
    switch (status) {
      case "private":
        return "bg-[#2563EB] rounded-3xl";
      default:
        return "bg-[#1E3A8A] rounded-3xl";
    }
  };

  return (
    <>
      {/* <div className="App">
        <h1>Welcome to My React PWA</h1>
        <p>This is a demo of a Progressive Web App with an install prompt.</p>
        <InstallPrompt />
      </div> */}
      <div className="flex justify-center">
        <div className="px-4 pb-20 bg-[#F5F5F5]">
          <div className="bg-[url('https://static.vecteezy.com/system/resources/previews/003/127/954/non_2x/abstract-template-blue-background-white-squares-free-vector.jpg')] rounded-lg mt-4 p-4 bg-cover flex justify-between">
            <div>
              <div className="mx-4">
                <img
                  src="../assets/images/image.jpeg"
                  alt="tch2 logo"
                  className="rounded-full h-16 w-16"
                />
              </div>
              <div className="mt-2">
                <p className="font-bold text-white">TCH II Thaiba</p>
              </div>
            </div>
            <div className=" flex justify-between flex-col">
              <div className="">
                <p className="text-[16px] font-roboto text-white">Due amount</p>
                <p className="text-white text-[16px] font-semibold">
                  {" "}
                  {dueAmount ? `NPR. ${dueAmount}` : "NPR. xxxx.xx"}
                </p>
              </div>
              <Link to="/adduserpayment">
                <Button
                  icon={<PlusCircleOutlined />}
                  className="bg-[#19891A] text-white"
                >
                  Add Payment
                </Button>
              </Link>
            </div>
          </div>
          {/* <div className="flex justify-between gap-4 mt-4">
          <Link to="/payment">
            <div className="w-[165px] h-[100px] rounded-lg bg-[#5ac9f5] bg-opacity-20 p-2 ">
              <MdOutlinePayment className="w-10 h-10 text-[#5ac9f5]" />
              <h1 className="text-[14px] font-bold font-roboto text-[#5ac9f5]">
                Invoice info
              </h1>
              <p className="text-[10px] font-roboto text-[#5ac9f5]">
                Your Invoice for this month
              </p>
            </div>
          </Link>
          <Link to="/userpayment">
            <div className="w-[165px] h-[100px] rounded-lg bg-[#6e3148] bg-opacity-20 p-2 ">
              <svg
                width="33"
                height="33"
                viewBox="0 0 33 33"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M16.5 12.7188C15.1325 12.7188 13.821 13.262 12.854 14.229C11.887 15.196 11.3438 16.5075 11.3438 17.875C11.3438 19.2425 11.887 20.554 12.854 21.521C13.821 22.488 15.1325 23.0312 16.5 23.0312C17.8675 23.0312 19.179 22.488 20.146 21.521C21.113 20.554 21.6562 19.2425 21.6562 17.875C21.6562 16.5075 21.113 15.196 20.146 14.229C19.179 13.262 17.8675 12.7188 16.5 12.7188ZM13.4062 17.875C13.4062 17.0545 13.7322 16.2676 14.3124 15.6874C14.8926 15.1072 15.6795 14.7812 16.5 14.7812C17.3205 14.7812 18.1074 15.1072 18.6876 15.6874C19.2678 16.2676 19.5938 17.0545 19.5938 17.875C19.5938 18.6955 19.2678 19.4824 18.6876 20.0626C18.1074 20.6428 17.3205 20.9688 16.5 20.9688C15.6795 20.9688 14.8926 20.6428 14.3124 20.0626C13.7322 19.4824 13.4062 18.6955 13.4062 17.875Z"
                  fill="#6e3148"
                />
                <path
                  d="M13.75 25.0938C13.4765 25.0938 13.2142 25.2024 13.0208 25.3958C12.8274 25.5892 12.7188 25.8515 12.7188 26.125C12.7188 26.3985 12.8274 26.6608 13.0208 26.8542C13.2142 27.0476 13.4765 27.1562 13.75 27.1562H19.25C19.5235 27.1562 19.7858 27.0476 19.9792 26.8542C20.1726 26.6608 20.2812 26.3985 20.2812 26.125C20.2812 25.8515 20.1726 25.5892 19.9792 25.3958C19.7858 25.2024 19.5235 25.0938 19.25 25.0938H13.75Z"
                  fill="#6e3148"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M21.4651 2.17798C22.0014 2.10135 22.5479 2.14084 23.0676 2.29378C23.5872 2.44672 24.068 2.70954 24.4773 3.06445C24.8865 3.41935 25.2148 3.85805 25.4397 4.35084C25.6647 4.84363 25.7812 5.37901 25.7812 5.92073V7.8141C26.6113 8.25207 27.3061 8.90829 27.7907 9.712C28.2753 10.5157 28.5313 11.4365 28.5312 12.375V26.125C28.5312 27.4925 27.988 28.804 27.021 29.771C26.054 30.738 24.7425 31.2812 23.375 31.2812H9.625C8.25748 31.2812 6.94597 30.738 5.97898 29.771C5.012 28.804 4.46875 27.4925 4.46875 26.125V6.87498V6.77735C4.46875 5.5316 5.3845 4.47423 6.61925 4.29823L21.4651 2.17798ZM6.97263 9.28123H6.53125V26.125C6.53125 26.9455 6.8572 27.7324 7.43739 28.3126C8.01758 28.8928 8.80449 29.2187 9.625 29.2187H23.375C24.1955 29.2187 24.9824 28.8928 25.5626 28.3126C26.1428 27.7324 26.4688 26.9455 26.4688 26.125V12.375C26.4688 11.5568 26.1447 10.772 25.5675 10.1922C24.9903 9.61241 24.2069 9.28486 23.3888 9.28123H6.97263ZM23.7188 7.21873H6.96712C6.8556 7.21779 6.74857 7.17466 6.66754 7.09803C6.58652 7.02139 6.53751 6.91692 6.53037 6.80563C6.52323 6.69433 6.55849 6.58446 6.62905 6.49809C6.69962 6.41173 6.80026 6.35528 6.91075 6.3401L21.7566 4.22123C22.0004 4.18636 22.2488 4.20427 22.485 4.27375C22.7212 4.34323 22.9397 4.46265 23.1258 4.62394C23.3119 4.78522 23.4611 4.98459 23.5634 5.20856C23.6657 5.43254 23.7187 5.67587 23.7188 5.9221V7.21873Z"
                  fill="#6e3148"
                />
              </svg>
              <h1 className="text-[14px] font-bold font-roboto text-[#6e3148]">
                Payment Info
              </h1>
              <p className="text-[10px] font-roboto text-[#6e3148]">
                Get your payment info here
              </p>
            </div>
          </Link>
        </div> */}

          <div className="flex justify-between gap-4 mt-4">
            <Link to="/display-event">
              <div className="w-[165px] h-[100px] rounded-lg bg-[#FDDEE2] p-2 ">
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
                <h1 className="text-[14px] font-bold font-roboto text-[#F55A89]">
                  Events
                </h1>
                <p className="text-[10px] font-roboto text-[#F55A89]">
                  events happening on your surrounding
                </p>
              </div>
            </Link>
            <Link to="/booking">
              <div className="w-[165px] h-[100px] rounded-lg bg-[#FF7900] bg-opacity-20 p-2 ">
                <svg
                  width="33"
                  height="33"
                  viewBox="0 0 33 33"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M16.5 12.7188C15.1325 12.7188 13.821 13.262 12.854 14.229C11.887 15.196 11.3438 16.5075 11.3438 17.875C11.3438 19.2425 11.887 20.554 12.854 21.521C13.821 22.488 15.1325 23.0312 16.5 23.0312C17.8675 23.0312 19.179 22.488 20.146 21.521C21.113 20.554 21.6562 19.2425 21.6562 17.875C21.6562 16.5075 21.113 15.196 20.146 14.229C19.179 13.262 17.8675 12.7188 16.5 12.7188ZM13.4062 17.875C13.4062 17.0545 13.7322 16.2676 14.3124 15.6874C14.8926 15.1072 15.6795 14.7812 16.5 14.7812C17.3205 14.7812 18.1074 15.1072 18.6876 15.6874C19.2678 16.2676 19.5938 17.0545 19.5938 17.875C19.5938 18.6955 19.2678 19.4824 18.6876 20.0626C18.1074 20.6428 17.3205 20.9688 16.5 20.9688C15.6795 20.9688 14.8926 20.6428 14.3124 20.0626C13.7322 19.4824 13.4062 18.6955 13.4062 17.875Z"
                    fill="#ff7700a9"
                  />
                  <path
                    d="M13.75 25.0938C13.4765 25.0938 13.2142 25.2024 13.0208 25.3958C12.8274 25.5892 12.7188 25.8515 12.7188 26.125C12.7188 26.3985 12.8274 26.6608 13.0208 26.8542C13.2142 27.0476 13.4765 27.1562 13.75 27.1562H19.25C19.5235 27.1562 19.7858 27.0476 19.9792 26.8542C20.1726 26.6608 20.2812 26.3985 20.2812 26.125C20.2812 25.8515 20.1726 25.5892 19.9792 25.3958C19.7858 25.2024 19.5235 25.0938 19.25 25.0938H13.75Z"
                    fill="#ff7700a9"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M21.4651 2.17798C22.0014 2.10135 22.5479 2.14084 23.0676 2.29378C23.5872 2.44672 24.068 2.70954 24.4773 3.06445C24.8865 3.41935 25.2148 3.85805 25.4397 4.35084C25.6647 4.84363 25.7812 5.37901 25.7812 5.92073V7.8141C26.6113 8.25207 27.3061 8.90829 27.7907 9.712C28.2753 10.5157 28.5313 11.4365 28.5312 12.375V26.125C28.5312 27.4925 27.988 28.804 27.021 29.771C26.054 30.738 24.7425 31.2812 23.375 31.2812H9.625C8.25748 31.2812 6.94597 30.738 5.97898 29.771C5.012 28.804 4.46875 27.4925 4.46875 26.125V6.87498V6.77735C4.46875 5.5316 5.3845 4.47423 6.61925 4.29823L21.4651 2.17798ZM6.97263 9.28123H6.53125V26.125C6.53125 26.9455 6.8572 27.7324 7.43739 28.3126C8.01758 28.8928 8.80449 29.2187 9.625 29.2187H23.375C24.1955 29.2187 24.9824 28.8928 25.5626 28.3126C26.1428 27.7324 26.4688 26.9455 26.4688 26.125V12.375C26.4688 11.5568 26.1447 10.772 25.5675 10.1922C24.9903 9.61241 24.2069 9.28486 23.3888 9.28123H6.97263ZM23.7188 7.21873H6.96712C6.8556 7.21779 6.74857 7.17466 6.66754 7.09803C6.58652 7.02139 6.53751 6.91692 6.53037 6.80563C6.52323 6.69433 6.55849 6.58446 6.62905 6.49809C6.69962 6.41173 6.80026 6.35528 6.91075 6.3401L21.7566 4.22123C22.0004 4.18636 22.2488 4.20427 22.485 4.27375C22.7212 4.34323 22.9397 4.46265 23.1258 4.62394C23.3119 4.78522 23.4611 4.98459 23.5634 5.20856C23.6657 5.43254 23.7187 5.67587 23.7188 5.9221V7.21873Z"
                    fill="#ff7700a9"
                  />
                </svg>
                <h1 className="text-[14px] font-bold font-roboto text-[#ff7700a9]">
                  Booking
                </h1>
                <p className="text-[10px] font-roboto text-[#ff7700a9]">
                  Book your service directly from here without any complications
                </p>
              </div>
            </Link>
          </div>

          {/* <div className="flex justify-between gap-4 mt-4">
          <Link to="/userpayment">
            <div className="w-[165px] h-[100px] rounded-lg bg-[#752FFF] bg-opacity-20 p-2 ">
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
                Payment List
              </h1>
              <p className="text-[10px] font-roboto text-[#91ABDD]">
                you can find your payment list here
              </p>
            </div>
          </Link>
        </div> */}
          <div className="mt-8 pb-20">
            <div className="w-full">
              <h2 className="text-2xl font-bold pb-2 mb-2">Upcoming events</h2>
              {eventsLoading ? (
                <Skeleton active paragraph={{ rows: 2 }} />
              ) : (
                <div className="flex flex-col gap-2">
                  {events.map((item) => (
                    <Link
                      to={`/display-event/event-detail/${item.id}`}
                      key={item.id}
                      className="flex items-center justify-between bg-white shadow-sm shadow-gray-400 rounded-lg p-4"
                    >
                      <div className="">
                        <p
                          className="text-md text-ellipsis overflow-hidden capitalize font-semibold"
                          style={{
                            display: "-webkit-box",
                            WebkitBoxOrient: "vertical",
                            WebkitLineClamp: 1,
                          }}
                        >
                          {item.name}
                        </p>
                        <p className="text-md text-gray-500">
                          {new Date(item.date).toLocaleDateString()}
                        </p>
                        <p
                          className="text-md text-gray-600 text-ellipsis overflow-hidden pt-2 w-2/3"
                          style={{
                            display: "-webkit-box",
                            WebkitBoxOrient: "vertical",
                            WebkitLineClamp: 2,
                          }}
                        >
                          {item.description}
                        </p>
                      </div>

                      <img
                        src={item.file.original_url}
                        alt="Payment slip"
                        className="h-16 w-16 rounded-lg object-cover"
                      />
                    </Link>
                  ))}
                  <div className="mt-4">
                    <Link to="/display-event">
                      <Button
                        className="bg-[#19891A] text-md text-white w-full text-center"
                        style={{
                          padding: "20px 0px",
                        }}
                      >
                        View more events
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            </div>
            <div className="w-full mt-8">
              <h2 className="text-2xl font-bold pb-2 mb-2">Latest Notices</h2>
              {noticesLoading ? (
                <Skeleton active paragraph={{ rows: 2 }} />
              ) : (
                <div className="flex flex-col gap-2">
                  {allNotices.map((item) => (
                    <Link
                      to={`/notice/notice-detail/${item.id}`}
                      className="flex items-center justify-between bg-white shadow-sm shadow-gray-400 rounded-lg p-4 "
                      key={item.id}
                    >
                      <div className="">
                        <p
                          className="text-md text-ellipsis overflow-hidden capitalize font-semibold"
                          style={{
                            display: "-webkit-box",
                            WebkitBoxOrient: "vertical",
                            WebkitLineClamp: 1,
                          }}
                        >
                          {item.title}
                        </p>
                        <p className="text-md text-gray-500">
                          {" "}
                          {new Date(item.created_at).toLocaleDateString()}
                        </p>
                        <p className="pt-2">
                          <span
                            className={`${getNoticeColor(
                              item.notice_type
                            )} text-[12px] px-4 py-1 text-white`}
                          >
                            {item.notice_type}
                          </span>
                        </p>
                        <p
                          className="text-md text-gray-600 text-ellipsis overflow-hidden pt-2"
                          style={{
                            display: "-webkit-box",
                            WebkitBoxOrient: "vertical",
                            WebkitLineClamp: 2,
                          }}
                        >
                          {item.notice_body}
                        </p>
                      </div>
                    </Link>
                  ))}
                  <div className="mt-4">
                    <Link to="/notice">
                      <Button
                        className="bg-[#19891A] text-md text-white w-full text-center"
                        style={{
                          padding: "20px 0px",
                        }}
                      >
                        View More Notices
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Userdash;
