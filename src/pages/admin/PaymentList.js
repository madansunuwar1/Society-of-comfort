import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { invoiceActions } from "../../redux/invoiceSlice";
import { Link } from "react-router-dom";
import { SlArrowLeft } from "react-icons/sl";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const PaymentList = () => {
  const dispatch = useDispatch();
  const { invoices, loading, error } = useSelector((state) => state.invoices);
  const [updating, setUpdating] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);

  // Invoice form state
  const [houseId, setHouseId] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [items, setItems] = useState([
    { particular: "", quantity: 0, rate: 0 },
  ]);

  useEffect(() => {
    dispatch(invoiceActions.getInvoices());
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
    setIsModalOpen(false);
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
      <div className="flex px-6 py-4">
        <div className="items-center my-auto">
          <Link to="/dashboard">
            <SlArrowLeft />
          </Link>
        </div>
        <h3 className="font-bold flex justify-center mx-auto text-[22px]">
          Payment
        </h3>
      </div>
      {successMessage && (
        <div className="mb-4 p-2 bg-green-200 text-green-800 rounded">
          {successMessage}
        </div>
      )}
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-green-500 text-white px-4 py-2 rounded mb-4"
      >
        Add Payment
      </button>
      {/* Payment Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-gray-200">
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
                    className="bg-yellow-500 text-white px-2 py-1 rounded mt-2 ml-2"
                  >
                    Show Invoice
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for Add Payment */}
      {isModalOpen && (
        <div className="fixed inset-0 flex z-50 bg-black bg-opacity-50 w-full">
          <div className="bg-white p-6 shadow-lg w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">Add Payment</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-xl">
                &times;
              </button>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <label>
                House ID:
                <input
                  className="rounded-xl py-2 px-4 shadow-sm border ml-4"
                  type="text"
                  value={houseId}
                  onChange={(e) => setHouseId(e.target.value)}
                  required
                />
              </label>
              <label>
                Total Amount (optional):
                <input
                  className="rounded-xl py-2 px-4 shadow-sm border ml-4"
                  type="number"
                  value={totalAmount}
                  onChange={(e) => setTotalAmount(e.target.value)}
                  placeholder="Auto-calculated if left blank"
                />
              </label>

              <h4 className="font-bold text-xl">items</h4>
              {items.map((item, index) => (
                <div key={index} className="flex gap-2">
                  <label>Particular</label>
                  <input
                    className="rounded-xl py-2 px-4 shadow-sm border ml-4"
                    type="text"
                    value={item.particular}
                    onChange={(e) =>
                      handleItemChange(index, "particular", e.target.value)
                    }
                    placeholder="Particular"
                    required
                  />
                  <label>Quantity</label>
                  <input
                    className="rounded-xl py-2 px-4 shadow-sm border ml-4"
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
                  <label>Rate</label>
                  <input
                    className="rounded-xl py-2 px-4 shadow-sm border ml-4"
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
                  <button
                    className="bg-red-400 text-white py-2 px-4 rounded-3xl"
                    type="button"
                    onClick={() => removeItem(index)}
                  >
                    Remove
                  </button>
                </div>
              ))}

              <button
                className="bg-green-400 text-white py-2 px-4 rounded-3xl"
                type="button"
                onClick={addItem}
              >
                Add Item
              </button>
              <button
                type="submit"
                className="bg-[#403F93] text-white py-2 rounded-3xl"
              >
                Add Payment
              </button>
            </form>
          </div>
        </div>
      )}
      {/* Invoice Modal */}
      {isInvoiceOpen && selectedPayment && (
        <div className="fixed inset-0 flex z-50 bg-black bg-opacity-50">
          <div className="w-full bg-white p-8 border border-gray-300 rounded-lg shadow-lg">
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
