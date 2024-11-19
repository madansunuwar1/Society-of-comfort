import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, deleteUser, editUser } from "../../redux/userSlice";
import { Link, useNavigate } from "react-router-dom";
import {
  Skeleton,
  Button,
  Modal,
  Pagination,
  Input,
  Form,
  message,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
} from "@ant-design/icons";

const UserList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { users, loading } = useSelector((state) => state.user);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isUserOpen, setIsUserOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [editForm, setEditForm] = useState({
    house_id: "",
    name: "",
    email: "",
    phone_number: "",
    emergencyContact: "",
    lease_start_date: "",
    notes: "",
    media: null,
  });

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleShowUser = (user) => {
    setSelectedUser(user);
    setIsUserOpen(true);
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setEditForm({
      house_id: user.house_id,
      name: user.name,
      email: user.email,
      lease_start_date: user.lease_start_date,
      phone_number: user.phone_number,
      emergencyContact: user.emergency_contact,
      notes: user.notes,
      media: null,
    });
    setPreviewImage(user.documents.length > 0 ? user.documents[0] : null); // Show preview of the first image
    setIsEditModalOpen(true);
  };

  const handleEditFormChange = (key, value) => {
    setEditForm((prevForm) => ({
      ...prevForm,
      [key]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditForm((prevForm) => ({ ...prevForm, media: file }));
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result); // Preview the selected image
      };
      reader.readAsDataURL(file);
    }
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
          dispatch(fetchUsers());
        } catch (error) {
          message.error("Failed to delete user");
        }
      },
    });
  };

  const handleUpdateUser = async () => {
    try {
      const formData = new FormData();
      formData.append("house_id", String(editForm.house_id));
      formData.append("name", editForm.name);
      formData.append("email", editForm.email);
      formData.append("phone_number", editForm.phone_number);
      formData.append("emergency_contact", editForm.emergencyContact);
      if (editForm.media) {
        formData.append("media", editForm.media); // Append new media file if provided
      }
      formData.append("notes", editForm.notes);
      formData.append("lease_start_date", editForm.lease_start_date);
      formData.append("_method", "PUT");

      await dispatch(
        editUser({ userId: selectedUser.id, userData: formData })
      ).unwrap();

      message.success("User updated successfully");
      dispatch(fetchUsers());
      setIsEditModalOpen(false);
      dispatch(fetchUsers());
    } catch (err) {
      message.error("Failed to update user");
      dispatch(fetchUsers());
    }
  };

  const paginatedUsers = users?.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="w-full bg-slate-200 p-6 pb-20 rounded-lg shadow-md">
      <div className="bg-white rounded-lg p-4">
        <div className="mb-4 flex justify-between">
          <h1 className="text-xl font-semibold mb-4">User List</h1>
          <Link to="/dashboard/adduser">
            <Button
              type="default"
              className="bg-green-800 text-white hover:bg-green-600"
              icon={<PlusOutlined />}
            >
              Add User
            </Button>
          </Link>
        </div>

        <div className="bg-gray-200 p-5 rounded-lg">
          {loading ? (
            <div className="p-12">
              <Skeleton active />
              <Skeleton active />
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
                      Phone Number
                    </th>
                    <th className="py-2 px-4 border-r border-b border-gray-300">
                      Image
                    </th>
                    <th className="py-2 px-4 border-b border-gray-300">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedUsers?.map((user) => (
                    <tr key={user.id} className=" hover:bg-gray-50 border-b">
                      <td className="py-2 px-4 border-r border-gray-300">
                        {user.name}
                      </td>
                      <td className="py-2 px-4 border-r border-gray-300">
                        {user.phone_number}
                      </td>
                      <td className="py-2 px-4 border-r border-gray-300">
                        <img
                          src={
                            user?.documents.length > 0
                              ? user?.documents[0]
                              : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                          }
                          alt="user"
                          className="cursor-pointer h-10 w-10 object-cover"
                        />
                      </td>
                      <td className="py-2 px-4 flex gap-2">
                        <Button
                          icon={<EditOutlined />}
                          onClick={() => handleEdit(user)}
                          className="bg-blue-600 text-white"
                        />
                        <Button
                          icon={<DeleteOutlined />}
                          onClick={() => handleDelete(user?.id)}
                          danger
                        />
                        <Button
                          icon={<EyeOutlined />}
                          onClick={() => handleShowUser(user)}
                          className="bg-[#403F93] text-white"
                        />
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

        {/* View User Modal */}
        {isUserOpen && selectedUser && (
          <Modal
            visible={isUserOpen}
            onCancel={() => setIsUserOpen(false)}
            footer={null}
            width={800}
          >
            <div className="p-8">
              <h2 className="text-xl font-bold text-center mb-2">
                {selectedUser.name}
              </h2>
              <p className="text-center">{selectedUser.phone_number}</p>
              <div className="mt-8 text-sm font-mono border-gray-400 pb-2 mb-4">
                <img
                  src={
                    selectedUser.documents.length > 0
                      ? selectedUser.documents[0]
                      : "/path/to/default-image.jpg"
                  }
                  alt="user"
                  className="cursor-pointer object-cover h-80 w-80 mx-auto"
                />
                <p className="mt-4">
                  <strong>Email:</strong> {selectedUser.email}
                </p>
                <p className="mt-4">
                  <strong>Emergency Contact:</strong>{" "}
                  {selectedUser.emergency_contact}
                </p>
              </div>
            </div>
          </Modal>
        )}

        {/* Edit User Modal */}
        {isEditModalOpen && (
          <Modal
            visible={isEditModalOpen}
            onCancel={() => setIsEditModalOpen(false)}
            onOk={handleUpdateUser}
            title="Edit User"
          >
            <Form layout="vertical">
              <Form.Item label="Name">
                <Input
                  placeholder="Name"
                  value={editForm.name}
                  onChange={(e) => handleEditFormChange("name", e.target.value)}
                />
              </Form.Item>
              <Form.Item label="Email">
                <Input
                  placeholder="Email"
                  value={editForm.email}
                  onChange={(e) =>
                    handleEditFormChange("email", e.target.value)
                  }
                />
              </Form.Item>
              <Form.Item label="Phone Number">
                <Input
                  placeholder="Phone Number"
                  value={editForm.phone_number}
                  onChange={(e) =>
                    handleEditFormChange("phone_number", e.target.value)
                  }
                />
              </Form.Item>
              <Form.Item label="User Image">
                {previewImage && (
                  <img
                    src={previewImage}
                    alt="preview"
                    className="mb-4 w-full h-40 object-cover rounded"
                  />
                )}
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </Form.Item>
            </Form>
          </Modal>
        )}
      </div>
    </div>
  );
};

export default UserList;
