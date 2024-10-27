import React, { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { Layout, Menu, Button } from "antd";
import {
  NotificationOutlined,
  CalendarOutlined,
  CreditCardOutlined,
  HomeOutlined,
  UserOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";




const { Sider, Content } = Layout;

const Admindash = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <Layout style={{ minHeight: "100vh", backgroundColor: "#3F3F95"  }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        width={250}
        theme="light"
        breakpoint="md" // Collapse sidebar automatically on medium screens or smaller
        collapsedWidth={80} // Completely hide sidebar when collapsed
        style={{
          backgroundColor: "#3F3F95", // Set the desired background color here
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
            style={{ margin: "16px"}}>
          Logout
        </Button>
        </div>
        <Menu
         mode="inline" defaultSelectedKeys={["1"]} style={{ height: "100%", borderRight: 0, backgroundColor: "#3F3F95", }}>
          <Menu.Item key="1" icon={<NotificationOutlined style={{ color: "#F55A70" }} />}>
            <Link to="public">Send Public Notice</Link>
          </Menu.Item>
          <Menu.Item key="2" icon={<NotificationOutlined style={{ color: "#87d6ca" }} />}>
            <Link to="private">Send Private Notice</Link>
          </Menu.Item>
          <Menu.Item key="3" icon={<CreditCardOutlined style={{ color: "#c31fde" }} />}>
            <Link to="paymentlist">Payment</Link>
          </Menu.Item>
          <Menu.Item key="4" icon={<CalendarOutlined style={{ color: "#0298a9" }} />}>
            <Link to="addevent">Event</Link>
          </Menu.Item>
          <Menu.Item key="5" icon={<HomeOutlined style={{ color: "#FFAE00" }} />}>
            <Link to="residences">Residences</Link>
          </Menu.Item>
          <Menu.Item key="6" icon={<UserOutlined style={{ color: "#f2545a" }} />}>
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