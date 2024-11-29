import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Start from "./pages/Start";
import Signin from "./pages/Signin";
import Userdash from "./pages/Userdash";
import Botnav from "./components/Botnav";
import Topnav from "./components/Topnav";
import Pass from "./pages/Pass";
import Passes from "./pages/Passes";
import Guard from "./pages/security/Guard";
import Notice from "./pages/Notice";
import Service from "./pages/Service";
import Account from "./pages/Account";
import Profile from "./pages/Profile";
import Admindash from "./pages/admin/Admindash";
import Residences from "./pages/admin/Residences";
import Complains from "./pages/admin/Complains";
import Review from "./pages/admin/Review";
import Proadmin from "./pages/professional/Proadmin";
import Todo from "./pages/professional/Todo";
import Completed from "./pages/professional/Completed";
import Request from "./pages/professional/Request";
import Password from "./pages/Password";
import Changeprofile from "./pages/Changeprofile";
import Tododetail from "./pages/professional/Tododetail";
import History from "./pages/History";
import Booking from "./pages/Booking";
import Profileedit from "./pages/Profileedit";
import InvoiceDetail from "./pages/InvoiceDetail";
import PaymentDetail from "./pages/PaymentDetail";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Payment from "./pages/Payment";
import PaymentList from "./pages/admin/PaymentList";
import DisplayEvent from "./pages/admin/DisplayEvent";
import AddEvent from "./pages/admin/AddEvent";
import UserPaymentList from "./pages/UserPaymentList";
import Attendance from "./pages/admin/Attendance";
import Notices from "./pages/admin/Notices";
import DashboardHome from "./pages/admin/DashboardHome";
import ConfirmPayment from "./pages/admin/ConfirmPayment";
import InvoiceHistory from "./pages/InvoiceHistory";
import BookingList from "./pages/admin/BookingList";
import AddPayment from "./pages/AddPayment";
import NoticeList from "./pages/admin/NoticeList";
import InvoiceForm from "./pages/admin/InvoiceForm";
import SettingsPage from "./pages/admin/SettingsPage";
import EventList from "./pages/admin/EventList";
import AddSettings from "./pages/admin/AddSettings";
import UserList from "./pages/admin/UserList";
import AddWorker from "./pages/admin/AddWorker";
import WorkerList from "./pages/admin/WorkerList";
import HouseSetting from "./pages/admin/HouseSetting";
import ChangePassword from "./pages/admin/ChangePassword";
import EditProfile from "./pages/admin/EditProfile";
import AddUser from "./pages/admin/AddUser";
import AddHouseSettingPage from "./pages/admin/AddHouseSettingPage";
import EventDetail from "./pages/EventDetail";
import NoticeDetail from "./pages/NoticeDetail";
import EditPayment from "./pages/EditPayment";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Start />} />
        <Route path="/signin" element={<Signin />} />
        <Route
          path="/userdash"
          element={
            <>
              <Topnav />
              <Userdash />
              <Botnav />
            </>
          }
        />
        <Route
          path="/adduserpayment"
          element={
            <>
              <AddPayment />
              <Botnav />
            </>
          }
        />
        <Route path="/invoice-detail/:id" element={<InvoiceDetail />} />
        <Route path="/payment-detail/:id" element={<PaymentDetail />} />
        <Route
          path="/display-event/event-detail/:id"
          element={<EventDetail />}
        />
        <Route path="/notice/notice-detail/:id" element={<NoticeDetail />} />
        <Route path="/editpayment/:id" element={<EditPayment />} />

        <Route
          path="/generatepass"
          element={
            <>
              <Pass />
              <Botnav />
            </>
          }
        />
        <Route
          path="/pass"
          element={
            <>
              <Passes />
              <Botnav />
            </>
          }
        />
        <Route
          path="/guard"
          element={
            <>
              <Guard />
              <Botnav />
            </>
          }
        />
        <Route
          path="/notice"
          element={
            <>
              <Notice />
              <Botnav />
            </>
          }
        />
        <Route
          path="/service"
          element={
            <>
              <Service />
              <Botnav />
            </>
          }
        />
        <Route
          path="/account"
          element={
            <>
              <Account />
              <Botnav />
            </>
          }
        />
        <Route
          path="/profile"
          element={
            <>
              <Profile />
              <Botnav />
            </>
          }
        />
        <Route
          path="/complains"
          element={
            <>
              <Complains />
              <Botnav />
            </>
          }
        />
        <Route
          path="/review"
          element={
            <>
              <Review />
              <Botnav />
            </>
          }
        />
        <Route
          path="/proadmin"
          element={
            <>
              <ToastContainer
                position="top-center"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
              />
              <Topnav />

              <Proadmin />
              <Botnav />
            </>
          }
        />
        <Route
          path="/todo"
          element={
            <>
              <Todo />
              <Botnav />
            </>
          }
        />
        <Route
          path="/request"
          element={
            <>
              <Request />
              <Botnav />
            </>
          }
        />
        <Route
          path="/completed"
          element={
            <>
              <Completed />
              <Botnav />
            </>
          }
        />

        <Route
          path="/changeprofile"
          element={
            <>
              <Changeprofile />
              <Botnav />
            </>
          }
        />
        <Route
          path="/tododetailpage"
          element={
            <>
              <Tododetail />
              <Botnav />
            </>
          }
        />
        <Route
          path="/history"
          element={
            <>
              <History />
              <Botnav />
            </>
          }
        />
        <Route
          path="/booking"
          element={
            <>
              <Booking />
              <Botnav />
            </>
          }
        />
        <Route
          path="/edit"
          element={
            <>
              <Profileedit />
              <Botnav />
            </>
          }
        />
        <Route
          path="/payment"
          element={
            <>
              <Payment />
              <Botnav />
            </>
          }
        />
        <Route
          path="/display-event"
          element={
            <>
              <DisplayEvent />
              <Botnav />
            </>
          }
        />
        <Route
          path="/userpayment"
          element={
            <>
              <UserPaymentList />
              <Botnav />
            </>
          }
        />
        <Route
          path="/invoicehistory"
          element={
            <>
              <InvoiceHistory />
              <Botnav />
            </>
          }
        />
        <Route path="/dashboard" element={<Admindash />}>
          <Route index element={<DashboardHome />} />
          <Route path="notices" element={<Notices />} />
          <Route path="confirmpayment" element={<ConfirmPayment />} />
          <Route path="paymentlist" element={<PaymentList />} />
          <Route path="noticelist" element={<NoticeList />} />
          <Route path="addevent" element={<AddEvent />} />
          <Route path="residences" element={<Residences />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="booking" element={<BookingList />} />
          <Route path="addinvoice" element={<InvoiceForm />} />
          <Route path="invoicesettings" element={<SettingsPage />} />
          <Route path="eventlist" element={<EventList />} />
          <Route path="addsettings" element={<AddSettings />} />
          <Route path="userlist" element={<UserList />} />
          <Route path="addworker" element={<AddWorker />} />
          <Route path="workerlist" element={<WorkerList />} />
          <Route path="housesettings" element={<HouseSetting />} />
          <Route path="changepassword" element={<ChangePassword />} />
          <Route path="editprofile" element={<EditProfile />} />
          <Route path="adduser" element={<AddUser />} />
          <Route path="addhousesetting" element={<AddHouseSettingPage />} />
          <Route
            path="changepassword"
            element={
              <>
                <Password />
                <Botnav />
              </>
            }
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
