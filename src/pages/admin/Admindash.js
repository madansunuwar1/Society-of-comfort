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
    localStorage.removeItem("user");
    navigate("/");
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
          <img
            src="https://www.apartmentsofwildewood.com/wp-content/uploads/apartments-of-wildewood-using-the-pool-at-your-apartment.jpg"
            alt="logo"
            className="rounded-full w-28 h-28 mx-auto"
          />
        </div>
        <p className="text-white font-bold text-lg text-center pb-4">
          Society Of Comfort
        </p>
        <div className="flex">
          <Button
            type="primary"
            onClick={toggleCollapsed}
            style={{ margin: "16px", display: collapsed ? "none" : "block" }}
          >
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </Button>
          <Button
            type="primary"
            onClick={handleLogout}
            style={{ margin: "16px" }}
          >
            <div className="flex gap-2">
              <LogoutOutlined />
              <span style={{ display: collapsed ? "none" : "block" }}>
                Logout
              </span>
            </div>
          </Button>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[selectedKey]} // Use extracted key for selected menu item
          style={{ height: "100%", borderRight: 0, backgroundColor: "#3F3F95" }}
        >
          <Menu.Item
            key="notices"
            icon={<NotificationOutlined style={{ color: "#F55A70" }} />}
          >
            <Link to="notices">Send Notice</Link>
          </Menu.Item>
          <Menu.Item
            key="paymentlist"
            icon={<CreditCardOutlined style={{ color: "#c31fde" }} />}
          >
            <Link to="paymentlist">Payment</Link>
          </Menu.Item>
          <Menu.Item
            key="addevent"
            icon={<CalendarOutlined style={{ color: "#0298a9" }} />}
          >
            <Link to="addevent">Event</Link>
          </Menu.Item>
          <Menu.Item
            key="residences"
            icon={<HomeOutlined style={{ color: "#FFAE00" }} />}
          >
            <Link to="residences">Residences</Link>
          </Menu.Item>
          <Menu.Item
            key="attendance"
            icon={<UserOutlined style={{ color: "#f2545a" }} />}
          >
            <Link to="attendance">Attendance</Link>
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
