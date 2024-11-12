import React, { useState, useEffect } from "react";
import { SlArrowLeft } from "react-icons/sl";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../redux/authSlice";

const Signin = () => {
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isLoading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("user"));
    if (loggedInUser && loggedInUser.role === "super_admin") {
      navigate("/dashboard");
    } else if (loggedInUser && loggedInUser.role === "Guard") {
      navigate("/guard");
    } else if (loggedInUser && loggedInUser.role === "Apartment User") {
      navigate("/userdash");
    } else if (loggedInUser && loggedInUser.role === "Worker") {
      navigate("/proadmin");
    }
  }, [user]);

  const handlesubmit = async (event) => {
    event.preventDefault();
    dispatch(login({ email: mail, password }))
      .unwrap()
      .then((data) => {
        if (data.role === "super_admin") {
          navigate("/dashboard");
        } else if (data.role === "Guard") {
          navigate("/guard");
        } else if (data.role === "Apartment User") {
          navigate("/userdash");
        } else if (data.role === "Worker") {
          navigate("/proadmin");
        }
      })
      .catch((err) => {
        alert(err);
      });
  };

  return (
    <div className=" h-[100vh]">
      <div className=" bg-[#F9F9FF] h-[100vh] pb-20">
        <div className="flex bg-white px-4 py-4">
          <div className="items-center my-auto">
            <Link to="/">
              <SlArrowLeft />
            </Link>
          </div>
          <h3 className="font-bold flex justify-center mx-auto">Signin</h3>
        </div>
        <div className="bg-slate-200 min-h-[100vh]">
          <div className="py-4">
            <img
              src="../assets/images/image.jpeg"
              alt="logo"
              className="rounded-full w-44 h-44 mx-auto"
            />
          </div>
          <h1 className="text-[#3F3F95] text-[42px] font-bold font-roboto text-center">
            TCH II Thaiba
          </h1>
          <div className="text-center">
            <p className="text-[#3F3F95] font-bold text-[22px] font-roboto">
              welcome
            </p>
            <p className="text-[#3F3F95] text-[18px] font-roboto">
              Sign in to continue
            </p>
          </div>
          <form
            className="bg-white mx-auto p-5 my-4 rounded-lg max-w-[600px]"
            onSubmit={handlesubmit}
          >
            <div className="pt-6">
              <input
                className="bg-[#F4F5F7] rounded-xl w-full py-4 px-3 border border-slate-300"
                type="email"
                placeholder="Email"
                onChange={(e) => setMail(e.target.value)}
                value={mail}
              />
            </div>
            <div className="pt-6">
              <input
                className="bg-[#F4F5F7] rounded-xl w-full py-4 px-3 border border-slate-300"
                type="password"
                placeholder="******"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
              />
            </div>
            <div className="flex justify-between my-4">
              <div>
                <input className="mr-2 leading-tight" type="checkbox" />
                <span className="text-sm">Remember me!</span>
              </div>
              <h1>forgot password</h1>
            </div>
            <button
              type="submit"
              className="bg-[#403F93] text-white mx-auto flex px-24 py-3 rounded-3xl"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>
            {error && <p className="text-red-500 text-center mt-2">{error}</p>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signin;
