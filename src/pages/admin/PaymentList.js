import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { paymentActions } from "../../redux/paymentSlice";
import { Link } from "react-router-dom";
import { SlArrowLeft } from "react-icons/sl";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const PaymentList = () => {
  const dispatch = useDispatch();
  const { payments, loading, error } = useSelector((state) => state.payments);
  const [updating, setUpdating] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);

  // Invoice form state
  const [remarks, setRemarks] = useState("");
  const [monthlyCharge, setMonthlyCharge] = useState("");
  const [houseNo, setHouseNo] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [waterCharges, setWaterCharges] = useState("");
  const [otherCharges, setOtherCharges] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [specifics, setSpecifics] = useState([]);

  useEffect(() => {
    dispatch(paymentActions.getPayments());
  }, [dispatch]);

  const handleStatusChange = async (id, currentStatus) => {
    const newStatus = currentStatus === "Pending" ? "Confirmed" : "Pending";

    setUpdating(true);

    try {
      await dispatch(
        paymentActions.updatePaymentStatus({ id, status: newStatus })
      );
      setSuccessMessage("Status changed successfully!");
      await dispatch(paymentActions.getPayments());
    } catch (error) {
      alert("sucessfull update status");
      dispatch(paymentActions.getPayments());
    } finally {
      setUpdating(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Create form data object
    const formData = {
      remarks,
      monthlyCharge,
      houseNo,
      ownerName,
      waterCharges,
      otherCharges,
    };

    // Process the form data (e.g., dispatch an action to add payment)
    alert("Invoice generated");
    // Here, you could dispatch an action to add the payment using formData

    // Reset form
    setRemarks("");
    setMonthlyCharge("");
    setHouseNo("");
    setOwnerName("");
    setWaterCharges("");
    setOtherCharges("");
    setIsModalOpen(false);
    setIsInvoiceOpen(true); // Close modal
  };

  const handleShowInvoice = (payment) => {
    setSelectedPayment(payment);
    setIsInvoiceOpen(true);
  };

  const addSpecific = () => {
    setSpecifics([
      ...specifics,
      { particular: "", quantity: 0, rate: 0, total: 0 },
    ]);
  };

  const handleSpecificChange = (index, field, value) => {
    const updatedSpecifics = specifics.map((specific, i) =>
      i === index ? { ...specific, [field]: value } : specific
    );
    setSpecifics(updatedSpecifics);
  };

  const removeSpecific = (index) => {
    setSpecifics(specifics.filter((_, i) => i !== index));
  };

  if (loading || updating) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="payment-list p-2 bg-slate-200">
      <div className="flex px-6">
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
              <th className="py-2 px-4 text-left">Payment ID</th>
              <th className="py-2 px-4 text-left">Amount</th>
              <th className="py-2 px-4 text-left">Date</th>
              <th className="py-2 px-4 text-left">Status</th>
              <th className="py-2 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {payments?.data?.map((payment) => (
              <tr
                key={payment.payment.id}
                className="border-b hover:bg-gray-100"
              >
                <td className="py-2 px-4">{payment.payment.id}</td>
                <td className="py-2 px-4">{payment.payment.amount}</td>
                <td className="py-2 px-4">{payment.payment.date}</td>
                <td className="py-2 px-4">{payment.payment.status}</td>
                <td className="py-2 px-4">
                  <button
                    onClick={() =>
                      handleStatusChange(
                        payment.payment.id,
                        payment.payment.status
                      )
                    }
                    className="bg-blue-500 text-white px-2 py-1 rounded mt-2"
                  >
                    Change Status
                  </button>
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
              <input
                className="rounded-xl py-2 px-4 shadow-sm border"
                type="text"
                placeholder="House Number"
                value={houseNo}
                onChange={(e) => setHouseNo(e.target.value)}
                required
              />
              <DatePicker
                className="rounded-xl py-2 px-4 shadow-sm border w-full"
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                placeholderText="Select a date"
                dateFormat="yyyy-MM-dd"
                required
              />
              <input
                className="rounded-xl py-2 px-4 shadow-sm border"
                type="text"
                placeholder="Owner Name"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                required
              />

              {/* Button to add specifics */}
              <button
                type="button"
                className="bg-[#403F93] text-white py-2 rounded-3xl"
                onClick={addSpecific}
              >
                Add Specifics
              </button>

              {/* List of specifics input fields */}
              {specifics.map((specific, index) => (
                <div key={index} className="flex gap-4 items-center mt-4">
                  <div className="flex-1">
                    <label className="block mb-1">Particular</label>
                    <input
                      className="rounded-xl py-2 px-4 shadow-sm border w-full"
                      type="text"
                      value={specific.particular}
                      onChange={(e) =>
                        handleSpecificChange(
                          index,
                          "particular",
                          e.target.value
                        )
                      }
                      placeholder="e.g., Water Charge"
                      required
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block mb-1">Quantity</label>
                    <input
                      className="rounded-xl py-2 px-4 shadow-sm border w-full"
                      type="number"
                      value={specific.quantity}
                      onChange={(e) =>
                        handleSpecificChange(index, "quantity", e.target.value)
                      }
                      required
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block mb-1">Rate</label>
                    <input
                      className="rounded-xl py-2 px-4 shadow-sm border w-full"
                      type="number"
                      value={specific.rate}
                      onChange={(e) =>
                        handleSpecificChange(index, "rate", e.target.value)
                      }
                      required
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block mb-1">Total</label>
                    <input
                      className="rounded-xl py-2 px-4 shadow-sm border w-full"
                      type="number"
                      value={specific.quantity * specific.rate}
                      readOnly
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeSpecific(index)}
                    className="text-red-500 text-xl"
                  >
                    &times;
                  </button>
                </div>
              ))}

              {/* Displaying specifics as a list */}
              <div className="mt-4">
                <h4 className="font-bold mb-2">Bill Summary</h4>
                <ul className="list-none">
                  {specifics.map((specific, index) => (
                    <li
                      key={index}
                      className="flex justify-between items-center mb-2"
                    >
                      <span>{specific.particular}</span>
                      <span>{specific.quantity}</span>
                      <span>{specific.rate}</span>
                      <span>{specific.quantity * specific.rate}</span>
                    </li>
                  ))}
                </ul>
              </div>

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
              <strong>Bill To:</strong>
              <p>House No: {selectedPayment.houseNo}</p>
              <p>Owner: {selectedPayment.ownerName}</p>
            </div>

            <div className="text-sm font-mono border-b border-gray-400 pb-2 mb-4">
              <strong>Payment Details:</strong>
              <p>
                Monthly Charge:{" "}
                <span className="float-right">
                  ${selectedPayment.monthlyCharge}
                </span>
              </p>
              <p>
                Water Charges:{" "}
                <span className="float-right">
                  ${selectedPayment.waterCharges}
                </span>
              </p>
              <p>
                Other Charges:{" "}
                <span className="float-right">
                  ${selectedPayment.otherCharges}
                </span>
              </p>
            </div>

            <div className="text-sm font-mono border-b border-gray-400 pb-2 mb-4">
              <strong>Remarks:</strong>
              <p>{selectedPayment.remarks}</p>
            </div>

            <button
              onClick={() => setIsInvoiceOpen(false)}
              className="bg-gray-500 text-white rounded-lg py-2 mt-4 w-full"
            >
              Close Invoice
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentList;
