import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../utils/api";
import { SlArrowLeft } from "react-icons/sl";
import { Button, Skeleton } from "antd";
import { DownloadOutlined } from "@ant-design/icons";

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

  return (
    <div className="w-full bg-[#F5F5F5] min-h-[100vh] ">
      <div className="flex  font-roboto  px-4 py-2 bg-[#3F3F95] rounded-b-lg">
        <div className="items-center my-auto">
          <Link to="/adduserpayment">
            <SlArrowLeft className="text-white" />
          </Link>
        </div>
        <h3 className="font-bold flex justify-center mx-auto text-[22px] text-white">
          Invoice Detail
        </h3>
      </div>

      {invoice ? (
        <>
          <div className="bg-white p-4 rounded-lg shadow-sm shadow-gray-400 m-4">
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
          <div className="mx-4 mt-4">
            <Button
              icon={<DownloadOutlined />}
              className="bg-[#19891A] text-white w-full"
              style={{
                padding: "20px 0px",
              }}
            >
              Download invoice
            </Button>
          </div>
        </>
      ) : (
        <div className="p-4">
          <Skeleton active paragraph={{ rows: 5 }} />
        </div>
      )}
    </div>
  );
};

export default InvoiceDetail;
