import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { invoiceActions } from "../../redux/invoiceSlice";
import { settingsActions } from "../../redux/settingsSlice";
import { notification, Button, Select, Input } from "antd";
import api from "../../utils/api";
import { NepaliDatePicker } from "nepali-datepicker-reactjs";
import "nepali-datepicker-reactjs/dist/index.css";
import { EditOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import { ADToBS } from "bikram-sambat-js";

const InvoiceForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const settings = useSelector((state) => state.settings.settings);
  const { invoices, loading, error } = useSelector((state) => state.invoices);

  const [date, setDate] = useState("");
  const [houseId, setHouseId] = useState("");
  const [houses, setHouses] = useState([]);
  const [totalAmount, setTotalAmount] = useState("");
  const [items, setItems] = useState([
    { particular: "", quantity: 1, rate: 0 },
  ]);
  const [dueAmount, setDueAmount] = useState(null);
  const [dueUnit, setDueUnit] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [newWaterUnit, setNewWaterUnit] = useState(0);
  const [successMessage, setSuccessMessage] = useState("");
  const [customOptions, setCustomOptions] = useState([]);
  const [isDuplicating, setIsDuplicating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [invoiceId, setInvoiceId] = useState(null);
  const [water, setWater] = useState(0);

  const handleDateChange = (date) => {
    setDate(date);
  };

  useEffect(() => {
    try {
      const today = new Date();
      console.log(today);
      const nepaliDate = ADToBS(today);
      setDate(nepaliDate);
    } catch (error) {
      console.error("Error converting AD to BS:", error);
    }
  }, []);

  useEffect(() => {
    if (location.state) {
      console.log(water);
      // Check if invoiceData exists for editing
      if (location.state?.invoiceData) {
        const invoiceData = location.state.invoiceData;
        setHouseId(invoiceData.house_id);
        setSelectedMonth(invoiceData.month);
        setItems(
          invoiceData.items.map((item) => ({
            particular: item.particular,
            quantity: item.quantity,
            rate: item.rate,
          }))
        );
        setDate(invoiceData.invoice_date);
        setInvoiceId(invoiceData.id);
        setDueAmount(invoiceData?.due);
        setWater(invoiceData.old_water_unit); // Store the invoice ID for update
        setIsEditing(true);
      }
      // Check if duplicateData exists for duplicating
      else if (location.state?.duplicateData) {
        const duplicateData = location.state.duplicateData;
        setHouseId(duplicateData.house_id);
        setSelectedMonth(duplicateData.month);
        setItems(
          duplicateData.items.map((item) => ({
            particular: item.particular,
            quantity: item.quantity,
            rate: item.rate,
          }))
        );
        setDate(duplicateData.invoice_date);
        setDueAmount(duplicateData?.due);
        setWater(duplicateData.old_water_unit);
        setIsDuplicating(true);
      }
    } else {
      // Default case when there is no editing or duplicating
      const activeSettings = settings.filter((setting) => setting.status === 1);

      // Map active settings to items and set the initial items
      const initialItems = activeSettings.map((setting) => ({
        particular: setting.setting_name,
        quantity: 1,
        rate: setting.setting_value || 0,
      }));

      setItems(initialItems);
    }
  }, [location.state, settings]);

  useEffect(() => {
    dispatch(settingsActions.getSettings());
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
    setIsDuplicating(false);
    setIsEditing(false);

    // Validate form
    if (!validateForm()) {
      notification.error({
        message: "Error",
        description: "errors in the form.",
      });
      return;
    }

    const formData = {
      house_id: houseId,
      total_amount: totalAmount,
      month: selectedMonth,
      invoice_date: date,
      water_unit: newWaterUnit,
      items,
    };

    if (isEditing) {
      dispatch(
        invoiceActions.updateInvoice({ id: invoiceId, invoiceData: formData })
      )
        .unwrap()
        .then(() => {
          setSuccessMessage("Invoice updated successfully!");
          notification.success({
            message: "Success",
            description: "Invoice updated successfully!",
          });
          dispatch(invoiceActions.getInvoices());
          navigate("/dashboard/paymentlist");
        })
        .catch((err) => {
          notification.error({
            message: "Error",
            description: `An error occurred while updating the invoice: ${err?.errors}`,
          });
        });
    } else {
      // Add new invoice
      dispatch(invoiceActions.addInvoice(formData))
        .unwrap()
        .then(() => {
          setSuccessMessage("Invoice added successfully!");
          notification.success({
            message: "Success",
            description: isDuplicating
              ? "Duplicated invoice added successfully!"
              : "Invoice added successfully!",
          });
          dispatch(invoiceActions.getInvoices());
          navigate("/dashboard/paymentlist");
        })
        .catch((err) => {
          notification.error({
            message: "Error",
            description: `An error occurred while adding the invoice: ${JSON.stringify(
              err?.errors
            )}`,
          });
        });
    }

    // Reset form state
    setHouseId("");
    setTotalAmount("");
    setItems([{ particular: "", quantity: 1, rate: 0 }]);
    setFormErrors({});
    setNewWaterUnit(0);
    setDate("");
    setDueAmount(null);
    setIsDuplicating(false);
    setIsEditing(false);
    setInvoiceId(null);
    dispatch(invoiceActions.getInvoices());
  };

  const handleSaveAndAddNew = async () => {
    // Validate form
    if (!validateForm()) {
      notification.error({
        message: "Error",
        description: "There are errors in the form.",
      });
      return;
    }

    const formData = {
      house_id: houseId,
      total_amount: totalAmount,
      month: selectedMonth,
      invoice_date: date,
      water_unit: newWaterUnit,
      items,
    };

    dispatch(invoiceActions.addInvoice(formData))
      .unwrap() // This will ensure we can handle the result directly
      .then(() => {
        setSuccessMessage("Invoice added successfully!");
        notification.success({
          message: "Success",
          description: isDuplicating
            ? "Duplicated invoice added successfully!"
            : "Invoice added successfully!",
        });
      })
      .catch((err) => {
        // Display the error notification
        notification.error({
          message: "Error",
          description: JSON.stringify(err.error),
        });
      });
    navigate("/dashboard/paymentlist");
  };

  const handleHouseChange = (e) => {
    const selectedHouseId = e.target.value;
    setHouseId(selectedHouseId);

    // Find the selected house and set its due amount
    const selectedHouse = houses.data.find(
      (house) => String(house.id) === selectedHouseId
    );
    setDueAmount(selectedHouse ? selectedHouse.dues : 0); // Update due amount
    setDueUnit(selectedHouse ? selectedHouse.water_unit : 0);
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = items.map((item, i) => {
      if (i === index) {
        if (field === "particular") {
          // Check if the value exists in settings
          const selectedSetting = settings.find(
            (setting) => setting.setting_name === value
          );

          // If it's a custom value and not in customOptions, add it
          if (!selectedSetting && !customOptions.includes(value)) {
            setCustomOptions([...customOptions, value]);
          }

          return {
            ...item,
            particular: value,
            rate: selectedSetting ? selectedSetting.setting_value : item.rate,
          };
        } else if (field === "newWaterUnit") {
          setNewWaterUnit(value);
          const selectedHouse = houses.data.find(
            (house) => house.id === houseId
          );
          const oldWaterUnit = isEditing ? water : dueUnit || 0;
          const calculatedQuantity = value - oldWaterUnit;
          return {
            ...item,
            quantity: calculatedQuantity >= 0 ? calculatedQuantity : 0,
          };
        } else {
          return { ...item, [field]: value };
        }
      }
      return item;
    });
    setItems(updatedItems);
  };

  const getSelectedParticulars = () => {
    return items.map((item) => item.particular).filter(Boolean);
  };

  const renderParticularSelect = (item, index) => (
    <Select
      showSearch
      value={item.particular || undefined}
      onChange={(value) => handleItemChange(index, "particular", value)}
      placeholder="Select or Type Particular"
      style={{ width: 200 }}
      filterOption={(input, option) => {
        // Handle both predefined and custom options
        const optionValue = option.value?.toLowerCase() || "";
        return optionValue.includes(input.toLowerCase());
      }}
      allowClear
      disabled={!houseId}
      onSearch={(value) => {
        // When user types, temporarily add it as an option
        if (
          value &&
          !settings.some((s) => s.setting_name === value) &&
          !customOptions.includes(value)
        ) {
          setCustomOptions([...customOptions, value]);
        }
      }}
      onBlur={() => {
        // If there's a value in the input, ensure it's added to options
        if (
          item.particular &&
          !settings.some((s) => s.setting_name === item.particular) &&
          !customOptions.includes(item.particular)
        ) {
          setCustomOptions([...customOptions, item.particular]);
        }
      }}
    >
      {/* Render predefined settings */}
      <Select.OptGroup label="Predefined Settings">
        {settings.map((setting) => {
          const isSelected = getSelectedParticulars().includes(
            setting.setting_name
          );
          const isCurrentItem = item.particular === setting.setting_name;
          return (
            <Select.Option
              key={setting.setting_name}
              value={setting.setting_name}
              disabled={isSelected && !isCurrentItem}
            >
              {setting.setting_name}
            </Select.Option>
          );
        })}
      </Select.OptGroup>

      {/* Render custom options if any */}
      {customOptions.length > 0 && (
        <Select.OptGroup label="Custom Items">
          {customOptions.map((option) => (
            <Select.Option key={option} value={option}>
              {option}
            </Select.Option>
          ))}
        </Select.OptGroup>
      )}
    </Select>
  );

  const addItem = () => {
    setItems([...items, { particular: "", quantity: 1, rate: 0 }]);
  };

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  return (
    <div className=" pb-20 pt-8 px-8">
      <div>
        <h1 className="font-bold mx-auto text-[22px]">
          {isEditing
            ? "Edit Invoice"
            : isDuplicating
            ? "Duplicate Invoice"
            : "Add Invoice"}
        </h1>
      </div>
      <div className=" bg-slate-200 rounded-lg p-8">
        <form onSubmit={handleSubmit}>
          <div className="flex gap-4 flex-col md:flex-row justify-evenly">
            <div className="flex flex-col gap-2 w-full">
              <label>House ID:</label>
              <select
                className="rounded-md py-1 px-4 border-[2px] border-gray-400"
                value={houseId}
                onChange={handleHouseChange}
                disabled={isEditing}
                required
              >
                <option value="">Select House Id</option>
                {houses?.data?.map((house) => (
                  <option key={house.house_number} value={house.id}>
                    {house.house_number}
                  </option>
                ))}
              </select>
              {!houseId && (
                <div className="text-gray-500 ml-2">
                  Select house id first to add invoice
                </div>
              )}
              {formErrors.houseId && (
                <span className="text-red-600 text-sm">
                  {formErrors.houseId}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-2 w-full">
              <label>Select Date</label>
              <NepaliDatePicker
                options={{ calenderLocale: "en", valueLocale: "en" }}
                value={date || ""}
                onChange={handleDateChange}
                disabled={isEditing && !houseId}
                className="custom-date-picker"
              />
            </div>
            <div className="flex flex-col gap-2 w-full">
              <label>Select month</label>
              <select
                className="rounded-md py-1 px-4 border-[2px] border-gray-400"
                value={selectedMonth}
                disabled={!houseId}
                onChange={(e) => setSelectedMonth(e.target.value)}
              >
                <option value="" disabled>
                  Select a month
                </option>
                {[
                  "Baisakh",
                  "Jeth",
                  "Asar",
                  "Shrawn",
                  "Bhadau",
                  "Ashoj",
                  "Kartik",
                  "Mangsir",
                  "Poush",
                  "Magh",
                  "Falgun",
                  "Chaitra",
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
          <div className="overflow-x-auto min-w-full rounded-lg p-4 bg-white mt-8">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-white">
                  <th className="py-2 px-4 border-r border-b border-gray-300 text-left">
                    S.no
                  </th>
                  <th className="py-2 px-4 border-r border-b border-gray-300 text-left">
                    Particular
                  </th>
                  <th className="py-2 px-4 border-r border-b border-gray-300 text-left">
                    Quantity
                  </th>
                  <th className="py-2 px-4 border-r border-b border-gray-300 text-left">
                    Rate
                  </th>
                  <th className="py-2 px-4 border-r border-b border-gray-300 text-left">
                    Total
                  </th>
                  <th className="py-2 px-4 border-b border-gray-300 text-left">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={index}>
                    <td className="py-2 px-4 border-r border-gray-300">
                      {index + 1}
                    </td>
                    <td className="py-2 px-4 border-r border-gray-300">
                      {renderParticularSelect(item, index)}
                      {formErrors[`item-${index}-particular`] && (
                        <span className="text-red-600 text-sm">
                          {formErrors[`item-${index}-particular`]}
                        </span>
                      )}
                      {item.particular === "water_charges" && (
                        <input
                          type="number"
                          value={item.newWaterUnit}
                          onChange={(e) =>
                            handleItemChange(
                              index,
                              "newWaterUnit",
                              parseInt(e.target.value, 10)
                            )
                          }
                          disabled={!houseId}
                          placeholder="New Water Unit"
                          className="w-full border px-2 py-1"
                          min="0"
                        />
                      )}
                    </td>
                    <td className="py-2 px-4 border-r border-gray-300">
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
                        disabled={!houseId}
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
                    <td className="py-2 px-4 border-r border-gray-300">
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
                        disabled={!houseId}
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
                    <td className="py-2 px-4 border-r border-gray-300">
                      {item.quantity * item.rate}
                    </td>
                    <td className="py-2 px-4">
                      <Button
                        danger
                        onClick={() => removeItem(index)}
                        className="bg-red-600 hover:bg-red-800"
                        icon={<DeleteOutlined />}
                      />
                    </td>
                  </tr>
                ))}
                <tr className="">
                  <td className="py-2 px-4 border-r border-b border-gray-300 pt-20"></td>
                  <td className="py-2 px-4 border-r border-b border-gray-300 pt-20">
                    Due
                  </td>
                  <td className="py-2 px-4 border-r border-b border-gray-300 pt-20"></td>
                  <td className="py-2 px-4 border-r border-b border-gray-300 pt-20"></td>
                  <td className="py-2 px-4 border-r border-b border-gray-300 pt-20">
                    {dueAmount}
                  </td>
                  <td className="py-2 px-4 pt-20 border-b"> </td>
                </tr>

                <tr className="">
                  <td className="py-2 px-4 border-r border-b border-gray-300"></td>
                  <td className="py-2 px-4 border-r border-b border-gray-300">
                    old water unit
                  </td>
                  <td className="py-2 px-4 border-r border-b border-gray-300"></td>
                  <td className="py-2 px-4 border-r border-b border-gray-300"></td>
                  <td className="py-2 px-4 border-r border-b border-gray-300">
                    {dueUnit}
                  </td>
                  <td className="py-2 px-4 border-b"> </td>
                </tr>
                <tr className="">
                  <td className="py-2 px-4 border-r border-b border-gray-300"></td>
                  <td className="py-2 px-4 border-r border-b border-gray-300">
                    Grand Total
                  </td>
                  <td className="py-2 px-4 border-r border-b border-gray-300"></td>
                  <td className="py-2 px-4 border-r border-b border-gray-300"></td>
                  <td className="py-2 px-4 border-r border-b border-gray-300">
                    {totalAmount}
                  </td>
                  <td className="py-2 px-4 border-b"> </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mt-4">
            <button
              type="button"
              className="bg-orange-800 text-white py-1 px-4 rounded mt-4 mr-4"
              onClick={addItem}
            >
              Add Item
            </button>
            <button
              type="submit"
              className="bg-green-800 text-white py-1 px-4 rounded mt-4 mr-4"
            >
              {isEditing ? "Update Invoice" : "Submit Invoice"}
            </button>
            <button
              type="button"
              className="bg-blue-800 text-white py-1 px-4 rounded mt-4"
              onClick={handleSaveAndAddNew}
            >
              Save and Add New
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InvoiceForm;
