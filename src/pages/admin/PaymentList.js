import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { invoiceActions } from "../../redux/invoiceSlice";
import { Link, useNavigate } from "react-router-dom";
import { Skeleton, Button, Modal, Pagination, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import {
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  CopyOutlined,
} from "@ant-design/icons";

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

  const handleDuplicate = (payment) => {
    navigate("/dashboard/addinvoice", {
      state: {
        duplicateData: {
          house_id: payment.house_id,
          month: payment.month,
          items: payment.invoice_items,
          water_unit: payment.water_unit,
        },
      },
    });
  };

  // Paginate invoices
  const paginatedInvoices = invoices?.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="w-full bg-slate-200 p-6 pb-20 rounded-lg shadow-md">
      <div className="bg-white rounded-lg p-4">
        <div className="mb-4 flex justify-between">
          <h1 className="text-xl font-semibold mb-4">List Of Invoices</h1>
          <Link to="/dashboard/addinvoice">
            <Button
              type="default"
              className="bg-green-800 text-white hover:bg-green-600"
              icon={<PlusOutlined />}
            >
              Add New Invoice
            </Button>
          </Link>
        </div>
        <div className=" bg-gray-200 p-5 rounded-lg">
          {loading ? (
            <div className="p-12">
              <Skeleton active />
            </div>
          ) : (
            <div className="bg-white p-4 rounded-lg overflow-x-auto">
              <table className="min-w-full ">
                <thead>
                  <tr className="text-left">
                    <th className="py-2 px-4 border-r border-b border-gray-300">
                      S.N
                    </th>
                    <th className="py-2 px-4 border-r border-b border-gray-300">
                      Date
                    </th>
                    <th className="py-2 px-4 border-r border-b border-gray-300">
                      House No
                    </th>
                    <th className="py-2 px-4 border-r border-b border-gray-300">
                      Owner Name
                    </th>
                    <th className="py-2 px-4 border-b border-gray-300">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedInvoices?.map((payment, index) => (
                    <tr key={payment.id} className="hover:bg-gray-50 border-b">
                      <td className="py-2 px-4 border-r border-gray-300">
                        {index + 1}
                      </td>
                      <td className="py-2 px-4 border-r border-gray-300">
                        {payment.invoice_date}
                      </td>
                      <td className="py-2 px-4 border-r border-gray-300">22</td>
                      <td className="py-2 px-4 border-r border-gray-300">
                        ramesh
                      </td>
                      <td className="py-2 px-4 flex gap-2">
                        <Button
                          type="default"
                          className="bg-blue-800 text-white hover:bg-blue-600"
                          // onClick={() => handleEdit(notice)}
                          icon={<EditOutlined />}
                        />
                        <Button
                          onClick={() => handleShowInvoice(payment)}
                          type="default"
                          className="bg-gray-200 text-gray-800 hover:bg-gray-300"
                          icon={<EyeOutlined />}
                        />
                        <Button
                          icon={<CopyOutlined />}
                          onClick={() => handleDuplicate(payment)}
                          className="text-orange-600"
                          title="Duplicate Invoice"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={invoices?.length || 0}
            onChange={handlePageChange}
            className="mt-4 text-center"
          />
        </div>

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
                          <td className="py-2 px-4 border">
                            {item.particular}
                          </td>
                          <td className="py-2 px-4 border">{item.quantity}</td>
                          <td className="py-2 px-4 border">{item.rate}</td>
                          <td className="py-2 px-4 border">
                            {item.quantity * item.rate}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={5}
                          className="py-2 px-4 border text-center"
                        >
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
    </div>
  );
};

export default PaymentList;
