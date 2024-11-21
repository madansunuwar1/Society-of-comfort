import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { invoiceActions } from "../redux/invoiceSlice";
import api from "../utils/api";
import { Button, Skeleton } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import { SlArrowLeft } from "react-icons/sl";

const Payment = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [dueAmount, setDueAmount] = useState(null);
  const dispatch = useDispatch();
  const { invoices, loading } = useSelector((state) => state.invoices);

  useEffect(() => {
    dispatch(invoiceActions.getInvoices());
    api
      .get("/houses")
      .then((response) => {
        const fetchedHouses = response.data.data;
        const userHouse = fetchedHouses.find(
          (house) => Number(house.id) === user.user.house_id
        );
        if (userHouse) {
          setDueAmount(userHouse.dues);
        }
      })
      .catch((error) => {
        console.error("Error fetching houses:", error);
      });
  }, [dispatch, user.house_id]);

  // Log invoices to debug
  useEffect(() => {
    console.log(invoices); // To check if invoices data is properly fetched
  }, [invoices]);

  // If loading is true, display skeleton loader
  if (loading) {
    return (
      <div className="p-12">
        <Skeleton active />
      </div>
    );
  }

  // Check if the first invoice exists
  const firstInvoice = invoices && invoices?.length > 0 ? invoices[0] : null;

  return (
    <>
      <div className="flex  font-roboto  px-4 py-2 bg-[#3F3F95] rounded-b-lg">
        <div className="items-center my-auto">
          <Link to="/userdash">
            <SlArrowLeft className="text-white" />
          </Link>
        </div>
        <h3 className="font-bold flex justify-center mx-auto text-[22px] text-white">
          Invoices
        </h3>
      </div>
      <div className=" bg-white p-4 md:p-8 pb-20 pt-2 rounded-lg shadow-md">
        <div className="flex justify-between">
          <div className="bg-[#5ac9f5] bg-opacity-20 rounded-lg px-7 py-2">
            <h1 className="text-center text-md font-bold text-[#5ac9f5] mt-4">
              {dueAmount ? `NPR. ${dueAmount}` : "NPR. xxxx.xx"}
            </h1>
            <p className="text-center text-md text-[#5ac9f5]">Due Amount</p>
          </div>
          <Link to="/invoicehistory">
            <div className="w-[165px] h-[100px] rounded-lg bg-[#4a6e31] bg-opacity-20 p-2 ">
              <img
                src="./assets/images/invoice.png"
                alt=""
                className="h-8 w-8"
              />
              <h1 className="text-[14px] font-bold font-roboto text-[#4a6e31]">
                Invoice History
              </h1>
              <p className="text-[10px] font-roboto text-[#4a6e31]">
                you can find your Invoice history here
              </p>
            </div>
          </Link>
        </div>

        {/* Check if firstInvoice exists before rendering it */}
        <div className="flex justify-center w-full py-5">
          <div className="w-full bg-white p-4 border border-gray-300 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-center mb-6">
              This Month Invoice
            </h2>

            {firstInvoice ? (
              <div className="bg-white p-4 border border-gray-300 rounded-lg shadow-lg mx-auto my-auto">
                <h2 className="text-xl font-bold text-center mb-2">
                  Society of Comfort SMD Awas Bayawasthapan Samiti
                </h2>
                <p className="text-center">thaiba-14, Lalitpur</p>

                {/* Bill To Section */}
                <div className="text-sm font-mono border-b border-gray-400 pb-2 mb-4 mt-8">
                  <div className="flex justify-between">
                    <p>
                      <strong>House No:</strong> {firstInvoice.house_id}
                    </p>
                    <p>Owner: {user.user.name}</p>
                  </div>
                </div>

                {/* Payment Details Section */}
                <div className="text-sm font-mono border-b border-gray-400 pb-2 mb-4">
                  <strong>items:</strong>

                  {/* Mapping Invoice Items */}
                  {firstInvoice.invoice_items &&
                  firstInvoice.invoice_items.length > 0 ? (
                    <div className="mb-4 overflow-x-auto min-w-full">
                      <div className="space-y-2">
                        {firstInvoice.invoice_items.map((item, index) => (
                          <div
                            key={index}
                            className="flex flex-col md:flex-row justify-between border-b border-gray-300 py-2"
                          >
                            <span>{item.particular}</span>
                            <span>Quantity: {item.quantity}</span>
                            <span>Rate: NPR. {item.rate}</span>
                            <span>Total: NPR. {item.quantity * item.rate}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p>No invoice items found.</p>
                  )}
                </div>

                {/* Total Amount Section */}
                <div className="text-sm font-mono border-b border-gray-400 pb-2 mb-4">
                  <p>
                    <strong>Total </strong>
                    <span className="float-right">
                      NPR. {firstInvoice.total_amount}
                    </span>
                  </p>
                </div>

                {/* Payment Date Section */}
                <div className="text-sm font-mono border-b border-gray-400 pb-2 mb-4">
                  <p>
                    <strong>Payment Due:</strong> {firstInvoice.due_at_invoice}
                  </p>
                </div>
                <div className="text-sm font-mono border-b border-gray-400 pb-2 mb-4">
                  <p>
                    <strong>Total amount</strong>
                    <span className="float-right">
                      NPR. {firstInvoice.total_due}
                    </span>
                  </p>
                </div>

                {/* Remarks Section */}
                <div className="text-sm font-mono mb-4">
                  <strong>Remarks:</strong>
                  <p>{firstInvoice.remarks || "No remarks"}</p>
                </div>
              </div>
            ) : (
              <p>Loading invoice details...</p>
            )}

            <div className="text-center text-xs font-mono border-t pt-4 mt-4">
              <p>Thank you for your payment!</p>
              <p>Payment slip attached for verification.</p>
            </div>
          </div>
        </div>
        <div className="">
          <Link to="/adduserpayment">
            <Button
              className="w-full bg-[#5ac9f5]"
              icon={<PlusCircleOutlined />}
            >
              Add Payment
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Payment;
