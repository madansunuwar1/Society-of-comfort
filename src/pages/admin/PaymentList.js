import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { invoiceActions } from "../../redux/invoiceSlice";
import { Link } from "react-router-dom";
import { SlArrowLeft } from "react-icons/sl";
import DatePicker from "react-datepicker";
import api from "../../utils/api";
import { NepaliDatePicker } from "nepali-datepicker-reactjs";
import "nepali-datepicker-reactjs/dist/index.css";
import { Skeleton, notification } from "antd";

import NepaliDate from "nepali-date-converter";

const PaymentList = () => {
  const dispatch = useDispatch();
  const [date, setDate] = useState("");

  const handleDateChange = (date) => {
    setDate(date);
  };
  const { invoices, loading, error } = useSelector((state) => state.invoices);
  const [updating, setUpdating] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);

  // Invoice form state
  const [houseId, setHouseId] = useState("");
  const [houses, setHouses] = useState([]);
  const [totalAmount, setTotalAmount] = useState("");
  const [items, setItems] = useState([
    { particular: "", quantity: 1, rate: 0 },
  ]);
  const [dueAmount, setDueAmount] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    dispatch(invoiceActions.getInvoices());
    api
      .get("/houses")
      .then((response) => {
        setHouses(response.data); // Update houses state with API data
      })
      .catch((error) => {
        console.error("Error fetching houses:", error);
      });
  }, [dispatch]);

  useEffect(() => {
    // Calculate total amount whenever items change
    const calculatedTotal = items.reduce(
      (acc, item) => acc + item.quantity * item.rate,
      0
    );
    setTotalAmount(calculatedTotal);
  }, [items]);

  // Form validation function
  const validateForm = () => {
    const errors = {};
    if (!houseId) errors.houseId = "House ID is required.";
    if (!selectedMonth) errors.selectedMonth = "Month is required.";
    if (items.length === 0) errors.items = "At least one item is required.";

    // Check for empty item particulars or invalid quantities/rates
    items.forEach((item, index) => {
      if (!item.particular)
        errors[`item-${index}-particular`] = "Particular is required.";
      if (item.quantity <= 0)
        errors[`item-${index}-quantity`] = "Quantity must be greater than 0.";
      if (item.rate <= 0)
        errors[`item-${index}-rate`] = "Rate must be greater than 0.";
    });

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate form
    if (!validateForm()) {
      notification.error({
        message: "Form validation Error",
        description: "Please fix the errors in the form.",
      });
      return;
    }

    const formData = {
      house_id: houseId,
      total_amount: totalAmount,
      month: selectedMonth,
      items,
    };

    dispatch(invoiceActions.addInvoice(formData))
      .then(() => {
        setSuccessMessage("Invoice added successfully!");
        notification.success({
          message: "Success",
          description: "Invoice added successfully!",
        });
      })
      .catch(() => {
        setSuccessMessage("Invoice added successfully!");
        notification.success({
          message: "Success",
          description: "Invoice added successfully!",
        });
      });

    // Reset form state
    setHouseId("");
    setTotalAmount("");
    setItems([{ particular: "", quantity: 1, rate: 0 }]);
    setFormErrors({});
    dispatch(invoiceActions.getInvoices());
  };

  const handleHouseChange = (e) => {
    const selectedHouseId = e.target.value;
    setHouseId(selectedHouseId);

    // Find the selected house and set its due amount
    const selectedHouse = houses.data.find(
      (house) => house.house_number === selectedHouseId
    );
    setDueAmount(selectedHouse ? selectedHouse.dues : 0); // Update due amount
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = items.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    setItems(updatedItems);
  };

  const handleShowInvoice = (payment) => {
    setSelectedPayment(payment);
    setIsInvoiceOpen(true);
  };

  useEffect(() => {
    if (selectedPayment) {
      console.log("Selected Payment:", selectedPayment);
    }
  }, [selectedPayment]);

  const addItem = () => {
    setItems([...items, { particular: "", quantity: 1, rate: 0 }]);
  };

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const today = new NepaliDate();
  const bsToday = `${today.getYear()}-${String(today.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(today.getDate()).padStart(2, "0")}`;

  if (error) return <div>Error: {error}</div>;

  return (
    <div className="payment-list p-4 bg-slate-200">
      {successMessage && (
        <div className="mb-4 p-2 bg-green-200 text-green-800 rounded">
          {successMessage}
        </div>
      )}
      <div className="flex bg-black bg-opacity-50 w-full">
        <div className="bg-white p-6 shadow-lg w-full">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-lg">Invoice</h3>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="flex gap-4 flex-col md:flex-row justify-evenly">
              <div className="flex flex-col gap-2 w-full">
                <label>House ID:</label>
                <select
                  className="rounded-md py-1 px-4 border-[2px] border-gray-400"
                  value={houseId}
                  onChange={handleHouseChange}
                  required
                >
                  <option value="">Select House Id</option>
                  {houses?.data?.map((house) => (
                    <option key={house.house_number} value={house.house_number}>
                      {house.user_names || `House ID: ${house.house_number}`}
                    </option>
                  ))}
                </select>
                {formErrors.houseId && (
                  <span className="text-red-600 text-sm">
                    {formErrors.houseId}
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-2 w-full">
                <label>Select bill date</label>
                <NepaliDatePicker
                  value={bsToday}
                  onChange={handleDateChange}
                  options={{ calenderLocale: "ne", valueLocale: "en" }}
                  className="custom-date-picker"
                />
              </div>
              <div className="flex flex-col gap-2 w-full">
                <label>Select month</label>
                <select
                  className="rounded-md py-1 px-4 border-[2px] border-gray-400"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                >
                  <option value="" disabled>
                    Select a month
                  </option>
                  {[
                    "January",
                    "February",
                    "March",
                    "April",
                    "May",
                    "June",
                    "July",
                    "August",
                    "September",
                    "October",
                    "November",
                    "December",
                  ].map((month, index) => (
                    <option key={index} value={month}>
                      {month}
                    </option>
                  ))}
                </select>
                {formErrors.selectedMonth && (
                  <span className="text-red-600 text-sm">
                    {formErrors.selectedMonth}
                  </span>
                )}
              </div>
            </div>
            <div className="overflow-x-auto min-w-full">
              <table className="min-w-full bg-white border border-gray-300 mt-8">
                <thead>
                  <tr className="bg-white">
                    <th className="py-2 px-4 border border-gray-300 text-left">
                      S.no
                    </th>
                    <th className="py-2 px-4 border border-gray-300 text-left">
                      Particular
                    </th>
                    <th className="py-2 px-4 border border-gray-300 text-left">
                      Quantity
                    </th>
                    <th className="py-2 px-4 border border-gray-300 text-left">
                      Rate
                    </th>
                    <th className="py-2 px-4 border border-gray-300 text-left">
                      Total
                    </th>
                    <th className="py-2 px-4 border border-gray-300 text-left">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, index) => (
                    <tr key={index}>
                      <td className="py-2 px-4 border border-gray-300">
                        {index + 1}
                      </td>
                      <td className="py-2 px-4 border border-gray-300">
                        <input
                          type="text"
                          value={item.particular}
                          onChange={(e) =>
                            handleItemChange(
                              index,
                              "particular",
                              e.target.value
                            )
                          }
                          className="w-full border px-2 py-1"
                          required
                        />
                        {formErrors[`item-${index}-particular`] && (
                          <span className="text-red-600 text-sm">
                            {formErrors[`item-${index}-particular`]}
                          </span>
                        )}
                      </td>
                      <td className="py-2 px-4 border border-gray-300">
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) =>
                            handleItemChange(
                              index,
                              "quantity",
                              parseInt(e.target.value, 10)
                            )
                          }
                          className="w-full border px-2 py-1"
                          min="1"
                          required
                        />
                        {formErrors[`item-${index}-quantity`] && (
                          <span className="text-red-600 text-sm">
                            {formErrors[`item-${index}-quantity`]}
                          </span>
                        )}
                      </td>
                      <td className="py-2 px-4 border border-gray-300">
                        <input
                          type="number"
                          value={item.rate}
                          onChange={(e) =>
                            handleItemChange(
                              index,
                              "rate",
                              parseFloat(e.target.value)
                            )
                          }
                          className="w-full border px-2 py-1"
                          min="1"
                          required
                        />
                        {formErrors[`item-${index}-rate`] && (
                          <span className="text-red-600 text-sm">
                            {formErrors[`item-${index}-rate`]}
                          </span>
                        )}
                      </td>
                      <td className="py-2 px-4 border border-gray-300">
                        {item.quantity * item.rate}
                      </td>
                      <td className="py-2 px-4 border border-gray-300">
                        <button
                          type="button"
                          className="text-red-600"
                          onClick={() => removeItem(index)}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button
                type="button"
                className="mt-4 text-blue-600"
                onClick={addItem}
              >
                Add Item
              </button>
            </div>
            <div className="flex flex-col items-end mt-4">
              <div>Total Amount: {totalAmount}</div>
              {dueAmount !== null && <div>Due Amount: {dueAmount}</div>}
              <button
                type="submit"
                className="bg-blue-600 text-white py-2 px-4 rounded mt-4"
              >
                Submit Invoice
              </button>
            </div>
          </form>
        </div>
      </div>
      {/* Invoice List */}
      {loading ? (
        <div className="p-12">
          <Skeleton active />
          <Skeleton active />
          <Skeleton active />
        </div>
      ) : (
        <div className="overflow-x-auto mt-10 bg-white p-4">
          <h4 className="font-bold text-xl mb-4">Invoices</h4>
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead>
              <tr className="border-b">
                <th className="py-2 px-4 text-left border-r">ID</th>
                <th className="py-2 px-4 text-left border-r">Amount</th>
                <th className="py-2 px-4 text-left border-r">Date</th>
                <th className="py-2 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices?.data?.map((payment) => (
                <tr key={payment.id} className="border-b hover:bg-gray-100">
                  <td className="py-2 px-4 border-r">{payment.id}</td>
                  <td className="py-2 px-4 border-r">{payment.total_amount}</td>
                  <td className="py-2 px-4 border-r">
                    {new Date(payment.created_at).toLocaleDateString()}
                  </td>
                  <td className="py-2 px-4">
                    <button
                      onClick={() => handleShowInvoice(payment)}
                      className="bg-[#403F93] text-white px-2 py-1 rounded mt-2 ml-2"
                    >
                      Show Invoice
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Invoice Details Modal */}
      {isInvoiceOpen && selectedPayment && (
        <div className="fixed inset-0 flex z-50 bg-black bg-opacity-50">
          <div>
            <button
              onClick={() => setIsInvoiceOpen(false)}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded ml-10"
            >
              x
            </button>
          </div>
          <div className=" bg-white p-8  border border-gray-300 rounded-lg shadow-lg mx-auto my-auto">
            <h2 className="text-xl font-bold text-center mb-2">
              Society of Comfort SMD Awas Bayawasthapan Samiti
            </h2>
            <p className="text-center">thaiba-14, Lalitpur</p>
            <div className="text-sm font-mono border-gray-400 pb-2 mb-4 mt-8">
              <div className="flex justify-between">
                <p>
                  {" "}
                  <strong>House No:</strong> {selectedPayment.house_id}
                </p>
                <p>Date: {selectedPayment.created_at}</p>
              </div>
            </div>
            <div className="mb-4 overflow-x-auto min-w-full">
              <table className="min-w-full bg-white rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-white">
                    <th className="py-2 px-4 border border-gray-300 text-left">
                      S.no
                    </th>

                    <th className="py-2 px-4 border border-gray-300 text-left">
                      Particular
                    </th>
                    <th className="py-2 px-4 border border-gray-300 text-left">
                      Quantity
                    </th>
                    <th className="py-2 px-4 border border-gray-300 text-left">
                      Rate
                    </th>
                    <th className="py-2 px-4 border border-gray-300 text-left">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {/* Mapped Data */}
                  {selectedPayment.invoice_items &&
                  selectedPayment.invoice_items.length > 0 ? (
                    selectedPayment.invoice_items.map((item, index) => (
                      <tr key={item.id}>
                        <td className="py-2 px-4 border border-gray-300 text-left">
                          {index + 1}
                        </td>
                        <td className="py-2 px-4 border border-gray-300 text-left">
                          {item.particular}
                        </td>
                        <td className="py-2 px-4 border border-gray-300 text-left">
                          {item.quantity}
                        </td>
                        <td className="py-2 px-4 border border-gray-300 text-left">
                          {item.rate}
                        </td>
                        <td className="py-2 px-4 border border-gray-300 text-left">
                          {item.quantity * item.rate}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={5}
                        className="py-2 px-4 border border-gray-300 text-center"
                      >
                        No items found for this invoice.
                      </td>
                    </tr>
                  )}
                  <tr className="bg-gray-100 font-bold">
                    <td
                      colSpan={4}
                      className="py-2 px-4 border border-gray-300 text-left"
                    >
                      Amount Total
                    </td>
                    <td className="py-2 px-4 border border-gray-300 text-left">
                      {selectedPayment.total_amount}
                    </td>
                  </tr>

                  {/* Due Amount Total Row */}
                  <tr className="bg-gray-100 font-bold">
                    <td
                      colSpan={4}
                      className="py-2 px-4 border border-gray-300 text-left"
                    >
                      Due Amount Total
                    </td>
                    <td className="py-2 px-4 border border-gray-300 text-left">
                      {selectedPayment.due_at_invoice}
                    </td>
                  </tr>

                  {/* Grand Total Row */}
                  <tr className="bg-gray-200 font-bold">
                    <td
                      colSpan={4}
                      className="py-2 px-4 border border-gray-300 text-left"
                    >
                      Grand Total
                    </td>
                    <td className="py-2 px-4 border border-gray-300 text-left">
                      {Number(selectedPayment.total_amount) +
                        Number(selectedPayment.due_at_invoice)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <button
              onClick={() => setIsInvoiceOpen(false)}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentList;
