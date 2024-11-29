import React, { useEffect, useRef, useState } from "react";
import { SlArrowLeft } from "react-icons/sl";
import { Link, useParams } from "react-router-dom";
import { Form, Input, Button, Upload, message } from "antd";
import { NepaliDatePicker } from "nepali-datepicker-reactjs";
import { FileImageOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { fetchPaymentById, updatePayment } from "../redux/paymentSlice";

const EditPayment = () => {
  const [form] = Form.useForm();
  const { id } = useParams();
  const dispatch = useDispatch();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const { payment, loading, error } = useSelector((state) => state.payments);

  useEffect(() => {
    if (id) {
      dispatch(fetchPaymentById(id));
    }
  }, [id, dispatch]);

  console.log("my payment", payment);
  useEffect(() => {
    if (payment) {
      form.setFieldsValue({
        amount: payment.data.amount,
        date: payment.data.date,
        remarks: payment.data.remarks,
      });
      setPreview(payment.data.slip.original_url);
    }
  }, [payment]);

  // Handle file upload preview
  const handleFileChange = (info) => {
    if (info.file.status === "done" || info.file.originFileObj) {
      const uploadedFile = info.file.originFileObj || info.file;
      setFile(uploadedFile);

      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(uploadedFile);
    }
  };

  // Handle form submission
  const handleSubmit = async (values) => {
    const { amount, date, remarks } = values;

    const formData = new FormData();
    formData.append("amount", amount);
    formData.append("date", date);
    formData.append("remarks", remarks);
    if (file) {
      formData.append("slip", file);
    }
    formData.append("_method", "PUT");

    dispatch(updatePayment({ id: id, paymentData: formData }))
      .unwrap()
      .then(() => {
        message.success("Payment updated successfully!");
      })
      .catch((error) => {
        message.error(error || "Failed to update payment");
      });
  };

  // Initialize form values

  return (
    <div className="payment-list bg-[#F5F5F5]">
      <div className="flex justify-between bg-[#3F3F95] px-4 py-2 w-full rounded-b-lg">
        <div className="items-center my-auto">
          <Link to="/userdash">
            <SlArrowLeft className="text-white" />
          </Link>
        </div>
        <h3 className="font-bold flex justify-center mx-auto text-[22px] text-white">
          Edit Payment
        </h3>
      </div>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-lg"
      >
        {/* Amount Field */}
        <Form.Item
          label="Amount"
          name="amount"
          rules={[{ required: true, message: "Please enter the amount" }]}
        >
          <Input
            type="text"
            className="rounded-md px-4 py-1 w-full border-[1px] border-gray-400 mt-2"
            placeholder="Amount"
          />
        </Form.Item>

        {/* Date Picker */}
        <Form.Item
          label="Date"
          name="date"
          rules={[{ required: true, message: "Please select a date" }]}
        >
          <NepaliDatePicker
            options={{ calenderLocale: "en", valueLocale: "en" }}
            className="w-full custom-date-picker"
            required
          />
        </Form.Item>

        {/* Upload Field */}
        <Form.Item label="Payment Screenshot">
          <Upload
            beforeUpload={() => false} // Prevent automatic upload
            onChange={handleFileChange}
            accept="image/png, image/jpeg"
            maxCount={1}
          >
            <Button
              className="bg-[#FEA733] text-white px-4 py-2 rounded-md"
              icon={<FileImageOutlined />}
            >
              Upload
            </Button>
          </Upload>
          {preview && (
            <div className="mt-4">
              <img
                src={preview}
                alt="Preview"
                className="w-full h-auto rounded-md border border-gray-300 mx-auto"
              />
            </div>
          )}
        </Form.Item>

        {/* Remarks Field */}
        <Form.Item label="Remarks" name="remarks" rules={[{ required: false }]}>
          <Input.TextArea
            rows={3}
            placeholder="Remarks"
            className="rounded-md py-2 px-4 w-full border-[1px] border-gray-400 mt-2"
          />
        </Form.Item>

        {/* Submit Button */}
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="bg-[#3F3F95] text-white flex justify-center w-full rounded-lg mt-2"
          >
            Send Payment
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default EditPayment;
