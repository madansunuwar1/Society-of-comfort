import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Form, Input, Button, message } from "antd";
import { addWorker } from "../../redux/workerSlice";
import { useNavigate } from "react-router-dom"; // Assuming workerSlice is correctly set up

const AddWorker = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // Form validation and submit handler
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    const workerData = {
      name: values.name,
      email: values.email,
      phone_number: values.phone_number,
      address: values.address,
    };

    try {
      // Dispatch the action to add the worker and unwrap the result
      const response = await dispatch(addWorker(workerData)).unwrap();
      message.success("Worker added successfully");
      form.resetFields();
      navigate("/dashboard/workerlist"); // Reset the form after successful submission
    } catch (err) {
      message.error(err || "Failed to add worker");
    }
  };

  return (
    <div className="w-full bg-slate-200 p-6 pb-20 rounded-lg shadow-md">
      <div className="bg-white rounded-lg p-4">
        <h1 className="text-xl font-semibold mb-4">Add Worker</h1>
        <div className="bg-gray-300 rounded-lg p-4">
          <div className="py-6 bg-white rounded-lg m-3 p-4">
            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              initialValues={{
                name: "",
                email: "",
                phone_number: "",
                address: "",
              }}
            >
              <Form.Item
                label="Name"
                name="name"
                rules={[{ required: true, message: "Name is required" }]}
              >
                <Input placeholder="Enter name" />
              </Form.Item>

              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: "Email is required" },
                  { type: "email", message: "Please enter a valid email" },
                ]}
              >
                <Input placeholder="Enter email" />
              </Form.Item>

              <Form.Item
                label="Phone Number"
                name="phone_number"
                rules={[
                  { required: true, message: "Phone number is required" },
                ]}
              >
                <Input placeholder="Enter phone number" />
              </Form.Item>

              <Form.Item
                label="Address"
                name="address"
                rules={[{ required: true, message: "Address is required" }]}
              >
                <Input placeholder="Enter address" />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="bg-green-800 text-white hover:bg-green-600"
                >
                  Add Worker
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddWorker;
