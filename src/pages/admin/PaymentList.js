import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { invoiceActions } from "../../redux/invoiceSlice";
import { Link } from "react-router-dom";
import { SlArrowLeft } from "react-icons/sl";
import DatePicker from "react-datepicker";
import api from "../../utils/api";
import "react-datepicker/dist/react-datepicker.css";

const PaymentList = () => {
  const dispatch = useDispatch();
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
    { particular: "", quantity: 0, rate: 0 },
  ]);
  const [dueAmount, setDueAmount] = useState(null);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    const calculatedTotal = items.reduce(
      (acc, item) => acc + item.quantity * item.rate,
      0
    );

    const formData = {
      house_id: houseId,
      total_amount: totalAmount || calculatedTotal,
      items,
    };

    dispatch(invoiceActions.addInvoice(formData))
      .then(() => {
        setSuccessMessage("Invoice added successfully!");
      })
      .catch(() => {
        alert("Failed to add invoice");
      });

    // Reset form state
    setHouseId("");
    setTotalAmount("");
    setItems([{ particular: "", quantity: 0, rate: 0 }]);
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

  const handleShowInvoice = (payment) => {
    setSelectedPayment(payment);
    setIsInvoiceOpen(true);
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = items.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    setItems(updatedItems);
  };

  const addItem = () => {
    setItems([...items, { particular: "", quantity: 0, rate: 0 }]);
  };

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  if (loading || updating) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="payment-list p-4 bg-slate-200">
      {successMessage && (
        <div className="mb-4 p-2 bg-green-200 text-green-800 rounded">
          {successMessage}
        </div>
      )}
      <div className=" flex bg-black bg-opacity-50 w-full">
        <div className="bg-white p-6 shadow-lg w-full">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-lg">Invoice</h3>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="flex gap-4 justify-evenly">
              <div className="flex flex-col gap-2 w-full">
                <label>House ID:</label>
                <select
                  className="rounded-md py-3 px-4 border-[2px] border-gray-400"
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
              </div>
              <div className="flex flex-col gap-2 w-full">
                <label>Total Amount (optional):</label>
                <input
                  className="rounded-md py-3 px-4 border-[2px] border-gray-400"
                  type="number"
                  value={totalAmount}
                  onChange={(e) => setTotalAmount(e.target.value)}
                  placeholder="Auto-calculated if left blank"
                />
              </div>
            </div>

            <h4 className="font-bold text-xl mt-6">Items</h4>
            <table className="min-w-full bg-white border border-gray-300 mt-4">
              <thead>
                <tr className="bg-gray-200">
                  <th className="py-2 px-4 text-left">Particular</th>
                  <th className="py-2 px-4 text-left">Quantity</th>
                  <th className="py-2 px-4 text-left">Rate</th>
                  <th className="py-2 px-4 text-left">Total</th>
                  <th className="py-2 px-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={index} className="border-b hover:bg-gray-100">
                    <td className="py-2 px-4">
                      <input
                        className="rounded-md py-1 px-2 border border-gray-400 w-full"
                        type="text"
                        value={item.particular}
                        onChange={(e) =>
                          handleItemChange(index, "particular", e.target.value)
                        }
                        placeholder="Particular"
                        required
                      />
                    </td>
                    <td className="py-2 px-4">
                      <input
                        className="rounded-md py-1 px-2 border border-gray-400 w-full"
                        type="number"
                        value={item.quantity}
                        onChange={(e) =>
                          handleItemChange(
                            index,
                            "quantity",
                            parseInt(e.target.value)
                          )
                        }
                        placeholder="Quantity"
                        required
                      />
                    </td>
                    <td className="py-2 px-4">
                      <input
                        className="rounded-md py-1 px-2 border border-gray-400 w-full"
                        type="number"
                        value={item.rate}
                        onChange={(e) =>
                          handleItemChange(
                            index,
                            "rate",
                            parseFloat(e.target.value)
                          )
                        }
                        placeholder="Rate"
                        required
                      />
                    </td>
                    <td className="py-2 px-4">{item.quantity * item.rate}</td>
                    <td className="py-2 px-4">
                      <button
                        className="bg-red-600 text-white py-1 px-4 rounded-lg"
                        type="button"
                        onClick={() => removeItem(index)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-between">
              <div className="flex gap-2 mt-8">
                <button
                  className="bg-green-600 text-white py-2 px-4 rounded-lg"
                  type="button"
                  onClick={addItem}
                >
                  Add Item
                </button>
                <button
                  type="submit"
                  className="bg-[#403F93] text-white py-2 px-8 rounded-lg"
                >
                  Add Payment
                </button>
              </div>
              <div className="mt-8">
                {houseId && ( // Conditionally render due amount
                  <div className="mt-2 text-sm border-[2px] rounded-lg px-4 py-2">
                    <div className="flex flex-col">
                      <span className="text-md font-bold">Due Amount</span>
                      <span className="text-lg">Rs {dueAmount}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
      <div className="overflow-x-auto mt-10 bg-white p-4">
        <h4 className="font-bold text-xl mb-4">Items</h4>
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead>
            <tr>
              <th className="py-2 px-4 text-left">ID</th>
              <th className="py-2 px-4 text-left">Amount</th>
              <th className="py-2 px-4 text-left">Date</th>
              <th className="py-2 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {invoices?.data?.map((payment) => (
              <tr key={payment.id} className="border-b hover:bg-gray-100">
                <td className="py-2 px-4">{payment.id}</td>
                <td className="py-2 px-4">{payment.total_amount}</td>
                <td className="py-2 px-4">
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

      {isInvoiceOpen && selectedPayment && (
        <div className="fixed inset-0 flex z-50 bg-black bg-opacity-50">
          <div className="w-full bg-white p-8 m-8 md:m-20  border border-gray-300 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-center mb-2">
              Society of Comfort SMD
            </h2>
            <h2 className="text-2xl font-bold text-center mb-6">Invoice</h2>

            <div className="text-sm font-mono border-b border-gray-400 pb-2 mb-4">
              <strong>House ID:</strong> {selectedPayment.house_id}
            </div>

            <h4 className="font-bold mb-4">items:</h4>
            <ul className="mb-4">
              {/* Check if selectedPayment.items exists before mapping */}
              {selectedPayment.invoice_items &&
              selectedPayment.invoice_items.length > 0 ? (
                selectedPayment.invoice_items.map((item, index) => (
                  <li
                    key={index}
                    className="flex justify-between border-b py-2"
                  >
                    <span>{item.particular}</span>
                    <span>
                      {item.quantity} x {item.rate}
                    </span>
                  </li>
                ))
              ) : (
                <li>No items found for this invoice.</li>
              )}
            </ul>

            <div className="flex justify-between font-bold text-lg border-t border-gray-400 pt-2">
              <span>Total:</span>
              <span>{selectedPayment.total_amount}</span>
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
