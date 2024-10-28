import React, { useEffect } from "react";
import { SlArrowLeft } from "react-icons/sl";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getPublicNotices, getPrivateNotices } from "../redux/noticeSlice";
import { Skeleton } from "antd"; // Update with the correct import path

const Notice = () => {
  const dispatch = useDispatch();
  const { publicNotices, privateNotices, loading, error } = useSelector(
    (state) => state.notices
  );
  const [isPrivate, setIsPrivate] = React.useState(false);

  useEffect(() => {
    dispatch(getPublicNotices()); // Fetch public notices on component mount
  }, [dispatch]);

  useEffect(() => {
    if (isPrivate) {
      dispatch(getPrivateNotices()); // Fetch private notices if the user switches to private
    }
  }, [isPrivate, dispatch]);

  const handlePublicNoticeClick = () => {
    setIsPrivate(false);
  };

  const handlePrivateNoticeClick = () => {
    setIsPrivate(true);
  };

  if (loading) {
    return (
      <div className="p-12">
        <Skeleton active />
      </div>
    );
  }

  return (
    <div className="flex justify-center bg-slate-800 w-[100%] h-[100%]">
      <div className="w-[390px] bg-gray-200 font-roboto pb-20">
        <div className="flex px-6 py-4 bg-white">
          <div className="items-center my-auto">
            <Link to="/userdash">
              <SlArrowLeft />
            </Link>
          </div>
          <button
            className="font-bold flex justify-center flex-col mx-auto text-[22px] text-[#403F93]"
            onClick={handlePublicNoticeClick}
          >
            Public notice
            {!isPrivate && <span className="bg-[#403F93] h-1 w-32"></span>}
          </button>
          <button
            className="font-bold flex justify-center flex-col mx-auto text-[22px] text-[#403F93]"
            onClick={handlePrivateNoticeClick}
          >
            Private notice
            {isPrivate && <span className="bg-[#403F93] h-1 w-32"></span>}
          </button>
        </div>

        {!isPrivate &&
          publicNotices?.data &&
          publicNotices?.data.map((item) => (
            <div className="px-6 py-1 mt-6" key={item.id}>
              <div className="">
                <div className="px-1">
                  <h1 className="font-bold overflow-hidden text-[#403F93]">
                    {item.title}
                  </h1>
                  <p className="text-sm mt-2">
                    {item.created_at.split("T")[0]}
                  </p>
                </div>
              </div>
              <div className="bg-white p-3 mt-4 overflow-hidden rounded-md shadow-lg border-[1px] border-gray-400">
                <p>{item.notice_body}</p>
              </div>
            </div>
          ))}
        {isPrivate && (
          <>
            {privateNotices?.data?.map((item) => (
              <div className="px-6 py-1 mt-6" key={item.id}>
                <div className="">
                  <div className="px-1">
                    <h1 className="font-bold overflow-hidden text-[#403F93]">
                      {item.title}
                    </h1>
                    <p className="text-sm mt-2">{item.sent_at.split("T")[0]}</p>
                  </div>
                </div>
                <div className="bg-white p-3 mt-4 overflow-hidden rounded-md shadow-lg border-[1px] border-gray-400">
                  <p>{item.notice}</p>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default Notice;
