import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { noticeActions } from "../../redux/noticeSlice";
import { fetchResidences } from "../../redux/userSlice";
import {
  Skeleton,
  Button,
  Modal,
  Pagination,
  message,
  Form,
  Input,
  Select,
} from "antd";
import { Link, useNavigate } from "react-router-dom";
import { PlusOutlined } from "@ant-design/icons";
import { EditOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";

const NoticeList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { allNotices, loading } = useSelector((state) => state.notices); // Get allNotices and residences from Redux store
  const { residences } = useSelector((state) => state.user);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10); // Adjust page size as needed
  const [viewNotice, setViewNotice] = useState(null); // Store selected notice for viewing
  const [isEditModalVisible, setIsEditModalVisible] = useState(false); // Show/hide edit modal
  const [selectedNotice, setSelectedNotice] = useState(null); // Store selected notice for editing
  const [noticeType, setNoticeType] = useState(null); // Store notice type (private or public)
  const [form] = Form.useForm();

  useEffect(() => {
    dispatch(noticeActions.getAllNotices());
    if (noticeType === "private") {
      dispatch(fetchResidences()); // Fetch residences for private notices
    }
  }, [dispatch, noticeType]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Handle form submission for editing notice
  const handleSubmitEdit = async (values) => {
    try {
      const id = selectedNotice?.id;
      if (!id) {
        throw new Error("Notice ID is missing.");
      }

      const updateData = { ...values };
      if (selectedNotice.notice_type === "private") {
        updateData.users = values.users || [];
        console.log("Updating private notice with data:", updateData);

        // Dispatch with error handling
        await dispatch(
          noticeActions.updatePrivateNotice({ id, noticeData: updateData })
        ).unwrap();
      } else {
        console.log("Updating public notice with data:", updateData);

        // Dispatch with error handling
        await dispatch(
          noticeActions.updatePublicNotice({ id, noticeData: updateData })
        ).unwrap();
      }

      message.success("Notice updated successfully");
      setIsEditModalVisible(false);
      form.resetFields();
      await dispatch(noticeActions.getAllNotices()).unwrap(); // Refetch notices after the update

      // Navigate after refetching data
      navigate("/dashboard/noticelist");
    } catch (error) {
      console.error("Error updating notice:", error);
      message.error(error.message || "Failed to update notice");
    }
  };

  // Show the details of a notice in a modal
  const handleView = (notice) => {
    setViewNotice(notice); // Set the selected notice for viewing
  };

  // Open edit modal and populate form with selected notice data
  const handleEdit = (notice) => {
    if (!notice) return;
    setSelectedNotice(notice);
    setNoticeType(notice.notice_type); // Set notice type (private or public)
    form.setFieldsValue({
      title: notice.title,
      notice_body: notice.notice_body,
      users: notice.users || [], // Set the users for private notice
    });
    setIsEditModalVisible(true); // Show the edit modal
  };

  // Delete notice handler
  const handleDelete = (id) => {
    Modal.confirm({
      title: "Are you sure you want to delete this notice?",
      content: "This action cannot be undone.",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: async () => {
        try {
          await dispatch(noticeActions.deleteNotice(id)).unwrap();
          message.success("Notice deleted successfully");
        } catch (error) {
          console.error(error); // Log error to check details
          message.error("Failed to delete notice");
        }
      },
    });
  };

  // Paginate notices data
  const paginatedNotices = allNotices?.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="w-full bg-slate-200 p-6 pb-20 rounded-lg shadow-md">
      <div className="bg-white rounded-lg p-4">
        <div className="mb-4 flex justify-between">
          <h1 className="text-xl font-semibold mb-4">List Of Notices</h1>
          <Link to="/dashboard/notices">
            <Button
              type="default"
              className="bg-green-800 text-white hover:bg-green-500"
              icon={<PlusOutlined />}
            >
              Add New Notice
            </Button>
          </Link>
        </div>
        <div className=" bg-gray-200 p-5 rounded-lg">
          {loading ? (
            <div className="p-12">
              <Skeleton active />
            </div>
          ) : (
            <div className="bg-white p-4 rounded-lg overflow-x-auto">
              <table className="min-w-full ">
                <thead>
                  <tr className="text-left">
                    <th className="py-2 px-4 border-r border-b border-gray-300">
                      S.N
                    </th>
                    <th className="py-2 px-4 border-r border-b border-gray-300">
                      Title
                    </th>
                    <th className="py-2 px-4 border-r border-b border-gray-300">
                      Date
                    </th>
                    <th className="py-2 px-4 border-r border-b border-gray-300">
                      Type
                    </th>
                    <th className="py-2 px-4 border-b border-gray-300">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedNotices?.map((notice, index) => (
                    <tr key={notice.id} className="hover:bg-gray-50 border-b">
                      <td className="py-2 px-4 border-r border-gray-300">
                        {index + 1}
                      </td>
                      <td className="py-2 px-4 border-r border-gray-300">
                        {notice.title}
                      </td>
                      <td className="py-2 px-4 border-r border-gray-300">
                        {new Date(notice.created_at).toLocaleDateString(
                          "en-GB"
                        )}{" "}
                        {/* Change to your desired format */}
                      </td>
                      <td className="py-2 px-4 border-r border-gray-300">
                        <span className="px-2 py-1 rounded">
                          {notice.notice_type}
                        </span>
                      </td>
                      <td className="py-2 px-4 flex gap-2">
                        <Button
                          type="default"
                          className="bg-blue-800 text-white hover:bg-blue-600"
                          onClick={() => handleEdit(notice)}
                          icon={<EditOutlined />}
                        />

                        <Button
                          danger
                          onClick={() => handleDelete(notice.id)}
                          className="bg-red-600 hover:bg-red-800"
                          icon={<DeleteOutlined />}
                        />

                        <Button
                          type="default"
                          onClick={() => handleView(notice)}
                          className="bg-gray-200 text-gray-800 hover:bg-gray-300"
                          icon={<EyeOutlined />}
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
            total={allNotices?.length || 0}
            onChange={handlePageChange}
            className="mt-4 text-center"
          />
        </div>

        {/* Modal for Viewing Notice */}
        {viewNotice && (
          <Modal
            title={viewNotice.title}
            open={true}
            onCancel={() => setViewNotice(null)}
            footer={null}
          >
            <h3>Description:</h3>
            <p>{viewNotice.notice_body}</p>
          </Modal>
        )}

        {/* Edit Modal */}
        {isEditModalVisible && (
          <Modal
            title="Edit Notice"
            visible={isEditModalVisible}
            onCancel={() => setIsEditModalVisible(false)}
            footer={null}
          >
            <Form
              form={form}
              onFinish={handleSubmitEdit}
              layout="vertical"
              initialValues={{
                title: selectedNotice?.title,
                notice_body: selectedNotice?.notice_body,
                users: selectedNotice?.users || [],
              }}
            >
              <Form.Item
                name="title"
                label="Title"
                rules={[{ required: true, message: "Please enter the title" }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="notice_body"
                label="Notice Body"
                rules={[
                  { required: true, message: "Please enter the notice body" },
                ]}
              >
                <Input.TextArea />
              </Form.Item>
              {noticeType === "private" && (
                <Form.Item
                  name="users"
                  label="Select Residences"
                  rules={[
                    { required: true, message: "Please select residences" },
                  ]}
                >
                  <Select
                    mode="multiple"
                    options={
                      !loading &&
                      residences?.data?.map((residence) => ({
                        value: residence.id,
                        label: residence.name,
                        disabled: selectedNotice?.users?.includes(
                          residence.id.toString()
                        ), // Disable already selected users
                      }))
                    }
                    value={selectedNotice?.users || []} // Set initial value as selected users
                  />
                </Form.Item>
              )}
              <Button
                type="primary"
                htmlType="submit"
                className="w-full bg-green-800 hover:bg-green-400 !hover:bg-green-400"
              >
                Save Changes
              </Button>
            </Form>
          </Modal>
        )}
      </div>
    </div>
  );
};

export default NoticeList;
