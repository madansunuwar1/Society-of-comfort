import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { settingsActions } from "../../redux/settingsSlice";
import { Button, Modal, Input, Skeleton, message } from "antd";
import { Link } from "react-router-dom";

const SettingsPage = () => {
  const dispatch = useDispatch();
  const { settings, loading, error } = useSelector((state) => state.settings);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false); // New state for add modal
  const [selectedSetting, setSelectedSetting] = useState(null);
  const [newSetting, setNewSetting] = useState({ title: "", amount: "" }); // State for new setting

  useEffect(() => {
    dispatch(settingsActions.getSettings());
  }, [dispatch]);

  // Open edit modal for a setting
  const handleEditSetting = (setting) => {
    setSelectedSetting(setting);
    setNewSetting({ title: setting.title, amount: setting.amount });
    setIsEditing(true);
  };

  // Save updated setting amount
  const handleSaveEdit = async () => {
    try {
      await dispatch(
        settingsActions.updateSettings({
          id: selectedSetting.id,
          amount: newSetting.amount,
        })
      ).unwrap();
      message.success("Setting updated successfully");
      setIsEditing(false);
      setSelectedSetting(null);
    } catch (error) {
      message.error("Failed to update setting");
    }
  };

  // Save new setting
  const handleSaveNew = async () => {
    try {
      await dispatch(settingsActions.addSetting(newSetting)).unwrap();
      message.success("Setting added successfully");
      setIsAdding(false);
      setNewSetting({ title: "", amount: "" });
    } catch (error) {
      message.error("Failed to add setting");
    }
  };

  return (
    <div className="w-full bg-slate-200 p-6 pb-20">
      <div className="flex justify-between mb-4">
        <h1 className="text-xl font-semibold">Settings</h1>
        <Link to="/dashboard/addsettings">
          <Button
            type="default"
            className="bg-blue-800 text-white hover:bg-blue-600"
          >
            Add Settings
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
                <th className="py-2 px-4 text-left border-r">Setting Title</th>
                <th className="py-2 px-4 text-left border-r">Amount</th>
                <th className="py-2 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {settings.data?.map((setting) => (
                <tr key={setting.id} className="border-b hover:bg-gray-100">
                  <td className="py-2 px-4 border-r">{setting.title}</td>
                  <td className="py-2 px-4 border-r">{setting.amount}</td>
                  <td className="py-2 px-4">
                    <Button
                      onClick={() => handleEditSetting(setting)}
                      className="bg-blue-600 text-white"
                    >
                      Edit
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Edit Setting Modal */}
      {isEditing && selectedSetting && (
        <Modal
          title={`Edit ${selectedSetting.title}`}
          visible={isEditing}
          onCancel={() => setIsEditing(false)}
          onOk={handleSaveEdit}
        >
          <label>Amount:</label>
          <Input
            value={newSetting.amount}
            onChange={(e) =>
              setNewSetting({ ...newSetting, amount: e.target.value })
            }
            type="number"
          />
        </Modal>
      )}

      {/* Add New Setting Modal */}
      {isAdding && (
        <Modal
          title="Add New Setting"
          visible={isAdding}
          onCancel={() => setIsAdding(false)}
          onOk={handleSaveNew}
        >
          <label>Title:</label>
          <Input
            value={newSetting.title}
            onChange={(e) =>
              setNewSetting({ ...newSetting, title: e.target.value })
            }
            type="text"
          />
          <label className="mt-4">Amount:</label>
          <Input
            value={newSetting.amount}
            onChange={(e) =>
              setNewSetting({ ...newSetting, amount: e.target.value })
            }
            type="number"
          />
        </Modal>
      )}
    </div>
  );
};

export default SettingsPage;
