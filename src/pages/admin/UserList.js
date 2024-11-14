import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, deleteUser, editUser } from "../../redux/userSlice";
import {
  Skeleton,
  Button,
  Modal,
  Pagination,
  message,
  Form,
  Input,
} from "antd";
import { Link, useNavigate } from "react-router-dom";
import { PlusOutlined } from "@ant-design/icons";
import { EditOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";

const UserList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { users, loading } = useSelector((state) => state.user);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [viewUser, setViewUser] = useState(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [form] = Form.useForm();

  const handleSendPrivateNotice = (user) => {
    navigate("/dashboard/notices", {
      state: { noticeType: "private", selectedUser: [String(user.id)] }, // Pass the selected user as state
    });
  };

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSubmitEdit = async (values) => {
    try {
      await dispatch(
        editUser({ userId: selectedUser.id, userData: values })
      ).unwrap();
      message.success("User updated successfully");
      setIsEditModalVisible(false);
    } catch (error) {
      message.error("Failed to update user");
    }
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    form.setFieldsValue({
      name: user.name,
      email: user.email,
    });
    setIsEditModalVisible(true);
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: "Are you sure you want to delete this user?",
      content: "This action cannot be undone.",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: async () => {
        try {
          await dispatch(deleteUser(id)).unwrap();
          message.success("User deleted successfully");
        } catch (error) {
          message.error("Failed to delete user");
        }
      },
    });
  };

  const paginatedUsers = users?.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="w-full bg-slate-200 p-6 pb-20 rounded-lg shadow-md">
      <div className="bg-white rounded-lg p-4">
        <div className="mb-4 flex justify-between">
          <h1 className="text-xl font-semibold mb-4">List Of Residence</h1>
          <Link to="/dashboard/adduser">
            <Button
              type="default"
              className="bg-green-800 text-white hover:bg-green-600"
              icon={<PlusOutlined />}
            >
              Add New Residence
            </Button>
          </Link>
        </div>
        <div className="bg-gray-200 p-5 rounded-lg">
          {loading ? (
            <div className="p-12">
              <Skeleton active />
            </div>
          ) : (
            <div className="bg-white p-4 rounded-lg overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="text-left">
                    <th className="py-2 px-4 border-r border-b border-gray-300">
                      Name
                    </th>
                    <th className="py-2 px-4 border-r border-b border-gray-300">
                      Number
                    </th>
                    <th className="py-2 px-4 border-b border-gray-300">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedUsers?.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 border-b">
                      <td className="py-2 px-4 border-r border-gray-300">
                        {user.apartment_number}-{user.block} / {user.name}
                      </td>
                      <td className="py-2 px-4 border-r border-gray-300">
                        {user.phone_number}
                      </td>
                      <td className="py-2 px-4 flex gap-2">
                        <Button
                          type="default"
                          className="bg-blue-800 text-white hover:bg-blue-600"
                          onClick={() => handleEdit(user)}
                          icon={<EditOutlined />}
                        ></Button>
                        <Button
                          danger
                          onClick={() => handleDelete(user.id)}
                          className="hover:bg-red-800"
                          icon={<DeleteOutlined />}
                        ></Button>
                        <Button
                          onClick={() => setViewUser(user)}
                          type="default"
                          className="hover:bg-gray-300"
                          icon={<EyeOutlined />}
                        ></Button>
                        <Button
                          type="default"
                          className="bg-yellow-500 text-white hover:bg-yellow-400"
                          onClick={() => handleSendPrivateNotice(user)} // Add the new button
                        >
                          Send Private Notice
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={users?.length || 0}
            onChange={handlePageChange}
            className="mt-4 text-center"
          />
        </div>

        {viewUser && (
          <Modal
            title={viewUser.name}
            open={true}
            onCancel={() => setViewUser(null)}
            footer={null}
          >
            <h3>Email:</h3>
            <p>{viewUser.email}</p>
          </Modal>
        )}

        {isEditModalVisible && (
          <Modal
            title="Edit User"
            visible={isEditModalVisible}
            onCancel={() => setIsEditModalVisible(false)}
            footer={null}
          >
            <Form form={form} onFinish={handleSubmitEdit}>
              <Form.Item
                name="name"
                label="Name"
                rules={[{ required: true, message: "Please enter the name" }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: "Please enter the email" },
                  { type: "email", message: "Please enter a valid email" },
                ]}
              >
                <Input />
              </Form.Item>
              <Button type="primary" htmlType="submit" className="w-full">
                Save Changes
              </Button>
            </Form>
          </Modal>
        )}
      </div>
    </div>
  );
};

export default UserList;
