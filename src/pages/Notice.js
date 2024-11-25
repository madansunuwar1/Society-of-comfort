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
    <div className="bg-gray-200 font-roboto pb-20">
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
          {allNotices && allNotices.length > 0 ? (
            allNotices.map((item) => (
              <div className="px-6 py-1" key={item.id}>
                <div className="bg-white p-3 overflow-hidden rounded-md shadow-lg flex justify-between">
                  <div className="my-auto">
                    <img
                      src="https://internalsafety.tractel.com/safetygate/wp-content/uploads/2020/03/notice-icon-b.png"
                      className="h-10 w-10 object-cover rounded-md"
                    />
                  </div>
                  <div className="w-3/6">
                    <div className="flex gap-2">
                      <h1
                        className="font-bold overflow-hidden text-md my-auto text-ellipsis"
                        style={{
                          display: "-webkit-box",
                          WebkitBoxOrient: "vertical",
                          WebkitLineClamp: 1,
                        }}
                      >
                        {item.title}
                      </h1>
                    </div>
                    <p
                      className="mt-2 text-gray-600 text-sm overflow-hidden text-ellipsis"
                      style={{
                        display: "-webkit-box",
                        WebkitBoxOrient: "vertical",
                        WebkitLineClamp: 2,
                      }}
                    >
                      {item.notice_body || item.notice}{" "}
                      {/* Use notice_body or notice depending on the structure */}
                    </p>
                  </div>
                  <div className="my-auto">
                    <p className="text-sm text-gray-500">
                      {" "}
                      {new Date(item.created_at).toLocaleDateString()}
                    </p>
                    <p>
                      <span
                        className={`${getNoticeColor(
                          item.notice_type
                        )} text-[12px] px-4 py-1 text-white`}
                      >
                        {item.notice_type}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-600">No notices available.</p>
          )}
        </>
      )}
    </div>
  );
};

export default Notice;
