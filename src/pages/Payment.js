import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { SlArrowLeft } from "react-icons/sl";

const Payment = () => {
  return (
    <div className=" bg-slate-200 p-6 pb-20 rounded-lg shadow-md">
      <div className="flex gap-2">
        <div className="bg-white rounded-lg px-8 py-2 shadow-lg shadow-slate-400">
          <h1 className="text-center text-md font-bold text-black mt-4">
            Rs. 12000
          </h1>
          <p className="text-center text-md text-black">Due Amount</p>
        </div>
        <Link to="/invoicehistory">
          <div className="w-[165px] h-[100px] rounded-lg bg-white p-2 shadow-lg shadow-slate-400">
            <img src="./assets/images/invoice.png" alt="" className="h-8 w-8" />

            <h1 className="text-[14px] font-bold font-roboto text-black">
              Invoice History
            </h1>
            <p className="text-[10px] font-roboto text-black">
              you can find your Invoice history here
            </p>
          </div>
        </Link>
      </div>
      <div className="flex justify-center bg-gray-200 w-full py-5">
        <div className="w-full bg-white p-4 border border-gray-300 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-center mb-2">
            Society of comfort SMD
          </h2>
          <h2 className="text-2xl font-bold text-center mb-6">
            {" "}
            This Month Invoice
          </h2>

          <div className="text-sm font-mono border-b border-gray-400 pb-2 mb-4">
            <strong>Bill To:</strong>
            <p>House No: 20</p>
            <p>Owner: ramesh</p>
          </div>

          <div className="text-sm font-mono border-b border-gray-400 pb-2 mb-4">
            <strong>Payment Details:</strong>
            <p>
              Monthly Charge: <span className="float-right">$ 2000</span>
            </p>
            <p>
              Water Charges: <span className="float-right">$ 24323</span>
            </p>
            <p>
              Other Charges: <span className="float-right">$ 44545</span>
            </p>
          </div>

          <div className="text-sm font-mono border-b border-gray-400 pb-2 mb-4">
            <p>
              <strong>Total Amount: </strong>{" "}
              <span className="float-right">$ 345345345</span>
            </p>
          </div>

          <div className="text-sm font-mono border-b border-gray-400 pb-2 mb-4">
            <p>
              <strong>Payment Date:</strong> 2024-31-2
            </p>
          </div>
          <div className="text-sm font-mono mb-4">
            <strong>Remarks:</strong>
            <p>{"ok" || "No remarks"}</p>
          </div>

          <div className="text-center text-xs font-mono border-t pt-4 mt-4">
            <p>Thank you for your payment!</p>
            <p>Payment slip attached for verification.</p>
          </div>
        </div>
      </div>
      <div>
        <Link
          to="/userpayment"
          className={`bg-[#403F93] text-white flex w-full py-3 rounded-md mt-3`}
        >
          <span className="mx-auto">Add Payment</span>
        </Link>
      </div>
    </div>
  );
};

export default Payment;
