"use client";
import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { RxEyeOpen, RxEyeNone } from "react-icons/rx";
import MdLoader from "@/components/spinner/MdLoader";
import VerifyEmail from "./VerifyEmail";
import apiHandler from "@/utils/apiHandler";

const Form = () => {
  const { toast } = useToast();
  const [userType, setUserType] = useState("Student");
  const [isPassVisiable, setIsVisiable] = useState(false);
  const [isPassVisiable2, setIsVisiable2] = useState(false);
  const [isSentOtp, setIsSentOtp] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirm_password:""
  });

  function inputHandler(e) {
    const { name, value } = e.target;
    if(name === 'confirm_password' && (formData.password !== value)){
      setError('Password does not match');
    }
    else if(formData.password === value){
      setError('');
    }
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }

  const sendOtp = async (e) => {
    e.preventDefault();
    if(formData.password !== formData.confirm_password){
      setError('Password does not match.');
      return;
    }
    setError("");
    try {
      setLoading(true);
      const data = await apiHandler("/user/send-otp", "POST", false, {email: formData.email});
      if (data.success) {
        setIsSentOtp(true);
        toast.success(data.message);
      } else {
        setError(data.message);
      }
      toast({
        title: data.success ? "Success" : "Uh oh! Something went wrong.",
        description: data.message,
      });
    } catch (err) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  if(isSentOtp){
    return (
      <div className="lg:absolute w-full h-full top-0 left-0 bg-richblack-900 z-50">
        <VerifyEmail formData={formData} userType={userType} sendOtp={sendOtp}/>
      </div>
    )
  }

  return (
    <div className="w-full md:w-[350px] lg:w-[500px] font-inter flex flex-col gap-6">
      <div className="w-full flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-richblack-50">Join the millions learning to code with StudyNotion for free</h1>
        <p className="text-sm text-richblack-200">
          Build skills for today, tomorrow, and beyond.<br/>
          <span className="italic text-blue-400 font-edu-sa">
            Education to future-proof your career.
          </span>
        </p>
      </div>

      {/* User type toggle */}
      <div className="w-full flex justify-start items-start">
        <div className="bg-richblack-800 flex items-center justify-center p-1 rounded-full border-b border-richblack-600">
          <button
            onClick={() => setUserType("Student")}
            className={`px-5 py-2 rounded-full font-medium ${
              userType === "Student"
                ? "bg-richblack-900 text-richblack-50"
                : "bg-richblack-800 text-richblack-200"
            }`}
          >
            Student
          </button>
          <button
            onClick={() => setUserType("Instructor")}
            className={`px-5 py-2 rounded-full font-medium ${
              userType === "Instructor"
                ? "bg-richblack-900 text-richblack-50"
                : "bg-richblack-800 text-richblack-200"
            }`}
          >
            Instructors
          </button>
        </div>
      </div>

      {/* Form */}
      <form className="w-full flex flex-col gap-4" onSubmit={sendOtp}>
        <div className="w-full flex flex-col lg:flex-row gap-2 gap-y-4">
          <div className="w-full flex flex-col gap-2">
            <label className="block text-sm text-richblack-50">
              First Name<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={inputHandler}
              required
              placeholder="Jone"
              className="w-full p-3 bg-richblack-800 border-b-2 border-richblack-600 text-richblack-200 outline-none rounded-lg text-base"
            />
          </div>
          <div className="w-full flex flex-col gap-2">
            <label className="block text-sm text-richblack-50">
              Last Name<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={inputHandler}
              required
              placeholder="Jone"
              className="w-full p-3 bg-richblack-800 border-b-2 border-richblack-600 text-richblack-200 outline-none rounded-lg text-base"
            />
          </div>
        </div>
        <div className="w-full flex flex-col gap-2">
          <label className="block text-sm text-richblack-50">
            Email Address<span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={inputHandler}
            required
            placeholder="Enter email address"
            className="w-full p-3 bg-richblack-800 border-b-2 border-richblack-600 text-richblack-200 outline-none rounded-lg text-base"
          />
        </div>
        <div className="w-full flex flex-col">
          <div className="w-full flex flex-col lg:flex-row gap-2 gap-y-4">
            <div className="w-full flex flex-col gap-2 relative">
              <label className="block text-sm text-richblack-50">Password<span className="text-red-500">*</span></label>
              <input
                type={isPassVisiable ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={inputHandler}
                placeholder="Enter password"
                required
                className="w-full p-3 bg-richblack-800 border-b-2 border-richblack-600 text-richblack-200 outline-none rounded-lg text-base"
              />
              <div
                className="absolute bottom-4 right-3 text-xl cursor-pointer"
                onClick={() => setIsVisiable(!isPassVisiable)}
              >
                {isPassVisiable ? <RxEyeOpen /> : <RxEyeNone />}
              </div>
            </div>

            <div className="w-full flex flex-col gap-2 relative">
              <label className="block text-sm text-richblack-50">Conform Password<span className="text-red-500">*</span></label>
              <input
                type={isPassVisiable2 ? "text" : "password"}
                name="confirm_password"
                value={formData.confirm_password}
                onChange={inputHandler}
                placeholder="Enter confirm password"
                required
                className="w-full p-3 bg-richblack-800 border-b-2 border-richblack-600 text-richblack-200 outline-none rounded-lg text-base"
              />
              <div
                className="absolute bottom-4 right-3 text-xl cursor-pointer"
                onClick={() => setIsVisiable2(!isPassVisiable2)}
              >
                {isPassVisiable2 ? <RxEyeOpen /> : <RxEyeNone />}
              </div>
            </div>
          </div>
        </div>

        <div className="w-full flex flex-col gap-1">
          {error && <p className="text-sm text-red-500 pl-2">{error}</p>}
          <button
            type="submit"
            className="w-full h-[40px] flex items-center justify-center bg-yellow-50 text-black font-semibold py-3 rounded-lg hover:bg-yellow-200"
          >
            {loading ? <MdLoader /> : "Sign up"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Form;
