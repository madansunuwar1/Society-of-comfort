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
    dispatch(fetchPaymentById(id)).then(() => {
      if (payment) {
        form.setFieldsValue({
          amount: payment.data.amount || "",
          date: payment.data.date || "",
          remarks: payment.data.remarks || "",
        });
        setPreview(payment.data.slip.original_url || null);
      }
    });
  }, [dispatch]);

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

  if (loading || !payment) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error || "Failed to fetch payment data"}</div>;
  }

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      className="bg-white p-6 rounded-lg shadow-lg"
    >
      <Form.Item
        label="Amount"
        name="amount"
        rules={[{ required: true, message: "Please enter the amount" }]}
      >
        <Input type="text" placeholder="Amount" />
      </Form.Item>

      <Form.Item
        label="Date"
        name="date"
        rules={[{ required: true, message: "Please select a date" }]}
      >
        <NepaliDatePicker className="w-full" />
      </Form.Item>

      <Form.Item label="Payment Screenshot">
        <Upload
          beforeUpload={() => false}
          onChange={handleFileChange}
          accept="image/png, image/jpeg"
          maxCount={1}
        >
          <Button icon={<FileImageOutlined />}>Upload</Button>
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

      <Form.Item label="Remarks" name="remarks" rules={[{ required: false }]}>
        <Input.TextArea rows={3} placeholder="Remarks" />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" className="w-full">
          Edit Payment
        </Button>
      </Form.Item>
    </Form>
  );
};

export default EditPayment;
