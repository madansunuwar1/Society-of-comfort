import React from "react";
import { Link, Outlet,  Route, Routes } from "react-router-dom";
import { Layout, Menu } from "antd";
import {
  NotificationOutlined,
  CalendarOutlined,
  CreditCardOutlined,
  HomeOutlined,
  UserOutlined,
} from "@ant-design/icons";
import Publicnotice from "./Publicnotice";
import Privatenotice from "./Privatenotice";
import PaymentList from "./PaymentList";
import AddEvent from "./AddEvent";
import Residences from "./Residences";
import Attendance from "./Attendance";

const { Sider, Content } = Layout;


const Admindash = () => {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider width={250} theme="light">
        <Menu mode="inline" defaultSelectedKeys={["1"]} style={{ height: "100%", borderRight: 0 }}>
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
      <Layout style={{ padding: "0 24px 24px" }}>
        <Content style={{ padding: 24, margin: 0, background: "#fff" }}>
          <Outlet/>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Admindash;