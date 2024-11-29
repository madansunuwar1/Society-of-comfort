import React, { useEffect } from "react";
import { SlArrowLeft } from "react-icons/sl";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getNoticeById } from "../redux/noticeSlice";

const NoticeDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentNotice, loading } = useSelector((state) => state.notices);

  useEffect(() => {
    if (id) {
      dispatch(getNoticeById(id));
    }
  }, [id, dispatch]);

  const getNoticeColor = (status) => {
    switch (status) {
      case "private":
        return "bg-[#2563EB] rounded-3xl";
      default:
        return "bg-[#1E3A8A] rounded-3xl";
    }
  };

  return (
    <div className="bg-gray-200 min-h-[100vh]">
      <div className="flex justify-between bg-[#3F3F95] px-4 py-2 w-full rounded-b-lg">
        <div className="items-center my-auto">
          <Link to="/notice">
            <SlArrowLeft className="text-white" />
          </Link>
        </div>
        <button className="font-bold flex justify-center flex-col mx-auto text-[22px] text-white">
          Notice Detail
        </button>
      </div>
      <div className="bg-white rounded-md p-4 m-4">
        <p className="text-xl  capitalize font-bold">{currentNotice?.title}</p>
        <p className="text-md text-gray-500">
          {" "}
          {new Date(currentNotice?.created_at).toLocaleDateString()}
        </p>
        <p className="pt-4">
          <span
            className={`${getNoticeColor(
              currentNotice?.notice_type
            )} text-md px-8 py-2 text-white`}
          >
            {currentNotice?.notice_type}
          </span>
        </p>
        <p className="text-lg text-gray-600  pt-4">
          {currentNotice?.notice_body}
        </p>
      </div>
    </div>
  );
};

export default NoticeDetail;
