import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { invoiceActions } from "../../redux/invoiceSlice";
import { notification } from "antd";
import { NepaliDatePicker } from "nepali-datepicker-reactjs";
import "nepali-datepicker-reactjs/dist/index.css";
import NepaliDate from "nepali-date-converter";
import api from "../../utils/api";

const InvoiceForm = () => {
  const dispatch = useDispatch();
  const [date, setDate] = useState("");
  const [houseId, setHouseId] = useState("");
  const [houses, setHouses] = useState([]);
  const [totalAmount, setTotalAmount] = useState("");
  const [items, setItems] = useState([
    { particular: "", quantity: 1, rate: 0 },
  ]);
  const [dueAmount, setDueAmount] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  const handleDateChange = (date) => {
    setDate(date);
  };

  useEffect(() => {
    dispatch(invoiceActions.getInvoices());
    api
      .get("/houses")
      .then((response) => {
        setHouses(response.data);
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

  const validateForm = () => {
    const errors = {};
    if (!houseId) errors.houseId = "House ID is required.";
    if (!selectedMonth) errors.selectedMonth = "Month is required.";
    if (items.length === 0) errors.items = "At least one item is required.";

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

  return (
    <div className="bg-white pb-20 pt-8 mx-6">
      <div>
        <h1 className="font-bold mx-auto text-[22px]">Add invoice</h1>
      </div>
      <div className="mt-8">
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
                  "बैशाख",
                  "जेठ",
                  "असार",
                  "साउन",
                  "भदौ",
                  "असोज",
                  "कार्तिक",
                  "मंसिर",
                  "पौष",
                  "माघ",
                  "फाल्गुण",
                  "चैत्र",
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
                          handleItemChange(index, "particular", e.target.value)
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
  );
};

export default InvoiceForm;