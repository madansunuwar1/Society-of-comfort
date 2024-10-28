import React, { useState } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { Layout, Menu, Button } from "antd";
import {
  NotificationOutlined,
  CalendarOutlined,
  CreditCardOutlined,
  HomeOutlined,
  UserOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LogoutOutlined,
} from "@ant-design/icons";

const { Sider, Content } = Layout;

const Admindash = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      localStorage.removeItem("user");
      navigate("/");
    }
  };

  // Extract the last part of the path as the selected key
  const selectedKey = location.pathname.split("/").pop();

  return (
    <Layout style={{ minHeight: "100vh", backgroundColor: "#3F3F95" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        width={250}
        theme="light"
        breakpoint="md"
        collapsedWidth={80}
        style={{
          backgroundColor: "#3F3F95",
        }}
      >
        <div className="px-10 py-4">
          {!collapsed && (
            <img
              src="https://www.apartmentsofwildewood.com/wp-content/uploads/apartments-of-wildewood-using-the-pool-at-your-apartment.jpg"
              alt="logo"
              className="rounded-full w-28 h-28 mx-auto"
            />
          )}
        </div>
        <p className="text-white font-bold text-lg text-center pb-4">
          Society Of Comfort
        </p>
        <Button
          type="primary"
          onClick={toggleCollapsed}
          style={{ margin: "16px", display: collapsed ? "none" : "block" }}
        >
          {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </Button>

        <Menu
          mode="inline"
          selectedKeys={[selectedKey]} // Use extracted key for selected menu item
          style={{ height: "100%", borderRight: 0, backgroundColor: "#3F3F95" }}
        >
          <Menu.Item
            key="notices"
            icon={<NotificationOutlined style={{ color: "#F55A70" }} />}
            style={{
              color: selectedKey === "notices" ? "blue" : "white",
            }}
          >
            <Link to="notices">
              <span>Send Notice</span>
            </Link>
          </Menu.Item>
          <Menu.Item
            key="paymentlist"
            icon={<CreditCardOutlined style={{ color: "#c31fde" }} />}
            style={{
              color: selectedKey === "paymentlist" ? "blue" : "white",
            }}
          >
            <Link to="paymentlist">
              <span>Create Bill</span>
            </Link>
          </Menu.Item>
          <Menu.Item
            key="addevent"
            icon={<CalendarOutlined style={{ color: "#0298a9" }} />}
            style={{
              color: selectedKey === "addevent" ? "blue" : "white",
            }}
          >
            <Link to="addevent">
              <span>Event</span>
            </Link>
          </Menu.Item>
          <Menu.Item
            key="residences"
            icon={<HomeOutlined style={{ color: "#FFAE00" }} />}
            style={{
              color: selectedKey === "residences" ? "blue" : "white",
            }}
          >
            <Link to="residences">
              <span>Residences</span>
            </Link>
          </Menu.Item>
          <Menu.Item
            key="attendance"
            icon={<UserOutlined style={{ color: "#f2545a" }} />}
            style={{
              color: selectedKey === "attendance" ? "blue" : "white",
            }}
          >
            <Link to="attendance">
              <span>Attendance</span>
            </Link>
          </Menu.Item>
          <Menu.Item
            key="logout"
            icon={<LogoutOutlined style={{ color: "#FF4D4F" }} />}
            onClick={handleLogout} // Call handleLogout on click
            style={{
              color: "white",
            }}
          >
            <span>Logout</span>
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout style={{ padding: "0 0px 0px" }}>
        <Content style={{ margin: 0, background: "#fff" }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default Admindash;
