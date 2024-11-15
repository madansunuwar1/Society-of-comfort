import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { houseSettingsActions } from "../../redux/houseSettingsSlice";
import { Button, Modal, Input, Skeleton, message, notification } from "antd";
import { Link } from "react-router-dom";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";

const HouseSetting = () => {
  const dispatch = useDispatch();
  const { houseSettings, loading, error } = useSelector(
    (state) => state.houseSettings
  );

  // Local state to handle modal visibility and data for editing
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editHouse, setEditHouse] = useState(null);
  const [houseNumber, setHouseNumber] = useState("");

  useEffect(() => {
    dispatch(houseSettingsActions.getHouseSettings());
  }, [dispatch]);

  // Handle opening the edit modal
  const handleEdit = (house) => {
    setEditHouse(house);
    setHouseNumber(house.house_number);
    setIsModalVisible(true);
  };

  // Handle closing the edit modal
  const handleCancel = () => {
    setIsModalVisible(false);
    setEditHouse(null);
    setHouseNumber("");
  };

  // Handle updating the house setting
  const handleUpdate = () => {
    if (houseNumber.trim() === "") {
      message.error("House number cannot be empty");
      return;
    }
    dispatch(
      houseSettingsActions.updateHouseSetting({
        settingId: editHouse.id,
        houseSettingData: {
          house_number: houseNumber,
        },
      })
    )
      .unwrap()
      .then(() => {
        notification.success({
          message: "Success",
          description: "House setting updated successfully",
        });
        setIsModalVisible(false);
        dispatch(houseSettingsActions.getHouseSettings()); // Refresh the list after update
      })
      .catch((err) => {
        notification.error({
          message: "Error",
          description: err.message || "Failed to update house setting",
        });
      });
  };

  // Handle deleting a house setting
  const handleDelete = (houseId) => {
    Modal.confirm({
      title: "Are you sure you want to delete this house setting?",
      onOk: async () => {
        try {
          dispatch(houseSettingsActions.deleteHouseSetting(houseId)).unwrap();
          message.success("House setting deleted successfully");
          dispatch(houseSettingsActions.getHouseSettings());
        } catch (error) {
          message.error("Failed to delete house setting");
        }
      },
    });
  };

  return (
    <div className="w-full bg-slate-200 p-6 pb-20 rounded-lg shadow-md">
      <div className="bg-white rounded-lg p-4">
        <div className="flex justify-between mb-4">
          <h1 className="text-xl font-semibold">House Settings</h1>
          <Link to="/dashboard/addhousesetting">
            <Button
              type="default"
              className="bg-green-800 text-white hover:bg-green-600"
              icon={<PlusOutlined />}
            >
              Add New House Setting
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
                      House Number
                    </th>
                    <th className="py-2 px-4 border-b border-gray-300">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {houseSettings?.map((house) => (
                    <tr key={house.id} className="border-b hover:bg-gray-100">
                      <td className="py-2 px-4 border-r">
                        {house.house_number}
                      </td>
                      <td className="py-2 px-4 flex gap-2">
                        <Button
                          type="default"
                          icon={<EditOutlined />}
                          onClick={() => handleEdit(house)}
                          className="bg-blue-600 text-white"
                        ></Button>
                        <Button
                          type="default"
                          icon={<DeleteOutlined />}
                          onClick={() => handleDelete(house.id)}
                          danger
                        ></Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Edit House Setting Modal */}
        <Modal
          title="Edit House Setting"
          visible={isModalVisible}
          onOk={handleUpdate}
          onCancel={handleCancel}
        >
          <div>
            <div className="mb-4">
              <label className="block text-sm font-semibold">
                House Number
              </label>
              <Input
                value={houseNumber}
                onChange={(e) => setHouseNumber(e.target.value)}
              />
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default HouseSetting;
