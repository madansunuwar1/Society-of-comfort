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
  Form,
  message,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { NepaliDatePicker } from "nepali-datepicker-reactjs";
import "nepali-datepicker-reactjs/dist/index.css";

const EventList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { events, loading } = useSelector((state) => state.events);
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
      date: event.event.date, // Directly use the event date here
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
      dispatch(eventActions.getEvents());
    } catch (err) {
      message.error("Failed to update event");
    }
  };

  const paginatedEvents = events?.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="w-full bg-slate-200 p-6 pb-20 rounded-lg shadow-md">
      <div className="bg-white rounded-lg p-4">
        <div className="mb-4 flex justify-between">
          <h1 className="text-xl font-semibold mb-4">Event List</h1>
          <Link to="/dashboard/addevent">
            <Button
              type="default"
              className="bg-green-800 text-white hover:bg-green-600"
              icon={<PlusOutlined />}
            >
              Add Event
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
                      Date
                    </th>
                    <th className="py-2 px-4 border-r border-b border-gray-300">
                      Title
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
                  {paginatedEvents?.map((event) => (
                    <tr key={event.id} className=" hover:bg-gray-50 border-b">
                      <td className="py-2 px-4 border-r border-gray-300">
                        {event?.event?.date || "No date available"}
                        {/* You can leave this as is if you're not converting to Nepali */}
                      </td>
                      <td className="py-2 px-4 border-r border-gray-300">
                        {event?.event?.name}
                      </td>
                      <td className="py-2 px-4 border-r border-gray-300">
                        <img
                          src={event?.file_url}
                          alt="event"
                          className="cursor-pointer h-10 w-10 object-cover"
                        />
                      </td>
                      <td className="py-2 px-4 flex gap-2">
                        {/* Edit Button */}
                        <Button
                          icon={<EditOutlined />}
                          onClick={() => handleEdit(event)}
                          className="bg-blue-600 text-white"
                        />
                        {/* Delete Button */}
                        <Button
                          icon={<DeleteOutlined />}
                          onClick={() => handleDelete(event?.event?.id)}
                          danger
                        />
                        {/* Show Event Button */}
                        <Button
                          icon={<EyeOutlined />}
                          onClick={() => handleShowEvent(event)}
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
            total={events?.length || 0}
            onChange={handlePageChange}
            className="mt-4 text-center"
          />
        </div>

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
                <img
                  src={selectedEvent.file_url}
                  alt="event"
                  className="cursor-pointer object-cover"
                />
                <p className="mt-4">
                  <strong>Description:</strong>{" "}
                  {selectedEvent.event.description ||
                    "No description available"}
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
                <NepaliDatePicker
                  options={{ calenderLocale: "en", valueLocale: "en" }}
                  value={editForm.date}
                  onChange={(date) => handleEditFormChange("date", date)}
                  className="w-full custom-date-picker"
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
                  onChange={(e) =>
                    handleEditFormChange("venue", e.target.value)
                  }
                />
              </Form.Item>
            </Form>
          </Modal>
        )}
      </div>
    </div>
  );
};

export default EventList;
