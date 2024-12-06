import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchWorkers,
  deleteWorker,
  editWorker,
} from "../../redux/workerSlice";
import {
  Skeleton,
  Button,
  Modal,
  Pagination,
  message,
  Form,
  Input,
} from "antd";
import { Link } from "react-router-dom";
import { PlusOutlined } from "@ant-design/icons";
import { EditOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";

const WorkerList = () => {
  const dispatch = useDispatch();
  const { workers, loading } = useSelector((state) => state.workers);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [viewWorker, setViewWorker] = useState(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    dispatch(fetchWorkers());
  }, [dispatch]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSubmitEdit = async (values) => {
    try {
      await dispatch(
        editWorker({ workerId: selectedWorker.id, workerData: values })
      ).unwrap();
      message.success("Worker updated successfully");
      setIsEditModalVisible(false);
      dispatch(fetchWorkers());
    } catch (error) {
      message.error("Failed to update worker");
    }
  };

  const handleEdit = (worker) => {
    setSelectedWorker(worker);
    form.setFieldsValue({
      name: worker.name,
      email: worker.email,
      phone_number: worker.phone_number, // Added phone number here
      address: worker.address,
    });
    setIsEditModalVisible(true);
    dispatch(fetchWorkers());
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: "Are you sure you want to delete this worker?",
      content: "This action cannot be undone.",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: async () => {
        try {
          await dispatch(deleteWorker(id)).unwrap();
          message.success("Worker deleted successfully");
          dispatch(fetchWorkers());
        } catch (error) {
          message.error("Failed to delete worker");
        }
      },
    });
  };

  const paginatedWorkers = workers?.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="w-full bg-slate-200 p-6 pb-20 rounded-lg shadow-md">
      <div className="bg-white rounded-lg p-4">
        <div className="mb-4 flex justify-between">
          <h1 className="text-xl font-semibold mb-4">List Of Staffs</h1>
          <Link to="/dashboard/addworker">
            <Button
              type="default"
              className="bg-green-800 text-white hover:bg-green-600"
              icon={<PlusOutlined />}
            >
              Add New Staff
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
                    <th className="py-2 px-4 border-r border-b border-gray-300">
                      Email
                    </th>
                    <th className="py-2 px-4 border-r border-b border-gray-300">
                      Address
                    </th>
                    <th className="py-2 px-4 border-b border-gray-300">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedWorkers?.map((worker) => (
                    <tr key={worker.id} className="hover:bg-gray-50 border-b">
                      <td className="py-2 px-4 border-r border-gray-300">
                        {worker.name}
                      </td>
                      <td className="py-2 px-4 border-r border-gray-300">
                        {worker.phone_number}
                      </td>
                      <td className="py-2 px-4 border-r border-gray-300">
                        {worker.email}
                      </td>
                      <td className="py-2 px-4 border-r border-gray-300">
                        {worker.address}
                      </td>
                      <td className="py-2 px-4 flex gap-2">
                        <Button
                          type="default"
                          className="bg-blue-800 text-white hover:bg-blue-600"
                          onClick={() => handleEdit(worker)}
                          icon={<EditOutlined />}
                        ></Button>
                        <Button
                          danger
                          onClick={() => handleDelete(worker.id)}
                          className="hover:bg-red-800"
                          icon={<DeleteOutlined />}
                        ></Button>
                        <Button
                          onClick={() => setViewWorker(worker)}
                          type="default"
                          className="hover:bg-gray-300"
                          icon={<EyeOutlined />}
                        ></Button>
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
            total={workers?.length || 0}
            onChange={handlePageChange}
            className="mt-4 text-center"
          />
        </div>

        {viewWorker && (
          <Modal
            title={viewWorker.name}
            open={true}
            onCancel={() => setViewWorker(null)}
            footer={null}
          >
            <h3>Email:</h3>
            <p>{viewWorker.email}</p>
            <h3>Phone Number:</h3>
            <p>{viewWorker.phone_number}</p>
            <h3>Address:</h3>
            <p>{viewWorker.address}</p>
          </Modal>
        )}

        {isEditModalVisible && (
          <Modal
            title="Edit Worker"
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
              <Form.Item
                name="phone_number"
                label="Phone Number"
                rules={[
                  { required: true, message: "Please enter the phone number" },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="address"
                label="Address"
                rules={[
                  { required: true, message: "Please enter the address" },
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

export default WorkerList;
