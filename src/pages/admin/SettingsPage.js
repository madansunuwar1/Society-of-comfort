import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { settingsActions } from "../../redux/settingsSlice";
import {
  Button,
  Modal,
  Input,
  Skeleton,
  message,
  notification,
  Checkbox,
} from "antd";
import { Link } from "react-router-dom";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";

const SettingsPage = () => {
  const dispatch = useDispatch();
  const { settings, loading, error } = useSelector((state) => state.settings);

  // Local state to handle modal visibility and data for editing
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editSetting, setEditSetting] = useState(null);
  const [newSettingName, setNewSettingName] = useState("");
  const [newSettingValue, setNewSettingValue] = useState("");
  const [newSettingStatus, setNewSettingStatus] = useState(0);

  useEffect(() => {
    dispatch(settingsActions.getSettings());
  }, [dispatch]);

  // Handle opening the edit modal
  const handleEdit = (setting) => {
    setEditSetting(setting);
    setNewSettingName(setting.setting_name);
    setNewSettingValue(setting.setting_value);
    setNewSettingStatus(setting.status || 0);
    setIsModalVisible(true);
  };

  // Handle closing the edit modal
  const handleCancel = () => {
    setIsModalVisible(false);
    setEditSetting(null);
    setNewSettingName("");
    setNewSettingValue("");
    setNewSettingStatus(0);
  };

  // Handle updating the setting
  const handleUpdate = () => {
    if (newSettingName.trim() === "" || newSettingValue.trim() === "") {
      message.error("Setting name and value cannot be empty");
      return;
    }
    dispatch(
      settingsActions.updateSettings({
        settingId: editSetting.id,
        settingsData: {
          setting_name: newSettingName,
          setting_value: newSettingValue,
          status: String(newSettingStatus),
        },
      })
    )
      .unwrap()
      .then(() => {
        notification.success({
          message: "Success",
          description: "Setting updated successfully",
        });
        setIsModalVisible(false);
        dispatch(settingsActions.getSettings()); // Refresh the list after update
      })
      .catch((err) => {
        notification.error({
          message: "Error",
          description: err.message || "Failed to update setting",
        });
      });
  };

  // Handle deleting a setting
  const handleDelete = (settingId) => {
    Modal.confirm({
      title: "Are you sure you want to delete this setting?",
      onOk: async () => {
        try {
          dispatch(settingsActions.deleteSettings(settingId)).unwrap();
          message.success("Setting deleted successfully");
          dispatch(settingsActions.getSettings());
        } catch (error) {
          message.error("Failed to delete setting");
        }
      },
    });
  };

  return (
    <div className="w-full bg-slate-200 p-6 pb-20 rounded-lg shadow-md">
      <div className="bg-white rounded-lg p-4">
        <div className="flex justify-between mb-4">
          <h1 className="text-xl font-semibold">Invoice Settings</h1>
          <Link to="/dashboard/addsettings">
            <Button
              type="default"
              className="bg-green-800 text-white hover:bg-green-600"
              icon={<PlusOutlined />}
            >
              Add New Invoice Settings
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
                      Setting Title
                    </th>
                    <th className="py-2 px-4 border-r border-b border-gray-300">
                      Amount
                    </th>
                    <th className="py-2 px-4 border-r border-b border-gray-300">
                      Status
                    </th>
                    <th className="py-2 px-4 border-b border-gray-300">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {settings?.map((setting) => (
                    <tr key={setting.id} className="border-b hover:bg-gray-100">
                      <td className="py-2 px-4 border-r">
                        {setting.setting_name}
                      </td>
                      <td className="py-2 px-4 border-r">
                        {setting.setting_value}
                      </td>
                      <td className="py-2 px-4 border-r">
                        {setting.status === 1 ? "Default" : ""}
                      </td>
                      <td className="py-2 px-4 flex gap-2">
                        <Button
                          type="default"
                          icon={<EditOutlined />}
                          onClick={() => handleEdit(setting)}
                          className="bg-blue-600 text-white"
                        ></Button>
                        <Button
                          type="default"
                          icon={<DeleteOutlined />}
                          onClick={() => handleDelete(setting.id)}
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

        {/* Edit Settings Modal */}
        <Modal
          title="Edit Setting"
          visible={isModalVisible}
          onOk={handleUpdate}
          onCancel={handleCancel}
        >
          <div>
            <div className="mb-4">
              <label className="block text-sm font-semibold">
                Setting Name
              </label>
              <Input
                value={newSettingName}
                onChange={(e) => setNewSettingName(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-semibold">
                Setting Value
              </label>
              <Input
                value={newSettingValue}
                onChange={(e) => setNewSettingValue(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <Checkbox
                checked={newSettingStatus === 1}
                onChange={(e) => setNewSettingStatus(e.target.checked ? 1 : 0)}
              >
                Active
              </Checkbox>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default SettingsPage;
