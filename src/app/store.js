import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../redux/authSlice";
import { paymentReducer } from "../redux/paymentSlice";
import { noticeReducer } from "../redux/noticeSlice";
import { userReducer } from "../redux/userSlice";
import { invoiceReducer } from "../redux/invoiceSlice";
import bookingReducer from "../redux/bookingSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    payments: paymentReducer,
    notices: noticeReducer,
    user: userReducer,
    invoices: invoiceReducer,
    bookings: bookingReducer,
  },
});
