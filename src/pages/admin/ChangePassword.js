import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, message, notification } from "antd";

const ChangePassword = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const id = user.user.id;
  const url = `https://dev.waveplusit.com/api/change-password/${id}`;

  const handlePasswordChange = async (values) => {
    try {
      const response = await axios.post(url, values);
      if (response.status === 200) {
        notification.success({
          message: "Password changed successfully",
        });
        localStorage.removeItem("user");
        navigate("/signin");
      } else {
        throw new Error("Network response not ok");
      }
    } catch (error) {
      message.error("Failed to change password");
      console.error("Error:", error);
    }
  };

  return (
    <div className="w-full bg-slate-200 p-6 pb-20 rounded-lg shadow-md">
      <div className="bg-white rounded-lg p-4">
        <h1 className="text-xl font-semibold mb-4">Change Password</h1>
        <div className="bg-gray-300 rounded-lg p-4">
          <div className="py-6 bg-white rounded-lg m-3 p-4">
            <Form
              form={form}
              layout="vertical"
              // onFinish={handlePasswordChange}
              initialValues={{
                old_password: "",
                password: "",
                password_confirmation: "",
              }}
            >
              <Form.Item
                label="Old Password"
                name="old_password"
                rules={[
                  { required: true, message: "Old password is required" },
                ]}
              >
                <Input.Password placeholder="Enter old password" />
              </Form.Item>

              <Form.Item
                label="New Password"
                name="password"
                rules={[
                  { required: true, message: "New password is required" },
                ]}
              >
                <Input.Password placeholder="Enter new password" />
              </Form.Item>

              <Form.Item
                label="Confirm New Password"
                name="password_confirmation"
                rules={[
                  {
                    required: true,
                    message: "Please confirm your new password",
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error("Passwords do not match")
                      );
                    },
                  }),
                ]}
              >
                <Input.Password placeholder="Re-enter new password" />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="bg-green-800 text-white hover:bg-green-600"
                >
                  Change Password
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
