import React, { useEffect } from "react";
import { SlArrowLeft } from "react-icons/sl";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllNotices } from "../redux/noticeSlice"; // Import the action for getting all notices
import SyncLoader from "react-spinners/SyncLoader";
import { MdOutlineSpeakerNotes } from "react-icons/md";

const Notice = () => {
  const dispatch = useDispatch();
  const { allNotices, loading, error } = useSelector((state) => state.notices); // Access allNotices from the store

  useEffect(() => {
    dispatch(getAllNotices()); // Fetch all notices on component mount
  }, [dispatch]);

  const getNoticeColor = (status) => {
    switch (status) {
      case "private":
        return "bg-[#2563EB] rounded-3xl";
      default:
        return "bg-[#1E3A8A] rounded-3xl";
    }
  };

  return (
    <div className="bg-gray-200 font-roboto pb-20 ">
      <div className="flex justify-between bg-[#3F3F95] px-4 py-2 w-full rounded-b-lg">
        <div className="items-center my-auto">
          <Link to="/userdash">
            <SlArrowLeft className="text-white" />
          </Link>
        </div>
        <button className="font-bold flex justify-center flex-col mx-auto text-[22px] text-white">
          All Notices
        </button>
      </div>
      <div className="px-4 mt-4">
        {loading ? (
          <div className="flex justify-center h-[80vh] align-middle items-center">
            <SyncLoader
              color="#3F3F95"
              loading={loading}
              size={15}
              aria-label="Loading Spinner"
              data-testid="loader"
            />
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-2">
              {allNotices && allNotices.length > 0 ? (
                allNotices.map((item) => (
                  <Link
                    to={`/notice/notice-detail/${item.id}`}
                    className="flex items-center justify-between bg-white shadow-sm shadow-gray-400 rounded-lg p-4 "
                  >
                    <div className="">
                      <p
                        className="text-md text-ellipsis overflow-hidden capitalize font-semibold"
                        style={{
                          display: "-webkit-box",
                          WebkitBoxOrient: "vertical",
                          WebkitLineClamp: 1,
                        }}
                      >
                        {item.title}
                      </p>
                      <p className="text-md text-gray-500">
                        {" "}
                        {new Date(item.created_at).toLocaleDateString()}
                      </p>
                      <p className="pt-2">
                        <span
                          className={`${getNoticeColor(
                            item.notice_type
                          )} text-[12px] px-4 py-1 text-white`}
                        >
                          {item.notice_type}
                        </span>
                      </p>
                      <p
                        className="text-md text-gray-600 text-ellipsis overflow-hidden pt-2"
                        style={{
                          display: "-webkit-box",
                          WebkitBoxOrient: "vertical",
                          WebkitLineClamp: 2,
                        }}
                      >
                        {item.notice_body}
                      </p>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="text-center text-gray-600">
                  No notices available.
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Notice;
