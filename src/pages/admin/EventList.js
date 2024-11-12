import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { eventActions } from "../../redux/eventSlice";
import { Link, useNavigate } from "react-router-dom";
import {
  Skeleton,
  Button,
  Modal,
  Pagination,
  Input,
  DatePicker,
  Upload,
  Form,
  message,
} from "antd";
import dayjs from "dayjs";
import { PlusOutlined } from "@ant-design/icons";

const EventList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { events, loading, error } = useSelector((state) => state.events);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [isEventOpen, setIsEventOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
    date: "",
    time: "",
    venue: "",
  });

  useEffect(() => {
    dispatch(eventActions.getEvents());
  }, [dispatch]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleShowEvent = (event) => {
    setSelectedEvent(event);
    setIsEventOpen(true);
  };

  const handleEdit = (event) => {
    setSelectedEvent(event);
    setEditForm({
      name: event.event.name,
      description: event.event.description || "",
      date: dayjs(event.event.date),
      time: event.event.time || "",
      venue: event.event.venue || "",
    });
    setIsEditModalOpen(true);
  };

  const handleEditFormChange = (key, value) => {
    setEditForm((prevForm) => ({
      ...prevForm,
      [key]: value,
    }));
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: "Are you sure you want to delete this event?",
      content: "This action cannot be undone.",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: async () => {
        try {
          await dispatch(eventActions.deleteEvent(id)).unwrap();
          message.success("Event deleted successfully");
          dispatch(eventActions.getEvents());
        } catch (error) {
          message.error("Failed to delete event");
        }
      },
    });
  };

  const handleUpdateEvent = async () => {
    try {
      await dispatch(
        eventActions.updateEvent({
          id: selectedEvent.event.id,
          eventData: { ...editForm, _method: "PUT" },
        })
      ).unwrap();
      message.success("Event updated successfully");
      setIsEditModalOpen(false);
      navigate("/dashboard/eventlist");
    } catch (error) {
      message.error("Failed to update event");
    }
  };

  const paginatedEvents = events?.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="w-full bg-slate-200 p-6 pb-20 rounded-lg shadow-md">
      <div className="mb-4 flex justify-between">
        <h1 className="text-xl font-semibold mb-4">Event List</h1>
        <Link to="/dashboard/addevent">
          <Button
            type="default"
            className="bg-blue-800 text-white hover:bg-blue-600"
            icon={<PlusOutlined />}
          >
            Add Event
          </Button>
        </Link>
      </div>

      <div className="overflow-x-auto">
        {loading ? (
          <div className="p-12">
            <Skeleton active />
            <Skeleton active />
            <Skeleton active />
          </div>
        ) : (
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 text-left border-r">Date</th>
                <th className="py-2 px-4 text-left border-r">Title</th>
                <th className="py-2 px-4 text-left border-r">Image</th>
                <th className="py-2 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedEvents?.map((event) => (
                <tr key={event.id} className="border-b hover:bg-gray-100">
                  <td className="py-2 px-4 border-r">{event.event.date}</td>
                  <td className="py-2 px-4 border-r">{event.event.name}</td>
                  <td className="py-2 px-4 border-r">
                    <img
                      src={event.file_url}
                      alt="event"
                      className="cursor-pointer h-10 w-10 object-cover"
                    />
                  </td>
                  <td className="py-2 px-4 flex gap-2">
                    <Button
                      onClick={() => handleEdit(event)}
                      className="bg-blue-600 text-white"
                    >
                      Edit
                    </Button>
                    <Button onClick={() => handleDelete(event.event.id)} danger>
                      Delete
                    </Button>
                    <Button
                      onClick={() => handleShowEvent(event)}
                      className="bg-[#403F93] text-white"
                    >
                      Show Event
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Pagination
        current={currentPage}
        pageSize={pageSize}
        total={events?.length || 0}
        onChange={handlePageChange}
        className="mt-4 text-center"
      />

      {/* Event Details Modal */}
      {isEventOpen && selectedEvent && (
        <Modal
          visible={isEventOpen}
          onCancel={() => setIsEventOpen(false)}
          footer={null}
          width={800}
        >
          <div className="p-8">
            <h2 className="text-xl font-bold text-center mb-2">
              {selectedEvent.event.name}
            </h2>
            <p className="text-center">
              Date: {new Date(selectedEvent.event.date).toLocaleDateString()}
            </p>
            <div className="mt-8 text-sm font-mono border-gray-400 pb-2 mb-4">
              <p>
                <strong>Description:</strong>{" "}
                {selectedEvent.event.description || "No description available"}
              </p>
            </div>
          </div>
        </Modal>
      )}

      {/* Edit Event Modal */}
      {isEditModalOpen && (
        <Modal
          visible={isEditModalOpen}
          onCancel={() => setIsEditModalOpen(false)}
          onOk={handleUpdateEvent}
          title="Edit Event"
        >
          <Form layout="vertical">
            <Form.Item label="Event Name">
              <Input
                placeholder="Event Name"
                value={editForm.name}
                onChange={(e) => handleEditFormChange("name", e.target.value)}
              />
            </Form.Item>
            <Form.Item label="Description">
              <Input.TextArea
                placeholder="Description"
                value={editForm.description}
                onChange={(e) =>
                  handleEditFormChange("description", e.target.value)
                }
              />
            </Form.Item>
            <Form.Item label="Date">
              <DatePicker
                value={editForm.date}
                onChange={(date) => handleEditFormChange("date", date)}
                className="w-full"
              />
            </Form.Item>
            <Form.Item label="Time">
              <Input
                placeholder="Time"
                value={editForm.time}
                onChange={(e) => handleEditFormChange("time", e.target.value)}
              />
            </Form.Item>
            <Form.Item label="Venue">
              <Input
                placeholder="Venue"
                value={editForm.venue}
                onChange={(e) => handleEditFormChange("venue", e.target.value)}
              />
            </Form.Item>
          </Form>
        </Modal>
      )}
    </div>
  );
};

export default EventList;
