import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { noticeActions } from "../../redux/noticeSlice"; // Adjust import path as needed
import { Skeleton, Button, Modal, Pagination, message } from "antd";
import { Link, useNavigate } from "react-router-dom";

const NoticeList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { allNotices, loading } = useSelector((state) => state.notices); // Get allNotices from Redux store
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10); // Adjust page size as needed
  const [viewNotice, setViewNotice] = useState(null); // Store selected notice for viewing

  useEffect(() => {
    dispatch(noticeActions.getAllNotices()); // Dispatch getAllNotices to load all notices
  }, [dispatch]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Edit notice handler
  const handleEdit = (notice) => {
    navigate(`/editnotice/${notice.id}`);
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
          message.error("Failed to delete notice");
        }
      },
    });
  };

  // Show the details of a notice in a modal
  const handleView = (notice) => {
    setViewNotice(notice); // Set the selected notice for viewing
  };

  // Paginate notices data
  const paginatedNotices = allNotices?.data?.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="w-full bg-slate-200 p-6 pb-20 rounded-lg shadow-md">
      <div className="mb-4 flex justify-between">
        <h1 className="text-xl font-semibold mb-4">Notice List</h1>
        <Link to="/dashboard/notices">
          <Button
            type="default"
            className="bg-blue-800 text-white hover:bg-blue-600"
          >
            Add Notice
          </Button>
        </Link>
      </div>
      <div className="overflow-x-auto">
        {loading ? (
          <div className="p-12">
            <Skeleton active />
          </div>
        ) : (
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border border-gray-300">Title</th>
                <th className="py-2 px-4 border border-gray-300">Date</th>
                <th className="py-2 px-4 border border-gray-300">Type</th>
                <th className="py-2 px-4 border border-gray-300">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedNotices?.map((notice, index) => (
                <tr key={notice.index} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border border-gray-300">
                    {notice.title}
                  </td>
                  <td className="py-2 px-4 border border-gray-300">
                    {notice.created_at}
                  </td>
                  <td className="py-2 px-4 border border-gray-300">
                    <span className="px-2 py-1 rounded">
                      {notice.notice_type}
                    </span>
                  </td>
                  <td className="py-2 px-4 border border-gray-200 flex gap-2">
                    <Button
                      type="default"
                      className="bg-blue-800 text-white hover:bg-blue-600"
                    >
                      Edit
                    </Button>
                    <Button
                      danger
                      onClick={() => handleDelete(notice.id)}
                      className="hover:bg-red-800"
                    >
                      Delete
                    </Button>
                    <Button
                      onClick={() => handleView(notice)}
                      type="default"
                      className=""
                    >
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination Component */}
      <Pagination
        current={currentPage}
        pageSize={pageSize}
        total={allNotices?.data?.length || 0}
        onChange={handlePageChange}
        className="mt-4 text-center"
      />

      {/* Modal for Viewing Notice */}
      {viewNotice && (
        <Modal
          title={viewNotice.title}
          visible={true}
          onCancel={() => setViewNotice(null)}
          footer={null}
        >
          <h3>Description:</h3>
          <p>{viewNotice.notice_body}</p>
        </Modal>
      )}
    </div>
  );
};

export default NoticeList;
