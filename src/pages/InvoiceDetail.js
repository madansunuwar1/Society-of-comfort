import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../utils/api";
import { SlArrowLeft } from "react-icons/sl";

const InvoiceDetail = () => {
  const { id } = useParams(); // Get the invoice id from the URL
  const [invoice, setInvoice] = useState(null);

  useEffect(() => {
    // Fetch the invoice data based on the ID
    api
      .get(`/invoices/${id}`)
      .then((response) => {
        setInvoice(response.data);
      })
      .catch((error) => {
        console.error("Error fetching invoice details:", error);
      });
  }, [id]);

  if (!invoice) return <p>Loading...</p>;

  return (
    <div className="w-full">
      <div className="flex  font-roboto  px-4 py-2 bg-[#3F3F95] rounded-b-lg">
        <div className="items-center my-auto">
          <Link to="/adduserpayment">
            <SlArrowLeft className="text-white" />
          </Link>
        </div>
        <h3 className="font-bold flex justify-center mx-auto text-[22px] text-white">
          Invoices
        </h3>
      </div>
      <div className="w-full bg-white p-4 border border-gray-300 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6"></h2>

        {invoice ? (
          <div className="bg-white p-4 border border-gray-300 rounded-lg shadow-lg mx-auto my-auto">
            <h2 className="text-xl font-bold text-center mb-2">
              Society of Comfort SMD Awas Bayawasthapan Samiti
            </h2>
            <p className="text-center">thaiba-14, Lalitpur</p>

            {/* Bill To Section */}
            <div className="text-sm font-mono border-b border-gray-400 pb-2 mb-4 mt-8">
              <div className="flex justify-between">
                <p>
                  <strong>House No:</strong> {invoice.house_id}
                </p>
                <p>Owner: {invoice.owner_name}</p>
              </div>
            </div>

            {/* Payment Details Section */}
            <div className="text-sm font-mono border-b border-gray-400 pb-2 mb-4">
              <strong>Items:</strong>

              {/* Mapping Invoice Items */}
              {invoice.invoice_items && invoice.invoice_items.length > 0 ? (
                <div className="mb-4 overflow-x-auto min-w-full">
                  <div className="space-y-2">
                    {invoice.invoice_items.map((item, index) => (
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
                <strong>Total</strong>
                <span className="float-right">NPR. {invoice.total_amount}</span>
              </p>
            </div>

            {/* Total Amount Due Section */}
            <div className="text-sm font-mono border-b border-gray-400 pb-2 mb-4">
              <p>
                <strong>Total Amount Due</strong>
                <span className="float-right">
                  NPR. {invoice?.total_due || 0}
                </span>
              </p>
            </div>

            {/* Remarks Section */}
            <div className="text-sm font-mono mb-4">
              <strong>Remarks:</strong>
              <p>{invoice.remarks || "No remarks"}</p>
            </div>
          </div>
        ) : (
          <p>Loading invoice details...</p>
        )}
      </div>
    </div>
  );
};

export default InvoiceDetail;
