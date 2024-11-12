import React, { useState, useEffect } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { Layout, Menu, Button } from "antd";
import {
  NotificationOutlined,
  CalendarOutlined,
  CreditCardOutlined,
  HomeOutlined,
  UserOutlined,
  CheckSquareOutlined,
  LogoutOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { PiNotebookFill } from "react-icons/pi";
import { FaFileInvoice } from "react-icons/fa";
import { MdDashboardCustomize } from "react-icons/md";

const { Sider, Content } = Layout;

const Admindash = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      localStorage.removeItem("user");
      navigate("/");
    }
  };

  // Extract the last part of the path as the selected key
  const selectedKey = location.pathname.split("/").pop();

  const menuItems = [
    {
      key: "/dashboard",
      icon: <MdDashboardCustomize style={{ color: "" }} />,
      label: "Dashboard",
      link: "/dashboard",
    },
    {
      key: "noticelist",
      icon: <PiNotebookFill style={{ color: "" }} />,
      label: "Notices",
      link: "noticelist",
    },
    {
      key: "paymentlist",
      icon: <FaFileInvoice style={{ color: "" }} />,
      label: "Create Bill",
      link: "paymentlist",
    },
    {
      key: "confirmpayment",
      icon: <CreditCardOutlined style={{ color: "" }} />,
      label: "Manage Payment",
      link: "confirmpayment",
    },
    {
      key: "booking",
      icon: <CheckSquareOutlined style={{ color: "" }} />,
      label: "Manage Booking",
      link: "booking",
    },
    {
      key: "eventlist",
      icon: <CalendarOutlined style={{ color: "" }} />,
      label: "Events",
      link: "eventlist",
    },
    {
      key: "userlist",
      icon: <HomeOutlined style={{ color: "" }} />,
      label: "Residence",
      link: "userlist",
    },
    {
      key: "attendance",
      icon: <UserOutlined style={{ color: "" }} />,
      label: "Attendance",
      link: "attendance",
    },
    {
      key: "settings",
      icon: <SettingOutlined style={{ color: "" }} />,
      label: "Settings",
      link: "settings", // Direct link to Settings page
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh", backgroundColor: "#3F3F95" }}>
      {!isMobile ? (
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
                src="../assets/images/image.jpeg"
                alt="logo"
                className="rounded-full w-32 h-32 mx-auto"
              />
            )}
          </div>
          <p className="text-white font-bold text-lg text-center pb-4">
            TCH II Thaiba
          </p>
          <Menu
            mode="inline"
            selectedKeys={[selectedKey]}
            style={{
              height: "100%",
              borderRight: 0,
              backgroundColor: "#3F3F95",
            }}
          >
            {menuItems.map(({ key, icon, label, link }) => (
              <Menu.Item
                key={key}
                icon={icon}
                style={{
                  color: selectedKey === key ? "blue" : "white",
                }}
              >
                <Link to={link}>
                  <span>{label}</span>
                </Link>
              </Menu.Item>
            ))}
            <Menu.Item
              key="logout"
              icon={<LogoutOutlined style={{ color: "" }} />}
              onClick={handleLogout}
              style={{ color: "white" }}
            >
              <span>Logout</span>
            </Menu.Item>
          </Menu>
        </Sider>
      ) : (
        <div className="flex gap-4 px-2 py-4 fixed bg-[#3F3F95] bottom-0">
          {menuItems.map(({ key, icon, label, link }) => (
            <Link key={key} to={link} className="flex flex-col">
              <div className="mx-auto">{icon}</div>
              <div
                style={{
                  color: selectedKey === key ? "blue" : "white",
                }}
                className="text-center text-[12px] text-white"
              >
                {label}
              </div>
            </Link>
          ))}
        </div>
      )}
      <div
        onClick={handleLogout}
        className="fixed bg-[#3F3F95] rounded-md p-4 right-2 top-2 flex gap-1 md:hidden"
      >
        <LogoutOutlined style={{ color: "#ffffff" }} />
      </div>

      <Layout style={{ padding: "0 0px 0px" }}>
        <Content style={{ margin: 0, background: "#fff" }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default Admindash;
