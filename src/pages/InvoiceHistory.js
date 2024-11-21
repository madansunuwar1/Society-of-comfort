import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { invoiceActions } from "../redux/invoiceSlice";
import { Skeleton } from "antd";
import { Link } from "react-router-dom";
import { SlArrowLeft } from "react-icons/sl";

const InvoiceHistory = () => {
  const dispatch = useDispatch();
  const { invoices, loading } = useSelector((state) => state.invoices);

  useEffect(() => {
    dispatch(invoiceActions.getInvoices());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="p-12">
        <Skeleton active />
      </div>
    );
  }

  return (
    <div className="p-6 bg-slate-200 rounded-lg shadow-md">
      <div className="flex items-center mb-4">
        <Link to="/payment" className="text-gray-500 hover:text-gray-700">
          <SlArrowLeft />
        </Link>
        <h3 className="font-bold flex justify-center mx-auto text-lg">
          Invoice History
        </h3>
      </div>
      <div className="grid grid-cols-1 gap-4">
        {invoices?.map((invoice) => (
          <div
            key={invoice.id}
            className="flex flex-col border border-gray-300 bg-white p-4 rounded-lg shadow-md transition-transform hover:scale-105"
          >
            <div className="mb-4">
              <p className="">
                Date {new Date(invoice.created_at).toLocaleDateString()}
              </p>
              <p className="">Invoice for month: {invoice.month}</p>
            </div>
            {invoice.invoice_items.map((item) => (
              <div className="flex justify-between">
                <p>{item.particular}</p>
                <p>Rs. {item.total}</p>
              </div>
            ))}
            <div className="flex justify-between mt-2">
              <p className="">Total</p>
              <p className="">{invoice.total_amount}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InvoiceHistory;
