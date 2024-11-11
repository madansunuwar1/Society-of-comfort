import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { settingsActions } from "../../redux/settingsSlice";
import { Button, Modal, Input, Skeleton, message } from "antd";
import { Link } from "react-router-dom";

const SettingsPage = () => {
  const dispatch = useDispatch();
  const { settings, loading, error } = useSelector((state) => state.settings); // New state for add modal

  useEffect(() => {
    dispatch(settingsActions.getSettings());
  }, [dispatch]);

  return (
    <div className="w-full bg-slate-200 p-6 pb-20">
      <div className="flex justify-between mb-4">
        <h1 className="text-xl font-semibold">Settings</h1>
        <Link to="/dashboard/addsettings">
          <Button
            type="default"
            className="bg-blue-800 text-white hover:bg-blue-600"
          >
            Edit Settings
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
              </tr>
            </thead>
            <tbody>
              {settings?.map((setting) => (
                <tr key={setting.id} className="border-b hover:bg-gray-100">
                  <td className="py-2 px-4 border-r">{setting.setting_name}</td>
                  <td className="py-2 px-4 border-r">
                    {setting.setting_value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default SettingsPage;
