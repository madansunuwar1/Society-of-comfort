import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../utils/api";
import { SlArrowLeft } from "react-icons/sl";
import { Button } from "antd";

const PaymentDetail = () => {
  const { id } = useParams(); // Get the payment id from the URL
  const [payment, setPayment] = useState(null);

  useEffect(() => {
    // Fetch the payment data based on the ID
    api
      .get(`/payments/${id}`)
      .then((response) => {
        setPayment(response.data);
      })
      .catch((error) => {
        console.error("Error fetching payment details:", error);
      });
  }, []);
  console.log(payment);

  const getStatusColor = (status) => {
    switch (status) {
      case "Confirmed":
        return "text-green-500"; // Green for Completed
      case "Pending":
        return "text-yellow-500"; // Yellow for Pending
      case "Rejected":
        return "text-red-500"; // Red for Rejected
      default:
        return "gray-300"; // Default color
    }
  };

  return (
    <div className="bg-[#f5f5f5] min-h-[100vh]">
      <div className="flex  font-roboto  px-4 py-2 bg-[#3F3F95] rounded-b-lg">
        <div className="items-center my-auto">
          <Link to="/adduserpayment">
            <SlArrowLeft className="text-white" />
          </Link>
        </div>
        <h3 className="font-bold flex justify-center mx-auto text-[22px] text-white">
          Payment Detail
        </h3>
      </div>
      {payment ? (
        <div className="m-4">
          <div className="bg-white p-4 rounded-lg shadow-sm shadow-gray-400 text-sm">
            <p className="flex justify-between">
              Payment ID:<span className="font-bold"> {payment?.data?.id}</span>
            </p>
            <p className="flex justify-between">
              Date: <span className="font-bold"> {payment.data.date}</span>
            </p>
            <p className="flex justify-between">
              Amount Paid:
              <span className="font-bold">Rs. {payment.data.amount}</span>
            </p>
            <p className="flex justify-between">
              Status:{" "}
              <span className={`${getStatusColor(payment.data.status)}`}>
                {payment.data.status}
              </span>
            </p>
            <img
              src={payment?.data?.slip?.original_url}
              alt="Payment slip"
              className=" rounded-lg object-cover mt-2"
            />
            <p className="font-bold mt-4">Remarks</p>
            <p>{payment.data.remarks}</p>
            {payment.status === "Rejected" && (
              <div>
                <p>Rejected reason: {payment.rejected_reason}</p>
              </div>
            )}
          </div>
          <div className="mt-4">
            <Link>
              <Button
                className="bg-[#19891A] text-md text-white w-full text-center"
                style={{
                  padding: "10px 0px",
                }}
              >
                Edit payment
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <p>loading</p>
      )}
    </div>
  );
};

export default PaymentDetail;
