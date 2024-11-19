import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Button, Modal, Form, Input, message } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { editUser } from "../../redux/userSlice"; // Update the import path
import { Link } from "react-router-dom";

const EditProfile = () => {
  const dispatch = useDispatch();
  const user = JSON.parse(localStorage.getItem("user"));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const showModal = () => {
    setIsModalOpen(true);
    form.setFieldsValue({
      name: user.user.name,
      email: user.user.email,
      phone_number: user.user.phone_number,
      address: user.user.address,
    });
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      dispatch(
        editUser({
          userId: user.user.id, // Assuming `id` is the unique identifier
          userData: values,
        })
      )
        .unwrap()
        .then(() => {
          message.success("Profile updated successfully!");
          setIsModalOpen(false);
        })
        .catch((error) => {
          message.error(error || "Failed to update profile");
        });
    } catch (errInfo) {
      console.error("Validate Failed:", errInfo);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="w-full bg-slate-200 p-6 pb-20 rounded-lg shadow-md">
      <div className="bg-white rounded-lg p-4">
        <div className="flex justify-between">
          <h1 className="text-xl font-semibold mb-4">My Profile</h1>
        </div>
        <div className="bg-gray-200 p-5 rounded-lg">
          <div className="bg-white rounded-lg flex gap-8 px-20 py-8">
            <img
              src={user.profile_picture_url}
              className="h-28 w-28 rounded-full"
              alt="profile"
            />
            <div className="my-auto">
              <p className="text-lg font-semibold">{user.user.name}</p>
              <p className="text-md">{user.role}</p>
              <p className="text-md">{user.user.address}</p>
            </div>
          </div>
          <div className="flex justify-between mt-8 mb-4">
            <h1 className="text-xl font-semibold">Personal Information</h1>
            {/* <Button
              type="default"
              className="bg-green-800 text-white hover:bg-green-600"
              icon={<EditOutlined />}
              // onClick={showModal}
            >
              Edit
            </Button> */}
          </div>
          <div className="bg-white p-4 rounded-lg px-20 py-8">
            <div className="flex justify-between">
              <div>
                <p className="text-gray-500">Name</p>
                <p className="font-semibold mt-2">{user.user.name}</p>
              </div>
              <div>
                <p className="text-gray-500">Email</p>
                <p className="font-semibold mt-2">{user.user.email}</p>
              </div>
              <div>
                <p className="text-gray-500">Phone Number</p>
                <p className="font-semibold mt-2">{user.user.phone_number}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {/* <Modal
        title="Edit Profile"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Save"
        cancelText="Cancel"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: "Please enter your name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="phone_number"
            label="Phone Number"
            rules={[
              { required: true, message: "Please enter your phone number" },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal> */}
    </div>
  );
};

export default EditProfile;
