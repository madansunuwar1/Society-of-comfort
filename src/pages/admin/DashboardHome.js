import React, { useEffect } from "react";
import imagePlaceholder from "../../svg/bg.jpg";
import { Input, Button, Progress, Skeleton } from "antd";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { paymentActions } from "../../redux/paymentSlice";
import { eventActions } from "../../redux/eventSlice";

const DashboardHome = () => {
  const dispatch = useDispatch();
  const { payments, loading: paymentsLoading } = useSelector(
    (state) => state.payments
  );
  const { events, loading: eventsLoading } = useSelector(
    (state) => state.events
  );
  const user = JSON.parse(localStorage.getItem("user"));
  const { Search } = Input;
  const currentAmount = 32300; // Current money
  const targetAmount = 59000; // Target money
  const percent = (currentAmount / targetAmount) * 100;

  useEffect(() => {
    dispatch(paymentActions.getPayments());
    dispatch(eventActions.getEvents());
  }, [dispatch]);

  const recentPayments = [...payments]
    .sort(
      (a, b) => new Date(b.payment.created_at) - new Date(a.payment.created_at)
    )
    .slice(0, 3);

  const recentEvents = [...events]
    .sort((a, b) => new Date(b.event.created_at) - new Date(a.event.created_at))
    .slice(0, 3);

  const getStatusColor = (status) => {
    switch (status) {
      case "Confirmed":
        return "bg-green-800";
      case "Pending":
        return "bg-yellow-800";
      case "Rejected":
        return "bg-text-red-800";
      default:
        return "bg-text-gray-800";
    }
  };

  return (
    <div className="mx-8 my-4">
      <div className="flex justify-between">
        <div className="flex gap-2 my-auto">
          <img
            src={user.profile_picture_url || imagePlaceholder}
            className="h-10 w-10 rounded-full"
            alt="profile"
          />
          <div className="my-auto">
            <p className="text-sm font-semibold">{user.user.name}</p>
            <p className="text-sm">{user.role}</p>
          </div>
        </div>
        <div className="w-1/3 my-auto">
          <Search
            placeholder="Search residences"
            enterButton={
              <Button
                icon={<SearchOutlined className="text-white" />}
                style={{
                  backgroundColor: "#CA8A04",
                }}
              ></Button>
            }
            style={{}}
            size="large"
          />
        </div>
        <div className="my-auto">
          {" "}
          <Button
            type="default"
            className="bg-green-800 text-white hover:bg-green-600 px-8 py-5 rounded-xl"
            icon={<PlusOutlined />}
          >
            Add New Invoice
          </Button>
        </div>
        <div className=" bg-[#CA8A04] p-2 rounded-xl">
          <div className="flex gap-2">
            <p className="text-md font-semibold text-white">
              Collection Status
            </p>
            <p className="text-[10px] my-auto">
              Rs {currentAmount} / Rs {targetAmount}
            </p>
          </div>
          <div
            style={{
              width: "250px",
              height: "10px",
              background: "#B91C1C",
              borderRadius: "5px",
            }}
          >
            <div
              style={{
                width: `${percent}%`,
                height: "100%",
                background: "#16A34A",
                borderRadius: "5px",
              }}
            ></div>
          </div>
        </div>
      </div>
      <div className="text-2xl font-bold mt-8">Dashboard</div>
      {/* <div className="flex gap-8  mt-8">
        <div className="bg-yellow-300 rounded-lg py-4 px-12">
          <h1 className="text-center text-3xl font-bold text-yellow-700">
            120
          </h1>
          <p className="text-center text-xl text-yellow-700">Paid Invoice</p>
        </div>
        <div className="bg-red-300 rounded-lg py-4 px-12">
          <h1 className="text-center text-3xl font-bold text-red-700">120</h1>
          <p className="text-center text-xl text-red-700">UnPaid Invoice</p>
        </div>
        <div className="bg-green-300 rounded-lg py-4 px-12">
          <h1 className="text-center text-3xl font-bold text-green-700">120</h1>
          <p className="text-center text-xl text-green-700">Complaints</p>
        </div>
        <div className="bg-blue-300 rounded-lg py-4 px-12">
          <h1 className="text-center text-3xl font-bold text-blue-700">120</h1>
          <p className="text-center text-xl text-blue-700">Technical Request</p>
        </div>
        <div className="bg-orange-300 rounded-lg py-4 px-12">
          <h1 className="text-center text-3xl font-bold text-orange-700">
            120
          </h1>
          <p className="text-center text-xl text-orange-700">Security Issues</p>
        </div>
      </div> */}
      <div className="flex justify-between gap-8 mt-4">
        <div className="w-full">
          <div className="p-4 bg-sky-100 shadow-sm shadow-gray-400 rounded-lg w-full">
            <h2 className="text-xl font-semibold border-b border-black pb-2 mb-2">
              Recent payment Received{" "}
            </h2>
            {paymentsLoading ? (
              <Skeleton active paragraph={{ rows: 4 }} />
            ) : (
              <ul>
                {recentPayments.map((item) => (
                  <li
                    key={item.payment.id}
                    className="border-b py-2 flex items-center"
                  >
                    <div className="flex items-center gap-4 w-2/4">
                      <img
                        src={item.slip_url}
                        alt="Payment slip"
                        className="h-12 w-12 rounded-lg object-cover"
                      />
                      <div>
                        <p className="font-semibold">{item.user_name}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(item.payment.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="w-1/4">
                      <p>
                        <span
                          className={`px-4 py-2 rounded-md text-white ${getStatusColor(
                            item.payment.status
                          )}`}
                        >
                          {item.payment.status}
                        </span>
                      </p>
                    </div>
                    <div className="w-1/4">
                      <p className="text-lg font-bold">
                        Rs {item.payment.amount}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="p-4 bg-sky-100 shadow-sm shadow-gray-400 rounded-lg w-full mt-8">
            <div className="flex justify-between border-b border-black pb-2 mb-2">
              <h2 className="text-xl font-semibold">Overdue Payment Alert</h2>
              <h2 className="text-md mb-4">(Overdue upto 3 months)</h2>
            </div>
            {paymentsLoading ? (
              <Skeleton active paragraph={{ rows: 4 }} />
            ) : (
              <ul>
                {recentPayments.map((item) => (
                  <li
                    key={item.payment.id}
                    className="border-b py-2 flex items-center"
                  >
                    <div className="flex items-center gap-4 w-2/4">
                      <img
                        src={item.slip_url}
                        alt="Payment slip"
                        className="h-12 w-12 rounded-lg object-cover"
                      />
                      <div>
                        <p className="font-semibold">{item.user_name}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(item.payment.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="w-1/4">
                      <p>
                        <span className="px-4 py-2 rounded-md text-white bg-yellow-600">
                          Send Reminder
                        </span>
                      </p>
                    </div>
                    <div className="w-1/4">
                      <p className="text-lg font-bold text-red-700">
                        Rs {item.payment.amount}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="w-full">
          <div className="p-4 bg-sky-100 shadow-sm shadow-gray-400 rounded-lg w-full">
            <h2 className="text-xl font-semibold border-b border-black pb-2 mb-2">
              Upcoming events
            </h2>
            {eventsLoading ? (
              <Skeleton active paragraph={{ rows: 4 }} />
            ) : (
              <ul>
                {recentEvents.map((item) => (
                  <li
                    key={item.event.id}
                    className="border-b py-2 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4 w-2/4">
                      <img
                        src={item.file_url}
                        alt="Payment slip"
                        className="h-12 w-12 rounded-lg object-cover"
                      />
                      <div>
                        <p className="font-semibold">{item.event.name}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(item.event.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Button className="bg-yellow-600 text-white">
                      See More
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="p-4 bg-sky-100 shadow-sm shadow-gray-400 rounded-lg w-full mt-8">
            <h2 className="text-xl font-semibold border-b border-black pb-2 mb-2">
              Upcoming tasks
            </h2>
            <ul>
              <li className="border-b py-2 flex items-center justify-between">
                <div className="flex items-center gap-4 w-2/4">
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/4345/4345800.png"
                    alt="Payment slip"
                    className="h-12 w-12 rounded-lg object-cover"
                  />
                  <div>
                    <p className="font-semibold">Collect water reading</p>
                    <p className="text-sm text-gray-500">3 mangsir 2081</p>
                  </div>
                </div>
                <Button className="bg-yellow-600 text-white">See More</Button>
              </li>
              <li className="border-b py-2 flex items-center justify-between">
                <div className="flex items-center gap-4 w-2/4">
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/4345/4345800.png"
                    alt="Payment slip"
                    className="h-12 w-12 rounded-lg object-cover"
                  />
                  <div>
                    <p className="font-semibold">Issue community fee bills</p>
                    <p className="text-sm text-gray-500">12 mangsir 2081</p>
                  </div>
                </div>
                <Button className="bg-yellow-600 text-white">See More</Button>
              </li>
              <li className="border-b py-2 flex items-center justify-between">
                <div className="flex items-center gap-4 w-2/4">
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/4345/4345800.png"
                    alt="Payment slip"
                    className="h-12 w-12 rounded-lg object-cover"
                  />
                  <div>
                    <p className="font-semibold">Send reminder for payment</p>
                    <p className="text-sm text-gray-500">13 mangsir 2081</p>
                  </div>
                </div>
                <Button className="bg-yellow-600 text-white">See More</Button>
              </li>
              <li className="border-b py-2 flex items-center justify-between">
                <div className="flex items-center gap-4 w-2/4">
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/4345/4345800.png"
                    alt="Payment slip"
                    className="h-12 w-12 rounded-lg object-cover"
                  />
                  <div>
                    <p className="font-semibold">Submit audit report</p>
                    <p className="text-sm text-gray-500">6 poush 2081</p>
                  </div>
                </div>
                <Button className="bg-yellow-600 text-white">See More</Button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
