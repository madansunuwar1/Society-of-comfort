import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../utils/api";
import { SlArrowLeft } from "react-icons/sl";

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
  }, [id]);
  console.log(payment);

  if (!payment) return <p>Loading...</p>;

  return (
    <div>
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
      <h2>Payment Details</h2>
      <p>Payment ID: {payment.id}</p>
      <p>Date: {payment.date}</p>
      <p>Amount Paid: Rs. {payment.amount}</p>
      <p>Status: {payment.status}</p>
      {payment.status === "Rejected" && (
        <div>
          <p>Rejected reason: {payment.rejected_reason}</p>
        </div>
      )}
    </div>
  );
};

export default PaymentDetail;
