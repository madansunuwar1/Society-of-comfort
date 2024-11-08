import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { invoiceActions } from "../../redux/invoiceSlice";
import { Link, useNavigate } from "react-router-dom";
import { Skeleton, Button, Modal, Pagination, message } from "antd";

const PaymentList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { invoices, loading, error } = useSelector((state) => state.invoices);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10); // Items per page
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);

  useEffect(() => {
    dispatch(invoiceActions.getInvoices());
  }, [dispatch]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Show invoice details in modal
  const handleShowInvoice = (payment) => {
    setSelectedPayment(payment);
    setIsInvoiceOpen(true);
  };

  // Edit invoice handler
  const handleEdit = (payment) => {
    navigate(`/editinvoice/${payment.id}`);
  };

  // Delete invoice handler
  const handleDelete = (id) => {
    Modal.confirm({
      title: "Are you sure you want to delete this invoice?",
      content: "This action cannot be undone.",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: async () => {
        try {
          await dispatch(invoiceActions.deleteInvoice(id)).unwrap();
          message.success("Invoice deleted successfully");
        } catch (error) {
          message.error("Failed to delete invoice");
        }
      },
    });
  };

  // Paginate invoices
  const paginatedInvoices = invoices?.data?.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="w-full bg-slate-200 p-6 pb-20 rounded-lg shadow-md">
      <div className="mb-4 flex justify-between">
        <h1 className="text-xl font-semibold mb-4">Invoice List</h1>
        <Link to="/dashboard/addinvoice">
          <Button
            type="default"
            className="bg-blue-800 text-white hover:bg-blue-600"
          >
            Add Invoice
          </Button>
        </Link>
      </div>

      <div className="overflow-x-auto">
        {loading ? (
          <div className="p-12">
            <Skeleton active />
            <Skeleton active />
            <Skeleton active />
          </div>
        ) : (
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 text-left border-r">ID</th>
                <th className="py-2 px-4 text-left border-r">Amount</th>
                <th className="py-2 px-4 text-left border-r">Date</th>
                <th className="py-2 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedInvoices?.map((payment) => (
                <tr key={payment.id} className="border-b hover:bg-gray-100">
                  <td className="py-2 px-4 border-r">{payment.id}</td>
                  <td className="py-2 px-4 border-r">{payment.total_amount}</td>
                  <td className="py-2 px-4 border-r">
                    {new Date(payment.created_at).toLocaleDateString()}
                  </td>
                  <td className="py-2 px-4 flex gap-2">
                    <Button
                      onClick={() => handleEdit(payment)}
                      className="bg-blue-600 text-white"
                    >
                      Edit
                    </Button>
                    <Button onClick={() => handleDelete(payment.id)} danger>
                      Delete
                    </Button>
                    <Button
                      onClick={() => handleShowInvoice(payment)}
                      className="bg-[#403F93] text-white"
                    >
                      Show Invoice
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination Component */}
      <Pagination
        current={currentPage}
        pageSize={pageSize}
        total={invoices?.data?.length || 0}
        onChange={handlePageChange}
        className="mt-4 text-center"
      />

      {/* Invoice Details Modal */}
      {isInvoiceOpen && selectedPayment && (
        <Modal
          visible={isInvoiceOpen}
          onCancel={() => setIsInvoiceOpen(false)}
          footer={null}
          width={800}
        >
          <div className="p-8">
            <h2 className="text-xl font-bold text-center mb-2">
              Society of Comfort SMD Awas Bayawasthapan Samiti
            </h2>
            <p className="text-center">Thaiba-14, Lalitpur</p>
            <div className="mt-8 text-sm font-mono border-gray-400 pb-2 mb-4">
              <div className="flex justify-between">
                <p>
                  <strong>House No:</strong> {selectedPayment.house_id}
                </p>
                <p>
                  Date:{" "}
                  {new Date(selectedPayment.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-2 px-4 border">S.no</th>
                    <th className="py-2 px-4 border">Particular</th>
                    <th className="py-2 px-4 border">Quantity</th>
                    <th className="py-2 px-4 border">Rate</th>
                    <th className="py-2 px-4 border">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedPayment.invoice_items &&
                  selectedPayment.invoice_items.length > 0 ? (
                    selectedPayment.invoice_items.map((item, index) => (
                      <tr key={index}>
                        <td className="py-2 px-4 border">{index + 1}</td>
                        <td className="py-2 px-4 border">{item.particular}</td>
                        <td className="py-2 px-4 border">{item.quantity}</td>
                        <td className="py-2 px-4 border">{item.rate}</td>
                        <td className="py-2 px-4 border">
                          {item.quantity * item.rate}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-2 px-4 border text-center">
                        No items found for this invoice.
                      </td>
                    </tr>
                  )}
                  <tr className="bg-gray-100 font-bold">
                    <td colSpan={4} className="py-2 px-4 border">
                      Amount Total
                    </td>
                    <td className="py-2 px-4 border">
                      {selectedPayment.total_amount}
                    </td>
                  </tr>
                  <tr className="bg-gray-100 font-bold">
                    <td colSpan={4} className="py-2 px-4 border">
                      Due Amount Total
                    </td>
                    <td className="py-2 px-4 border">
                      {selectedPayment.due_at_invoice}
                    </td>
                  </tr>
                  <tr className="bg-gray-200 font-bold">
                    <td colSpan={4} className="py-2 px-4 border">
                      Grand Total
                    </td>
                    <td className="py-2 px-4 border">
                      {Number(selectedPayment.total_amount) +
                        Number(selectedPayment.due_at_invoice)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default PaymentList;
