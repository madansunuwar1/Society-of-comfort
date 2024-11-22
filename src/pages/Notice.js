import React, { useEffect } from "react";
import { SlArrowLeft } from "react-icons/sl";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getPublicNotices, getPrivateNotices } from "../redux/noticeSlice";
import SyncLoader from "react-spinners/SyncLoader";
import { MdOutlineSpeakerNotes } from "react-icons/md";

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

  return (
    <div className="bg-gray-200 font-roboto pb-20">
      <div className="flex px-6 py-4 bg-[#3F3F95] mb-4">
        <div className="items-center my-auto">
          <Link to="/userdash">
            <SlArrowLeft className="text-white" />
          </Link>
        </div>
        <button
          className="font-bold flex justify-center flex-col mx-auto text-[22px] text-white"
          onClick={handlePublicNoticeClick}
        >
          Public notice
          {!isPrivate && <span className="bg-white h-1 w-32"></span>}
        </button>
        <button
          className="font-bold flex justify-center flex-col mx-auto text-[22px] text-white"
          onClick={handlePrivateNoticeClick}
        >
          Private notice
          {isPrivate && <span className="bg-white h-1 w-32"></span>}
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
          {!isPrivate &&
            publicNotices &&
            publicNotices?.map((item) => (
              <div className="px-6 py-1" key={item.id}>
                <div className="bg-white p-3 overflow-hidden rounded-md shadow-lg flex justify-between">
                  <div className="w-4/6">
                    <div className="">
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
                      {/* <p className="text-md my-auto overflow-hidden text-sm">
                        {item.created_at.split("T")[0]}
                      </p> */}
                    </div>
                    <p
                      className="mt-2 text-gray-600 text-sm overflow-hidden text-ellipsis"
                      style={{
                        display: "-webkit-box",
                        WebkitBoxOrient: "vertical",
                        WebkitLineClamp: 2,
                      }}
                    >
                      {item.notice_body}
                    </p>
                  </div>
                  <div className="my-auto">
                    <img
                      src="https://internalsafety.tractel.com/safetygate/wp-content/uploads/2020/03/notice-icon-b.png"
                      className="h-12 w-12 object-cover rounded-md"
                    />
                  </div>
                </div>
              </div>
            ))}

          {isPrivate &&
            privateNotices.map((item) => (
              <div className="px-6 py-1" key={item.id}>
                <div className="bg-white p-3 overflow-hidden rounded-md shadow-lg flex justify-between">
                  <div className="w-4/6">
                    <div className="">
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
                      {/* <p className="text-md my-auto overflow-hidden text-sm">
                        {item.created_at.split("T")[0]}
                      </p> */}
                    </div>
                    <p
                      className="mt-2 text-gray-600 text-sm overflow-hidden text-ellipsis"
                      style={{
                        display: "-webkit-box",
                        WebkitBoxOrient: "vertical",
                        WebkitLineClamp: 2,
                      }}
                    >
                      {item.notice}
                    </p>
                  </div>
                  <div className="my-auto">
                    <img
                      src="https://internalsafety.tractel.com/safetygate/wp-content/uploads/2020/03/notice-icon-b.png"
                      className="h-12 w-12 object-cover rounded-md"
                    />
                  </div>
                </div>
              </div>
            ))}
        </>
      )}
    </div>
  );
};

export default Notice;
